import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateUserToken = (_id, isAdmin, user_name ) => {
    const userToken = jwt.sign({
      _id,
      user_name,
      isAdmin,
    }, process.env.SECRET_TOKEN)
  
    return userToken;
};

export const generateAdminToken = (_id, isAdmin, user_name ) => {
    const userToken = jwt.sign({
      _id,
      user_name,
      isAdmin,
    }, process.env.ADMIN_TOKEN,{
        expiresIn: "1d"
    })
  
    return userToken;
};
