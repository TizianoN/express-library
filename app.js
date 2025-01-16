// # INIT EXPRESS
const express = require("express");
const app = express();
const cors = require('cors')
const { APP_HOST, APP_PORT, APP_FRONTEND_URL } = process.env;

// # CORS CONFIG
var corsOptions = {
  origin: APP_FRONTEND_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// # REGISTERING MIDDLEWARES
app.use(express.json());
app.use(express.static('public'));
app.use(cors(corsOptions));

// # REGISTERING ROUTES
const booksRouter = require("./routers/booksRouter");
app.use("/api/books", booksRouter);

// # ERROR HANDLERS
const notFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");

app.use(errorsHandler);
app.use(notFound);

// # SERVER LISTENING
app.listen(APP_PORT, () => {
  console.log(`Server listening at ${APP_HOST}:${APP_PORT}`);
});