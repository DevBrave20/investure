import * as yup from "yup";

const paymentPinValidations = yup.object({
    pin: yup.number().required().min(4)
});

export  default paymentPinValidations;
