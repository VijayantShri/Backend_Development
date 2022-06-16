const express = require("express");
const serverConfig = require("./configs/server.config");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const bodyParser = require("body-parser");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
/**
 * Setup the mongoDB connection and create an ADMIN User.
 */

mongoose.connect(dbConfig.DB_URL, () => {
    console.log("MongoDB connected.");
    // Initialization
    init()
})

async function init() {
    var adminUser = await User.findOne({userType: "ADMIN"});
    // Create the admin user.
    if (adminUser) { 
        return; 
    }
    const user = await User.create({
        name: "vijayantAdmin",
        userId: "admin",
        email: "vsintellegent010@gmail.com",
        userType: "ADMIN",
        password: bcrypt.hashSync("Admin@123", 8)
    });
    console.log("Admin user is created");
}

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);
/**
 * Start the express app server.
 */

app.listen(serverConfig.PORT, () => {
    console.log("Application has started on the PORT.", serverConfig.PORT)
}); 