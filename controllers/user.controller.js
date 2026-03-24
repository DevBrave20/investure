import bcrypt from "bcrypt";
import Fuse from "fuse.js";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/users.model.js";
import {changePasswordSchema, userLoginSchema, userSchemaValidation, userVerification} from "../schemas/user.schema.js";
import { generateUserToken } from "../utils/jwt.token.js";
import mailGenerator from "../utils/mail.generator.js";
import mailSender from "../middlewares/email.js";
import Invest from "../models/investment-model.js";
import Transaction from "../models/transaction-model.js";

const updateVerification = async(user_id)=>{
    const entity = await User.findById(user_id);
    if(!entity){
        throw new Error
    };
    console.log("connect");
    entity.verification_code = null;
    await entity.save();
};

export const signup = async ( req, res, next )=>{
    try {
        const { firstName, lastName, email, password, referralCode, phoneNumber } = req.body;
        await userSchemaValidation.validateAsync({ firstName, lastName, email, password, phoneNumber });

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
            message: "Email already taken!"
        })
        };

        const saltPass = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltPass);
        // generate a random verification code
        const verifyToken = () => {
        const digits = '0123456789';
        let uniqueNumber = '';
  
        while (uniqueNumber.length < 6) {
            const randomDigit = digits.charAt(Math.floor(Math.random() * digits.length));
  
        if (!uniqueNumber.includes(randomDigit)) {
        uniqueNumber += randomDigit;
         }
        }
  
        return uniqueNumber;
        };
        const verificationCode = parseInt(verifyToken());
        const code = firstName.slice(0, 2) + lastName.slice(0, 2) + verificationCode.toString().slice(0, 3);
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            verification_code: verificationCode,
            referral_code: code,
            phoneNumber
          };
          const user = new User(userData);
          
          if(referralCode !== undefined && referralCode === "".length > 0){
            const checkReferral = await User.findOne({referral_code: referralCode});
            if(!checkReferral){
                return res.status(404).json({
                    message: "Referral code does not exist. Please check again"
                });
            };
            const transaction = {
              user_id: checkReferral._id,
              withdrawable_balance: 50,
              transaction_type: "referral",
              status: "success",
              payment_method: "referral"
            };
            await Transaction.create(transaction);
            checkReferral.withdrawable_balance = checkReferral.withdrawable_balance + 50;
            await checkReferral.save();
            user.referral_id = checkReferral._id
          }
        await user.save();

        const emailContent = {
            body: {
              name: user.last_name,
              intro: `Welcome to Quantumtrade! Your verification code is: <br>
            <strong style="display: flex; justify-content: center; font-size: 20px; font-family: Arial, Helvetica, sans-serif; color: black;">${verificationCode}</strong>`,
              outro: 'Need help, or have questions? Just reply to this email.',
            },
          };
          const emailBody = mailGenerator.generate(emailContent);
          const emailText = mailGenerator.generatePlaintext(emailContent);
        
          mailSender({
            from: {
              address: process.env.EMAIL
            },
            email: user.email,
            subject: "Kindly verify!",
            message: emailText,
            html: emailBody
          });
        const { password: _,verification_code, ...userResponse } = user.toObject();

        setTimeout(() => {
            updateVerification(user._id)
        }, 1800000); 
        
        return res.status(201).json({
            status: "success",
            userResponse
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error
        });
    }
};

export const loginUser = async (req, res )=>{
    try {
        const { email, password } = req.body;
        await userLoginSchema.validateAsync({ email, password });

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                status: "failed",
                message: "Invalid email or password!"
            })
        };
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                status: "failed",
                message: "Invalid email or password!"
            })
        };

        const isVerified = user.isVerified;
        if(!isVerified){
            return res.status(400).json({
                message: "Please verify your account👌😍"
            })
        }
        const token = generateUserToken(user._id, false, user.user_name);
        const { password: _, ...userResponse } = user.toObject();
        return res.status(200).json({
            ststus: "success",
            data: {
                token,
                data: userResponse
            } 
        })
    } catch (error) {
        return res.status(500).json({
            ststus: "failed",
            message: error.message
        }) 
    }
};

