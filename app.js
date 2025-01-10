// # INIT EXPRESS
const express = require("express");
const app = express();
const { APP_HOST, APP_PORT } = process.env;

// # REGISTERING MIDDLEWARES
app.use(express.json());
app.use(express.static('public'));

// # REGISTERING ROUTES
const booksRouter = require("./routers/booksRouter");
app.use("/books", booksRouter);

// # ERROR HANDLERS
const notFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");

app.use(errorsHandler);
app.use(notFound);

// # SERVER LISTENING
app.listen(APP_PORT, () => {
  console.log(`Server listening at ${APP_HOST}:${APP_PORT}`);
});