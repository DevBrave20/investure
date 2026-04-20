import Admin from "../models/admin-model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateAdminToken } from "../utils/jwt.token.js";
import Cloudinary from "../utils/cloudinary.js";
import Payment from "../models/payment-model.js";
import User from "../models/users.model.js";
import mailSender from "../middlewares/email.js";
dotenv.config();

class AdminController {
  verification_code = process.env.ADMIN_VERIFY_KEY;

  async signUp(req, res) {
    try {
      const { user_name, password, email } = req.body;
      const adminEmail = await Admin.findOne({ email });
      if (adminEmail) {
        res.status(400).json({
          message: "Email Already exists",
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const adminData = {
        user_name,
        email,
        password: hashPassword,
      };
      await Admin.create(adminData);
      return res.status(201).json({
        messsage: "success",
      });
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid email or password!",
        });
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid email or password!",
        });
      }
      const token = generateAdminToken(admin._id, false, admin.user_name);
      const { password: _, ...userResponse } = admin.toObject();
      return res.status(200).json({
        message: "success",
        token,
        data: userResponse,
      });
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async validateAdmin(req, res) {
    try {
      const id = req.params.id;
      const { code } = req.body;
      const verificationCode = process.env.ADMIN_VERIFY_KEY;
      if (code !== verificationCode) {
        return res.status(400).json({
          message: "Verification failed",
        });
      }
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }
      const token = generateAdminToken(admin._id, true, admin.user_name);
      return res.status(200).json({
        message: "success",
        token,
      });
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async admin(req, res) {
    try {
      const admin_id = req.admin;
      const id = admin_id._id;
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      } else {
        return res.status(200).json({
          message: "success",
          data: admin,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async uploadPaymentOptions(req, res) {
    try {
      const { payment_name, address } = req.body;
      const file = req.files.image;
      if (!file) {
        return res.status(404).json({
          message: "No file Uploaded!",
        });
      }
      const result = await Cloudinary.uploader.upload(file.tempFilePath);
      const paymentData = {
        payment_name,
        image: result.secure_url,
        image_url: result.public_id,
        address,
      };
      const payment = await Payment.create(paymentData);
      return res.status(201).json({
        message: "success",
        data: payment,
      });
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async getAllPaymentOptions(req, res) {
    try {
      const payment = await Payment.find();
      if (payment.length === 0) {
        return res.status(404).json({
          message: "No payment methods for now",
        });
      } else {
        return res.status(200).json({
          message: "success",
          data: payment,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async getSinglePaymentMethod(req, res) {
    try {
      const type = req.query.type;
      const paymentMethod = await Payment.findOne({ payment_name: type });
      if (!paymentMethod) {
        return res.status(404).json({
          message: `No payment methods for With this name ${type}`,
        });
      } else {
        return res.status(200).json({
          message: "success",
          data: paymentMethod,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async allUsers(req, res) {
    try {
      const admin_id = req.admin;
      const id = admin_id._id;
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }
      const users = await User.find();
      if (!users) {
        return res.status(200).json({
          message: "No users currently",
        });
      } else {
        return res.status(200).json({
          message: "success",
          total_users: users.length,
          users,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async singleUser(req, res) {
    try {
      const admin_id = req.admin;
      const user_id = req.params.id;
      const id = admin_id._id;
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      } else {
        return res.status(200).json({
          message: "success",
          data: user,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: "failed",
        message: error.message,
      });
    }
  }
  async sendFollowUpEmail(req, res) {
    try {
      const admin_id = req.admin;
      const user_id = req.params.id;
      const { subject, message } = req.body;

      // Verify admin
      const admin = await Admin.findById(admin_id._id);
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }

      // Find user
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Send email using nodemailer or your preferred email service
      const emailTemplate = {
        body: {
          name: user.user_name,
          intro: [
            `${message}`,
          ],
          action: {
            instructions: "To continue to our platform, please click the button below:",
            button: {
              color: "#22BC66", // Green button
              text: "Complete Your Process",
              link: "https://www.investure.com/dashboard"
            }
          },
          outro: [
            "Need help? Just reply to this email - we're always here to help!",
            "Best regards,",
            "The Cryptexion Team"
          ],
          signature: "Best regards"
        }
      };
      mailSender({
        from: {
          address: process.env.EMAIL
        },
        email: user.email,
        subject: subject,
        message,
        html: emailTemplate
      });

      return res.status(200).json({
        message: "Follow-up email sent successfully",
        data: {
          user: user.email,
          subject,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
}

export default AdminController;
