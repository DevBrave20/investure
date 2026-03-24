import mongoose, {model, Schema} from "mongoose";

const userSchema = new Schema({
    first_name : {
        type: String,
        require: true
    },
    last_name : {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    image_url: {
        type:  String
    },
    verification_code: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    total_balance: {
        type: Number,
        default: 0.00
    },
    total_invest: {
        type: Number,
        default: 0.00
    },
    withdrawable_balance: {
        type: Number,
        default: 0.00
    },
    investment_plans: [{
        type: String,
        default: "none"
    }],
    reference_id: {
        type: String
    },
    country: {
        type: String
    },
    payment_pin: {
        type: Number
    },
    referral_code: {
        type: String
    },
    referral_id: {
        type: String
    },
    phoneNumber: {
        type: String
    }
},{
    timestamps: true,
    versionKey: false
});

const User = model("user", userSchema);

export default User;
