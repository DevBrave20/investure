import mongoose from "mongoose";

const investSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    selected_plan: {
        type: String,
        default: null
    },
    holiday_profit: {
        type: String,
        default: "null"
    },
    invest: {
        type: Boolean,
        default: false
    },
    interest_percentage: {
        type: Number
    },
    investment_date: {
        type: Date,
        default: Date.now
    },
    capital_bank: {
        type: String,
        default: "null"
    },
    amount: {
        type: Number
    },
    payment_method: {
        type: String,
        default: "Quantumtrade_wallet"
    }
},{
    timestamps: true,
    versionKey: false
});

const Invest = mongoose.model("invest", investSchema);

export default Invest;
