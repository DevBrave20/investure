import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    total_balance: {
        type: Number,
        default: 0.00
    },
    withdrawable_balance: {
        type: Number,
        default: 0.00
    },
    payment_method: {
        type: String
    },
    transaction_type: {
        type: String,
        enum: ["deposit", "withdraw", "withdraw_profit", "referral"],
    },
    processed: {
        type: Boolean,
        default: false
    },
    wallet_address: {
        type: String
    },
    status: {
        type: String,
        default: "processing"
    },
    payment_proof: {
        type: String
    },
    payment_proof_url: {
        type: String
    }, 
    investment: {
        selected_plan: {
            type: String,
            default: null
        },
        interest_percentage: {
            type: Number
        },
        investment_date: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number
        },
    }
},{
    timestamps: true,
    versionKey: false
});

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;