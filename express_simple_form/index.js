const express = require('express');
const exphbrs = require('express-handlebars')
const app = express();
const port = 3000
const students = ['Jean', 'Binta', 'Agathe', 'Adil'];



app.engine('handlebars', exphbrs({
    defaultLayout: false,
    layoutsDir: __dirname + "views/"
}));

app.set('view engine', 'handlebars');


app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to express simple form',
        students: ['Jean', 'Binta', 'Agathe', 'Adil']
   
});  
});




app.use(express.urlencoded({ extended: true }));

app.use(express.json());



app.post('/students/add', (req, res) => {
    var username = req.body.username;
    students.push(username);
    return res.send(`User ${username}  has been added successfully`);
    })



app.listen(port, () => {
    console.log('Server started on port: ' + port);
});