import express = require('express');
import { notFound } from './src/middlewares/notFound';
import { errorHandler } from './src/middlewares/errorHandler';
import { router } from './src/routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
}).on('error', (err) => {
    console.log('Something bad happened', err);
});

export = app;
