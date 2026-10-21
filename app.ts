import express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
}).on('error', (err) => {
    console.log('Something bad happened', err);
});

export = app;
