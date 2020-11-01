const express = require('express');
const exphbrs = require('express-handlebars')
const app = express();
const port = 3000



app.set('view engine', 'handlebars');

app.engine('handlebars', exphbrs({
    layoutsDir: __dirname + "views/"
}));

app.use(express.static('public'));

app.get('/home', function (req, res) {
    res.render('home', {
        title: 'heyyy'
    }
    );
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});




app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.post('/form/signup', (req, res) => {
    console.log('form parameter', req.body.username);
});