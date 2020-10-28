const express = require('express');
const port = 3000;

const app = express();

const authorsOrder = ['Lawrence Nowell, UK','William Shakespeare, UK','Charles Dickens, US','Oscar Wilde, UK'];
// console.log(authors);

app.get('/', (req, res) => {
    res.send('Authors API' );
  });


app.get('/authors/:authorsOrder', (req, res) => {
  res.send(`authors : ${authorsOrder[req.params.authorsOrder]}`);
});
// app.get('/authors/:1', (req, res) => {
//     res.send('Lawrence Nowell, UK' );
// });
// app.get('/authors/:2/', (req, res) => {
//     res.send('William Shakespeare, UK ');
// });
// app.get('/authors/:3/', (req, res) => {
//     res.send('Charles Dickens, US');
// });
// app.get('/authors/:4/', (req, res) => {
//     res.send('Oscar Wilde, UK');
// });


app.listen(port, () => {
  console.log('Server started on port: ' + port);
});