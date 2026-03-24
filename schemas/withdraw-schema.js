import * as yup from "yup";

const withdrawSchema = yup.object({
    amount: yup.number().required(),
    payment_channel : yup.string().required().min(1),
    wallet_address: yup.string().required().min(3)
});

export const withdrawProfitSchema = yup.object({
    amount: yup.number().required()
})
export  default withdrawSchema;