export const verifyUser = async (req, res, next ) =>{
    try {
        const { verifyCode } = req.body;

        await userVerification.validateAsync({verifyCode});
        const VerificationCode = await User.findOne({ verification_code : verifyCode });

        if (!VerificationCode) {
          return res.status(400).json({
            message: "Invalid code try again😳"
          });
        };
      
        VerificationCode.isVerified = true;
        await VerificationCode.save();
      
        return res.status(200).json({
            message: "Verification successful👍😍"
        })
    } catch (error) {
        return res.status(500).json({
            ststus: "failed",
            message: error.message
        }) 
    }
};

export const forgotPassword = async (req, res, next)=>{
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({
            message: "Email does not exist please check again"
          })
        }
      
        const changeAccountRoute = `https://www.expertcoininvest.com/#/resetpassword/${user._id}`;      
        const emailContent = {
          body: {
            signature: "Sincerely",
            name: `${user.last_name}`,
            intro: `You have requested to reset your password. Please click the button below to proceed:`,
            action: {
              instructions: 'To reset your password, please click the button below:',
              button: {
                color: '#e5c56d',
                text: 'Reset Password',
                link: changeAccountRoute,
              },
      
            },
            outro: 'If you did not sign up for our site, you can ignore this email.',
          },
        };
        const emailBody = mailGenerator.generate(emailContent);
        const emailText = mailGenerator.generatePlaintext(emailContent);
      
        mailSender({
          from: {
            address: process.env.EMAIL
          },
          email: user.email,
          subject: "Reset Password!",
          message: emailText,
          html: emailBody
        });
        return res.status(200).json({
            message: "A link has been sent to your email please check."
        })
    } catch (error) {
        return res.status(500).json({
            ststus: "failed",
            message: error.message
        })  
    }
};

export const changePassword = async (req, res, next)=>{
    try {
        const currentUser = req.params.id;
        const { password } = req.body;
        await changePasswordSchema.validateAsync({password});
        const user = await User.findById(currentUser);
        if (!user) {
          return res.status(404).json({
            message: "user not found."
          })
        };
      
        const newPassword = await bcrypt.compare(password, user.password)
        if (newPassword) {
          return res.status(400).json({
            message: 'Please input password different from the previous one.' 
          }) 
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.updateOne({
            _id:  user._id},
          {
            password: hashPassword
          });
        return res.status(200).json({
            message: "Update successful."
        })
    } catch (error) {
        return res.status(500).json({
            ststus: "failed",
            message: error.message
        })  
    }
};



// resend verification
const resendVerificationEmail = async (req, res) => {
    try {
      // get user email from request body
      const { email } = req.body;
      if (!email) {
        return res.status(404).json({
          error: "Please enter email address"
        });
      }
  
      // find user
      const user = await userModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          error: "User not found"
        });
      }
  
      // Check if user has already been verified
      if (user.isVerified) {
        return res.status(400).json({
          error: "User already verified"
        });
      }
  
      // create a token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30 mins" });
  
      const subject = "Email Verification";
      const link = `https://chowfinderapp.onrender.com/#/verification/${token}`;
      const html = await mailTemplate(link, user.fullName);
      const mail = {
        email: email,
        subject,
        html,
      };
      sendEmail(mail);
  
      res.status(200).json({
        message: `Verification email sent successfully to your email: ${user.email}`
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
};

export const singleUser = async (req, res )=>{
    try {
        const user = req.user;
        const userData = await User.findById(user._id);
        if(!userData){
            return res.status(404).json({
                message: "User not found."
        })
        }
        return res.status(200).json({
            message: "User retrieved",
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
          })  
    }
};

export const createTransactionnPin = async (req, res)=>{
  try {
    const { pin } = req.body;
    const user = req.user;
    const userData = await User.findById(user._id);
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };
    if(userData.payment_pin != null){
      return res.status(400).json({
        message: "action already implemented."
      })
    }
    userData.payment_pin = pin;
    userData.save();
    return  res.status(200).json({
      message: "pin setted successfully",
  });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    })
  }
};

