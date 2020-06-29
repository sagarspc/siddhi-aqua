const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerifiedOrder = mongoose.model(
  "VerifiedOrder",
  new mongoose.Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    order: { type: Schema.Types.ObjectId, ref: 'Order'},
    razorpay_order_id: String,
    razorpay_payment_id:String,
    razorpay_signature:String
  })
);

module.exports = VerifiedOrder;
