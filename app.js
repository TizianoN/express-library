// # INIT EXPRESS
const express = require("express");
const app = express();

// # SERVER LISTENING
app.listen(3000, () => {
  console.log('Server listening at http://localhost:3000');
})