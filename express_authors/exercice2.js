const express = require('express');
const port = 3000;

const app = express();

const authorsOrder = ['', 'Lawrence Nowell, UK', 'William Shakespeare, UK', 'Charles Dickens, US', 'Oscar Wilde, UK'];
const books = ['', 'Beowulf', 'Hamlet, Othello, Romeo and Juliet, MacBeth', 'Oliver Twist, A Christmas Carol', 'The Picture of Dorian Gray, The Importance of Being Earnest'];

const all=[
    {
        id: 0,
        name: "Lawrence Nowell",
        nationality: "UK",
        books:'Beowulf'
    },

    {
        id: 1,
        name: "William Shakespeare",
        nationality: "UK",
        books:'Hamlet, Othello, Romeo and Juliet, MacBeth'
    },

    {
        id: 2,
        name: "Charles Dickens",
        nationality: "Us",
        books:  'Oliver Twist, A Christmas Carol'
    },

    {
        id: 3,
        name: "Oscar Wilde",
        nationality: "UK",
        books:'The Picture of Dorian Gray, The Importance of Being Earnest'

    },
    
]

app.get('/', (req, res) => {
    res.send('Authors API');
});

app.get('/authors/:ID', function (req, res) {
    res.send(' The author with the ID 12133 does not exist');
});


app.get('/authors/:authorsOrder', (req, res) => {
    res.send(` authors:${authorsOrder[req.params.authorsOrder]}`);
});


app.get('/authors/:books', (req, res) => {
    res.send(`books: ${books[req.params.books]}`);
});

app.get('/json/authors/:id', (req, res) => {
    res.json(all[req.params.id]);
});

app.get('/json/authors/:id/books', (req, res) => {
    res.json(all);
});

app.get('*', function (req, res) {
    res.send(' Error');
});



app.listen(port, () => {
    console.log('Server started on port: ' + port);
});