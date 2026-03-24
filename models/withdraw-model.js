import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    amount: {
        type: Number,
        default: 0.00
    },
    payment_method: {
        type: String
    },
    processed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["pending", "success", "fail"],
        default: "pending"
    },
    wallet_address: {
        type: String
    },
    withdraw_type: {
        type: String,
        enum: ["withdraw", "withdraw_profit"],
    }
},{
    timestamps: true,
    versionKey: false
});

const Withdraw = mongoose.model("withdraw", withdrawSchema);

export default Withdraw;