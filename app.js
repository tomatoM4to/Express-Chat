const express = require('express');
const methodOverride = require('method-override');
const dbConnect = require('./config/dbConnect');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(methodOverride("_method"));

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routers/loginRouter"));
app.use("/contacts", require("./routers/contactRouter"));
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});