import moment from "moment";
import User from "../models/users.model.js";
import Withdraw from "../models/withdraw-model.js";
import Transaction from "../models/transaction-model.js";
import Invest from "../models/investment-model.js";

class WithdrawControllers {
  async withdrawToWallet(req, res) {
    const user = req.user;
    const { amount, payment_channel, wallet_address } = req.body;
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const userBalance = userData.withdrawable_balance;
    if (userBalance < amount) {
      return res.status(400).json({
        message: "Insuffient  funds",
      });
    }
    const withdrawData = {
      user_id: user._id,
      amount,
      payment_method: payment_channel,
      wallet_address,
      withdraw_type: "withdraw",
    };

    const data = await Withdraw.create(withdrawData);
    const currentBalance = userBalance - amount;
    userData.withdrawable_balance = currentBalance;
    await userData.save();
    const transactionDetails = {
      user_id: user._id,
      withdrawable_balance: amount,
      payment_method: payment_channel,
      transaction_type: "withdraw",
      wallet_address,
      status: "processing",
    };
    await Transaction.create(transactionDetails);
    return res.status(200).json({
      message: "success",
      data: data,
    });
  }

  async withdrawalHistory(req, res) {
    const user = req.user;
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const withdrawals = await Withdraw.find({ user_id: userData._id });
    if (withdrawals.length === 0) {
      return res.status(200).json({
        message: "No withdrawals yet",
      });
    } else {
      return res.status(200).json({
        message: "success",
        data: withdrawals,
      });
    }
  }

  async withdrawProfit(req, res) {
    try {
      const user = req.user;
      const { amount } = req.body;
      const userData = await User.findById(user._id);
      if (!userData) {
        return res.status(404).json({
          message: "User not found.",
        });
      };
      const investments = await Invest.find({ user:user._id });

      if (investments.length === 0) {
        return { success: false, message: 'No investments available for withdrawal' };
      }

    let successfulWithdrawals = 0;
    let failedWithdrawals = 0;
    const profitBalance = userData.total_balance;
    if (Number(amount) > profitBalance) {
      return res.status(400).json({
        message: "Insuffient  funds",
      });
    }

    for (const investment of investments) {
      const daysPassed = moment().diff(moment(investment.investment_date), 'days');
        console.log(daysPassed);
      if (daysPassed >= 30) {
        const currentBalance = userData.withdrawable_balance + Number(amount);
        successfulWithdrawals++;
        userData.total_balance = profitBalance - Number(amount);
        userData.withdrawable_balance = currentBalance;
        await userData.save();
        await Withdraw.create({
          user_id: user._id,
          amount: Number(amount),
          payment_method: "wallet balance",
          wallet_address: "",
          withdraw_type: "withdraw profit"
        });
        const transactionDetails = {
          user_id: user._id,
          withdrawable_balance: currentBalance,
          payment_method: "Profit Withdrawal",
          transaction_type: "withdraw profit",
          wallet_address: "wallet balance",
          status: "completed",
        };
        const data = await Transaction.create(transactionDetails);
        return res.status(200).json({
          message: "success",
          data,
        });
        
      } else {
        failedWithdrawals++;
        return res.status(400).json({
          message: "Withdrawal failed. Please wait for 30 days to withdraw your profit."
        })
      }
    }

    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
        data: error,
      });
    }
  }
}

export default WithdrawControllers;
