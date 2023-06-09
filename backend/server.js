const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const MongoDbConnect = require("./utils/MongoDbConnect");
require("dotenv").config();
MongoDbConnect();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

app.use("/url", require("./routes/urlRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/", require("./routes/urlRoutes"));

if (process.env.ENV === 'PROD') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    );
}
else {
    app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Express server running on PORT ${PORT}`);
});