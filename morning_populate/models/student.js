const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema({

    firstName:String,
    surname: String,
    address : {
        type : mongoose.Types.ObjectId,
        ref : "Adress"
    }
    
});

const StudentsModel = mongoose.model('Students', studentsSchema);







module.exports = StudentsModel;