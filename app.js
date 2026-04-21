const express = require('express');
const dbConnect = require('./config/dbConnect');
const errorHandler = require('./middleware/errorHandler');

const app = express();

dbConnect();

app.use(express.json());
app.use("/", require("./routers/contactRouter"));
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});