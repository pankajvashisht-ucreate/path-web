const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');

const app = express();
const cors = require('cors');
app.use(express.static(path.join(__dirname, '../build')));
const port = process.env.PORT || 5001;
app.use(cors());

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

app.listen(port);