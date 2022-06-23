/**
 * This will have the logic to start the server.
 */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");

const app = express();

// Register a body-parser middleware to express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the mongodb.
mongoose.connect(dbConfig.DB_URL , () => {
    console.log("MongoDb Connected.")
}, err => {
    console.log("Error while connecting to mongodb: ", err);
});

// Stitching the routes
require("./routes/ticketNotification.route")(app);

// Starting the express server.
app.listen(serverConfig.PORT, () => {
    console.log(`Aplication started on PORT: ${serverConfig.PORT}`);
})
