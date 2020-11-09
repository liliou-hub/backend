const app = express();
const exphbrs = require('express-handlebars')

app.engine('handlebars', exphbrs({
    defaultLayout: false,
    layoutsDir: __dirname + "views/"
}));

app.set('view engine', 'handlebars');


app.get('/:lang?', (req, res) => {
    res.render('home', {
        lang: fr

    });

});











app.listen(port, () => {
    console.log('Server started on port: ' + port);
});