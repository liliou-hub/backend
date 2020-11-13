const express = require('express');
const exphbrs = require('express-handlebars')
const app = express();
const port = 3000
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });



const mongoose = require('mongoose')

app.engine('handlebars', exphbrs({}));
app.set('view engine', 'handlebars');



mongoose.connect('mongodb://localhost:27017/upload', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

const userSchema = new mongoose.Schema({
    username: {
        type: [String],
        index: true
        // required: true,
    },
    firstname: {
        type: String,
        // required: true,
    },
    surname: {
        type: String,
        // required: true,
    },
    profilpicture: {
        type: String,
        // required: true,
    },
});

const userModel = mongoose.model('Users', userSchema);






app.get('/', (req, res, next) => {
    res.render('home', {
        title: 'HELLO USERS',
    });
});




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.post('/upload', upload.single('img'), (req, res, next) => {

    let usernamevar = req.body.username
    let img2 = req.file

    res.render('uploadadd', {
        username: usernamevar,
        img: img2
    })

    userModel.create({
        username: usernamevar,
        profilpicture: img2.path

    }).then(data => console.log(data))
        .catch(err => console.log(err))

})

let iduser = "5faea178a861053e50047ae6"


app.get('/users/:id/',  (req, res) => {
    let result = UserModel.findById(`${iduser}`, function (err, result) {
        console.log('lelele', result.username)
        res.render('userpage',
            { username: result.username })
    })
});






















app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

