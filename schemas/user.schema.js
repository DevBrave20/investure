import Joi from "joi";



export const userSchemaValidation = Joi.object({
  firstName: Joi.string().min(2).regex((/^[A-Za-z\s]*$/)).required('Username is required.'),
  lastName: Joi.string().min(2).regex((/^[A-Za-z\s]*$/)).required('Username is required.'),
  email: Joi.string().email().required('email is required.'),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required('phone number is required.'),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required('email is required.'),
    password: Joi.string().min(6).required()
});

export const userVerification = Joi.object({
    verifyCode: Joi.number().min(6).required('Verify code is required')
});

export const changePasswordSchema = Joi.object({
    password: Joi.string().min(6,).required('Verify code is required')
});
