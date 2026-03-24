import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QuantumTrade API Documentation",
      version: "1.0.0",
      description: "Complete API documentation for QuantumTrade - A cryptocurrency investment platform",
      contact: {
        name: "API Support",
        email: "support@cryptexion.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4007/api",
        description: "Development server",
      },
      {
        url: "https://api.quantumtrade.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            firstName: {
              type: "string",
              description: "User first name",
            },
            lastName: {
              type: "string",
              description: "User last name",
            },
            email: {
              type: "string",
              description: "User email address",
            },
            password: {
              type: "string",
              description: "User password (hashed)",
            },
            phoneNumber: {
              type: "string",
              description: "User phone number",
            },
            image: {
              type: "string",
              description: "User profile image",
            },
            total_balance: {
              type: "number",
              description: "Total balance",
              default: 0,
            },
            total_invest: {
              type: "number",
              description: "Total investment amount",
              default: 0,
            },
            withdrawable_balance: {
              type: "number",
              description: "Amount available to withdraw",
              default: 0,
            },
            isVerified: {
              type: "boolean",
              description: "Email verification status",
              default: false,
            },
            verification_code: {
              type: "number",
              description: "Email verification code",
            },
            referralCode: {
              type: "string",
              description: "User referral code",
            },
          },
        },
        Investment: {
          type: "object",
          required: ["amount", "selected_plan"],
          properties: {
            _id: {
              type: "string",
            },
            user: {
              type: "string",
              description: "User ID (reference)",
            },
            selected_plan: {
              type: "string",
              description: "Investment plan name",
            },
            amount: {
              type: "number",
              description: "Investment amount",
            },
            interest_percentage: {
              type: "number",
              description: "Interest percentage rate",
            },
            investment_date: {
              type: "string",
              format: "date-time",
              description: "Date of investment",
            },
            payment_method: {
              type: "string",
              description: "Payment method used",
            },
            invest: {
              type: "boolean",
              description: "Investment status",
            },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            user_id: {
              type: "string",
              description: "User ID",
            },
            transaction_type: {
              type: "string",
              enum: ["deposit", "withdraw", "withdraw_profit", "referral"],
              description: "Type of transaction",
            },
            amount: {
              type: "number",
              description: "Transaction amount",
            },
            status: {
              type: "string",
              enum: ["processing", "completed", "failed"],
              description: "Transaction status",
            },
            payment_method: {
              type: "string",
              description: "Payment method used",
            },
            payment_proof: {
              type: "string",
              description: "Payment proof file",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
            role: {
              type: "string",
              default: "admin",
            },
            isValidated: {
              type: "boolean",
              default: false,
            },
          },
        },
        PaymentMethod: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              description: "Payment method name",
            },
            details: {
              type: "string",
              description: "Payment details",
            },
            walletAddress: {
              type: "string",
              description: "Wallet address for crypto",
            },
            bankDetails: {
              type: "string",
              description: "Bank details for transfers",
            },
          },
        },
        Withdraw: {
          type: "object",
          required: ["amount", "wallet_address", "payment_method"],
          properties: {
            _id: {
              type: "string",
            },
            user_id: {
              type: "string",
            },
            amount: {
              type: "number",
              description: "Withdrawal amount",
            },
            wallet_address: {
              type: "string",
              description: "Wallet address for withdrawal",
            },
            payment_method: {
              type: "string",
              description: "Payment method",
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "completed", "rejected"],
              default: "pending",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            code: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "../config/swagger-routes.js")],
};

export const swaggerSpec = swaggerJsdoc(options);
