const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static(path.join(__dirname, 'src')));

// Listen for HTTP requests on the specified port
app.listen(port, () => {
  console.log('listening on %d', port);
});
