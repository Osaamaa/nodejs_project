require('dotenv').config();
const httpStatusText = require('./utills/httpStatusText');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const url = process.env.Mongo_URL;
const connect = mongoose.connect(url).then(() => {
    console.log("connected succefuly");
});
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))
const coursesRouter = require('./routes/coureses.routes')
const usersRouter = require('./routes/users.routes')
app.listen(process.env.PORT, () => {
    console.log("les on 3000");
})

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);
app.all('*', (req, res, next) => {
    res.status(404).json({ status: 404, message: "Not Found" })
})
///global error handler
app.use((error, req, res, next) => {
    console.log(error.statusText);
    res.status(error.status || 400).json({ status: error.statusText || httpStatusText.Error, message: error.message || error.message });
})
