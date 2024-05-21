const express = require('express');
const bodyParser = require('body-parser');
const guestsRouter = require('./routes/guests');
const cors = require('cors');

const app = express();
const port = 8001;

app.use(
    cors({
      origin: ["http://localhost:5174", "http://localhost:5173"],
    })
  );
app.use(bodyParser.json());
app.use('/api/guests', guestsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
