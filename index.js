const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");

//Mongo DB setup
mongoose.connect("mongodb://localhost:auth/auth");

//App Setup
app.use(morgan("combined"));
//Default security
app.use(helmet());

app.use(bodyParser.json({ type: "*/*" }));
router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);

//comment
server.listen(port);
console.log("Server listening on port: ", port);
