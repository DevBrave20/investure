import Cloudinary from "../utils/cloudinary.js";

 const uploadImage = async (req, res, next) => {
  try {
    const file = req.files.payment_proof;
    if (!file) {
      return res.status(404).json({
        message: "No file Uploaded!"
      })
    }
    const uploads = Array.isArray(file) ? file : [file];

    for (const file of uploads) {
      const result = await Cloudinary.uploader.upload(file.tempFilePath);

      req.body.payment_proof = result.secure_url;
      req.body.payment_proof_url = result.public_id;
    }
    next();
  } catch (error) {
    next(error)
  }
};

export default uploadImage;
