import mailSender from "../middlewares/email.js";
import Transaction from "../models/transaction-model.js";
import User from "../models/users.model.js";
import Withdraw from "../models/withdraw-model.js";
import Cloudinary from "../utils/cloudinary.js";
import { invest } from "./invest-controller.js";
import { renderEmailTemplate } from "../utils/email-templates.js";

export const  deposit = async (req, res)=>{
    try {
        const { amount, payment_method, wallet_address, selected_plan, interest_percentage  } = req.body;
        const user = req.user;
        const userData = await User.findById(user._id);

        if(!userData){
            return res.status(404).json({
                message: "User not found."
        })
        }
        const file = req.files?.payment_proof;
        if (!file) {
            return res.status(404).json({
            message: "No file Uploaded!"
            })
         }
        const result = await Cloudinary.uploader.upload(file.tempFilePath);
         const depositData = {
            user_id: user._id,
            withdrawable_balance: parseInt(amount),
            payment_method,
            wallet_address,
            transaction_type: "deposit",
            payment_proof: result.secure_url,
            payment_proof_url: result.public_id,
            investment: {
                selected_plan,
                interest_percentage,
                amount: parseInt(amount)
            }
        };
        const deposit = await Transaction.create(depositData);
        const { html: emailBody, text: emailText } = await renderEmailTemplate("depositInitiated", {
          transaction: {
            amount: `$${deposit.investment.amount}`,
            id: deposit._id,
          },
          timestamp: new Date(deposit.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        });

          mailSender({
            from: {
              address: 'cryptexionhq@gmail.com'
            },
            email: userData.email,
            subject: "Payment Being proccessed!",
            message: emailText,
            html: emailBody
          });
        return res.status(200).json({
             message: "Deposit Currently being  processed.",
             data: deposit
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
            data: error
        });
    }
};

export const confirmPayment = async (req, res ) =>{
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findOne({ $and: [{_id: transactionId}, {processed: false}]});
        console.log(transaction);
        if(!transaction){
            return res.status(404).json({
                message: "Transaction not found or already processed."
            })
        }
        if(transaction.transaction_type === 'withdraw'){
            const withdraw = await Withdraw.findOne({ $and: [{user_id: transaction.user_id}, {status: "pending"}]});
            withdraw.status = "success";
            await withdraw.save();
            transaction.status = "completed";
            await transaction.save();
            return res.status(200).json({
                message: "Payment confirmed successful."
            })
        }
        else{
             const userWhoMadeTheTransaction = await User.findById(transaction.user_id);
             if(!userWhoMadeTheTransaction){
                return res.status(404).json({
                    message: "User not found."
                })
             };
             const availableBalance = parseInt(userWhoMadeTheTransaction.withdrawable_balance);
             const amount = availableBalance + parseInt(transaction.withdrawable_balance);
             userWhoMadeTheTransaction.withdrawable_balance = amount;
             transaction.processed = true; 
             transaction.status = "completed";
             await transaction.save();
             await userWhoMadeTheTransaction.save();
             const invests = await invest(transaction.investment.selected_plan, transaction.investment.interest_percentage, transaction.investment.amount, transaction.user_id);
             if(!invest){
                return res.status(500).json({
                    message: "An error occured while processing the payment."
                })
             }

             const { html: emailBody, text: emailText } = await renderEmailTemplate("depositCompleted", {
                transaction: {
                  amount: `$${transaction.withdrawable_balance}`,
                },
             });

             mailSender({
                from: {
                  address: process.env.EMAIL
                },
                email: userWhoMadeTheTransaction.email,
                subject: "Deposit Completed Successfully",
                message: emailText,
                html: emailBody
             });

             return res.status(200).json({
                message: "Payment confirmed successful."
             })
        }
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            data: error
        }); 
    }
};

export const rejectPayment = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findOne({
          $and: [{ _id: transactionId }, { processed: false }, { transaction_type: "deposit" }],
        });

        if (!transaction) {
          return res.status(404).json({
            message: "Deposit transaction not found or already processed.",
          });
        }

        const user = await User.findById(transaction.user_id);
        if (!user) {
          return res.status(404).json({
            message: "User not found.",
          });
        }

        transaction.processed = true;
        transaction.status = "failed";
        await transaction.save();

        const { html: emailBody, text: emailText } = await renderEmailTemplate("depositFailed", {
          transaction: {
            amount: `$${transaction.withdrawable_balance}`,
          },
        });

        mailSender({
          from: {
            address: process.env.EMAIL,
          },
          email: user.email,
          subject: "Deposit Failed",
          message: emailText,
          html: emailBody,
        });

        return res.status(200).json({
          message: "Payment marked as failed.",
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }
};

export const listAllTransactions = async  (req, res )=>{ 
    try {
        const allTransactions = await Transaction.find();
        if(allTransactions.length  === 0){
            return res.status(200).json({
                message: "Transactions currently empty at the moment."
            })
        }else{
            return res.status(200).json({
                message: "success",
                data: allTransactions.reverse()
            })
        };
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            data: error
        });  
    }
};

export const userTransactionHistory = async (req, res)=>{
    try {
        const user = req.user;
        const userData = await User.findById(user._id);

        if(!userData){
            return res.status(404).json({
                message: "User not found."
        })
        }

        const allTransactions = await Transaction.find({user_id:  user._id});
        if(!allTransactions){
            return res.status(200).json({
                message: "No transactions yet."
            })
        }else{
            return res.status(200).json({
                message: "success",
                data: allTransactions
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            data: error
        });  
    }
};

export const totalAmountDeposited = async (req, res)=>{
    try {
        const allTransactions = await Transaction.find();
        if(!allTransactions){
            return res.status(200).json({
                message: "success",
                data: 0.00
            })
        };
        const totalDeposits = allTransactions.reduce((sum, record) => sum + record.withdrawable_balance, 0);
        return res.status(200).json({
            message: "success",
            data: totalDeposits
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        });  
    }
};

export const totalPendingAmount= async (req, res)=>{
    try {
        const allTransactions = await Transaction.find({status: "processing"});
        if(!allTransactions){
            return res.status(200).json({
                message: "success",
                data: 0.00
            })
        };
        const totalDeposits = allTransactions.reduce((sum, record) => sum + record.withdrawable_balance, 0);
        return res.status(200).json({
            message: "success",
            data: totalDeposits
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        });  
    }
};

export const depositTransactions = async (req, res )=>{ 
    try {
        const user = req.user;
        const allTransactions = await Transaction.find({transaction_type: "deposit", user_id: user._id});
        if(!allTransactions){
            return res.status(200).json({
                message: "Transactions currently empty at the moment."
            })
        }else{
            return res.status(200).json({
                message: "success",
                data: allTransactions
            })
        };
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            data: error
        });  
    }
};
