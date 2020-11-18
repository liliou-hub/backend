const mongoose = require('mongoose');

const addSchema = new mongoose.Schema({
    
    streetName:String,
    streetNumber: String,
    postCode: String,
    city: String,
   
});

const AdressModel = mongoose.model('Adress', addSchema);

module.exports = AdressModel;