export const updatePaymentPin = async (req, res)=>{
  try {
    const { pin } = req.body;
    const user = req.user;
    const userData = await User.findById(user._id);
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };
    const previousPin = userData.payment_pin;
    if(previousPin === pin){
      return res.status(400).json({
        message: "Payment pin cannot be the same as the previous pin."
      })
    }
    userData.payment_pin = pin;
    userData.save();

    return  res.status(200).json({
      message: "pin updated successfully",
  });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    })
  }
};

export const validatePaymentPin = async (req, res)=>{
  try {
    const { pin } = req.body;
    const user = req.user;
    const userData = await User.findById(user._id);
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };
    const previousPin = userData.payment_pin;
    if(pin !==  previousPin){
      return res.status(400).json({
        message: "wrong pin, try again"
      })
    }else{
      return res.status(200).json({
        message: "success",
    });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    })
  }
};

export const updateUserProfile = async (req, res )  =>{
  try {
    const { first_name, last_name, email } = req.body;
    const user_id = req.user._id;
    const userData = await User.findById(user_id);
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };
    const userProfile = {
      first_name,
      last_name,
      email
    };
    await User.updateOne({
      _id: user_id
    }, {
        first_name,
        last_name,
        email
    });
    return res.status(200).json({
      message: "success"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    }) 
  }
};

export const updatePassword = async (req, res)=>{
  try {
    const { current_password, new_password } = req.body;
    const user_id = req.user._id;
    const userData = await User.findById(user_id);
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };

    const validateCurrentPassword = await bcrypt.compare(current_password, userData.password);
    if(!validateCurrentPassword){
      return res.status(400).json({
        message: "Current password is not correct try again"
      }) 
    };
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await User.findByIdAndUpdate({
      _id: user_id
    },{
      password: hashedPassword
    },{
      new : true
    });
    return res.status(200).json({
      message: "success"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    }) 
  }
};
"Cannot use the same password as previous."

export const deleteUser = async (req, res)=>{
  try {
    const user_id = req.params.id;
    const usersInvestmentsPlans = await Invest.find({user: user_id});
    if(usersInvestmentsPlans.length < 0){
      return;
    };
    for (const data of usersInvestmentsPlans) {
      if(data.invest === true){
        await Invest.findByIdAndDelete({
          _id: data._id
        });
      }
    };
    await User.findByIdAndDelete(user_id);
    return res.status(200).json({
      message: "success"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    }) 
  }
};

export const updateUserData = async (req,res)=>{
  try {
    const user_id = req.params.id;
    const { first_name, last_name, email,total_balance, total_invest,withdrawable_balance  } = req.body;
    const userData = await User.findById(user_id);
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };

    await User.updateOne({
      _id: user_id
    },{ first_name, last_name, email,total_balance, total_invest,withdrawable_balance  } );
    return res.status(200).json({
      message: "success"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    }) 
  }
};
 
export const referralCode = async (req, res)=>{
  try {
    const code = req.params.user;
    const userData = await User.findOne({first_name: code});
    if(!userData){
        return res.status(404).json({
            message: "User not found."
    })
    };
    return res.status(200).json({
      message: "success",
      data: userData.referral_code
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    })
  }
};

export const affiliatedUsers = async  (req, res)=>{
  try {
    const user_id = req.user._id;
    const users = await User.find({referral_id: user_id});
    if(users.length === 0){
      return res.status(200).json({
        message: "No data available in table"
      })
    }else{
      return res.status(200).json({
        message: "success",
        data: users.map((user)=> {
          user.password = undefined;
          user.verification_code = undefined;
          return user
        })
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    })
  }
};

export const search = async (req, res ) => {
  try {
    const { search } = req.body;
    const user_id = req.user._id;
    const options = {
        includeScore: true,
        keys: ['first_name', 'last_name', 'referral_code', 'referral_id', '_id']
      };
    const products = await User.find({referral_id: user_id});
    const fuse = new Fuse(products, options)

    const results = fuse.search(search)
    if (results.length === 0) {
      return {
        message: "No product found",
        data: {}
      }
    };
    return res.status(200).json({
      message: "success",
      data: results.map((result) => result.map((item) => {
        item.item.password = undefined;
        item.item.verification_code;
        return item.item
     } ))
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false
    })
  }
};
