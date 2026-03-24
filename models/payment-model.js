import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    payment_name:  {
        type: String
    },
    image: {
        type: String
    },
    image_url: {
        type: String
    },
    address_url: {
        type: String
    }
},{
    timestamps: true,
    versionKey: false
});

const Payment =  mongoose.model("payment", paymentSchema);

export default Payment;
