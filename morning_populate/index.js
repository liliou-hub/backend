async function add() {

    const AdressModel = require('./models/adress');
    const StudentsModel = require('./models/student');
    const mongoose = require('mongoose')

    mongoose.connect('mongodb://localhost:27017/mongoose_populate', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(err => console.log(err))

    const Add1 = new AdressModel({
        streetName: 'Mozart',
        streetNumber: '9',
        postCode: '75000',
        city: 'Paris',

    })

    const resultAdd1 = await Add1.save()

    let adressID = AdressModel.findById(Add1._id, function (err, result) {
        console.log('je suis le result', result._id)
    })

    const student1 = new StudentsModel({
        firstName: 'Lili',
        surname: 'Liliou',
        address: Add1._id

    })

    const resultstudent1 = await student1.save()
    student1.save((err) => {

    });

    StudentsModel
        .findOne({ _id: student1._id })
        .populate('address')
        .exec((err, student1) => {
            console.log('The infos are', student1)
            
        });


}


add()