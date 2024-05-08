const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cron = require('./scheduler');
const outletRoutes = require('./routes/outletsRoutes');
const readingRoutes = require('./routes/readingsRoutes');
const app = express();
app.use(cors())
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/outlets', outletRoutes);
app.use('/api', readingRoutes)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
