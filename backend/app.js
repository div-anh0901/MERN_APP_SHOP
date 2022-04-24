const express = require('express');
const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middleware/error')
const app = express();


app.use(express.json());
app.use(cookieParser());

//Router 
const product = require('./routers/productRouter');
const user = require('./routers/userRouter');
const order = require('./routers/orderRouter');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

//Middleware
app.use(errorMiddleware);

module.exports = app;