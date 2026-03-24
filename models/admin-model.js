import mongoose, { model, Schema } from "mongoose";

const adminSchema = new Schema({
    user_name : {
        type: String,
        require: [true,  "username is required"]
    },
    email: {
        type:  String,
        unique: true
    },
    password: { 
        type: String
    },
},{
    timestamps: true,
    versionKey: false
});

const Admin = model("admin", adminSchema);

export default Admin;
