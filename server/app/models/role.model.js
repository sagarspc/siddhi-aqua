const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String,
    created: { type: Date, default: Date.now }
  })
);

module.exports = Role;
