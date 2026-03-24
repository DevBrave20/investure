import { Logger } from "winston";
import Invest from "../models/investment-model.js";
import User from "../models/users.model.js";

export const invest = async (selected_plan, interest_percentage, amount, userId)=>{
    try {
        const userData = await User.findById(userId);
        if(!userData){
            return false;
        };
        const availableBalance = parseInt(userData.withdrawable_balance);

        if(availableBalance < parseInt(amount)){
           return false
        };
        const investData = {
            user: userData._id,
            selected_plan,
            interest_percentage,
            amount: parseInt(amount),
            invest: true
        };

        userData.withdrawable_balance = userData.withdrawable_balance - parseInt(amount);
        userData.total_balance = userData.total_balance ?? 0.00;
        userData.total_invest = userData.total_invest + parseInt(amount);
        userData.investment_plans.push(selected_plan);
        userData.save();
        await Invest.create(investData);
        return true;
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            data: error
        }); 
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
            const v = amountAtHand + (amountAtHand * percentage / 100);
            return v - amountAtHand;
          };
  
          const result = incrementByPercentage(data.amount, data.interest_percentage);

          // data.amount = amountToIncrease;
  
          const user = await User.findById(data.user);
          if (!user) {
            console.log(`No user found for investment ID ${data._id}`);
            continue;
          };
          // const amountToIncrease =  user.total_balance + result;

          user.total_balance += result;
  
          // await data.save();
          await user.save();
  
          console.log(`Investment updated successfully for user ${user.first_name}`);
        }
      }
    } catch (error) {
      console.error('Error updating investments:', error);
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
 