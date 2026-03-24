import mongoose from "mongoose";

const revokedTokenSchema = new mongoose.Schema({
  token: String,
  revokedAt: { 
    type: Date, 
    default: Date.now
 }
});

const RevokedToken = mongoose.model('revoked-token', revokedTokenSchema);

export default RevokedToken;
