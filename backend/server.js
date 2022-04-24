const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

//Handling Unhandled Exception
process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due Unhandled Promise Exception");
    process.exit(1);

});

//config
dotenv.config({ path: "backend/config/config.env" });

//Conntect to database
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running http://localhost:${process.env.PORT}`);
});



// Unhandled Promise Rejection

process.on("unhandledRejection", err => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    })
});