import { Logger } from "winston";
import Invest from "../models/investment-model.js";
import User from "../models/users.model.js";

// Express route handler for POST /api/invest
export const invest = async (req, res) => {
  try {
    const { selected_plan, interest_percentage, amount } = req.body;
    const user = req.user;

    if (!selected_plan || !interest_percentage || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields: selected_plan, interest_percentage, amount",
      });
    }

    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    const availableBalance = parseInt(userData.withdrawable_balance);

    if (availableBalance < parseInt(amount)) {
      return res.status(400).json({
        status: "failed",
        message: `Insufficient balance. Available: ${availableBalance}, Required: ${amount}`,
      });
    }

    const investData = {
      user: userData._id,
      selected_plan,
      interest_percentage,
      amount: parseInt(amount),
      invest: true,
    };

    userData.withdrawable_balance = userData.withdrawable_balance - parseInt(amount);
    userData.total_balance = userData.total_balance ?? 0.0;
    userData.total_invest = userData.total_invest + parseInt(amount);
    userData.investment_plans.push(selected_plan);
    await userData.save();

    const investmentRecord = await Invest.create(investData);

    return res.status(201).json({
      status: "success",
      message: "Investment created successfully",
      data: investmentRecord,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
      data: error,
    });
  }
};

// Utility function for internal use
export const investUtility = async (selected_plan, interest_percentage, amount, userId) => {
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return false;
    }

    const availableBalance = parseInt(userData.withdrawable_balance);

    if (availableBalance < parseInt(amount)) {
      return false;
    }

    const investData = {
      user: userData._id,
      selected_plan,
      interest_percentage,
      amount: parseInt(amount),
      invest: true,
    };

    userData.withdrawable_balance = userData.withdrawable_balance - parseInt(amount);
    userData.total_balance = userData.total_balance ?? 0.0;
    userData.total_invest = userData.total_invest + parseInt(amount);
    userData.investment_plans.push(selected_plan);
    await userData.save();
    await Invest.create(investData);
    return true;
  } catch (error) {
    console.error("Error in investUtility:", error);
    return false;
  }
};

export const updateInvestment = async () => {
  try {
    const investments = await Invest.find();
    if (!investments || investments.length === 0) {
      console.log("No investments found");
      return;
    }

    for (const data of investments) {
      if (data.invest === true) {
        // const percentagePerMinutes = data.interest_percentage / 1440;

        const incrementByPercentage = (amountAtHand, percentage) => {
          const v = amountAtHand + (amountAtHand * percentage) / 100;
          return v - amountAtHand;
        };

        const result = incrementByPercentage(data.amount, data.interest_percentage);

        // data.amount = amountToIncrease;

        const user = await User.findById(data.user);
        if (!user) {
          console.log(`No user found for investment ID ${data._id}`);
          continue;
        }
        // const amountToIncrease =  user.total_balance + result;

        user.total_balance += result;

        // await data.save();
        await user.save();

        console.log(`Investment updated successfully for user ${user.first_name}`);
      }
    }
  } catch (error) {
    console.error("Error updating investments:", error);
  }
};

// export const schedular = cron.schedule('0 0 * * *', async ()=>{
//     try
//     {
//         logger.info('Cron job started at:', new Date().toLocaleString());
//         await updateInvestment();
//         logger.info('Cron job completed at:', new Date().toLocaleString());
//     }catch (error) {
//         logger.error('Error during cron job execution:', error);
//     }
// });
