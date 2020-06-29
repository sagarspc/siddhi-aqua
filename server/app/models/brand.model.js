//Category.JS to create Category Schema in the application 

const mongoose = require('mongoose');          //Placing mongoose package in a variable mongoose
const Schema = mongoose.Schema;                // Assigning mongoose schema to variable 



//creating BrandSchema
const BrandSchema = new Schema({
  name: { type: String, unique: true, lowercase: true },
  created: { type: Date, default: Date.now }
});


//Exporting the Brand schema to reuse  
module.exports = mongoose.model('Brand', BrandSchema);
