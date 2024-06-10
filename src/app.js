const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', gameRoutes);

mongoose.connect('mongodb+srv://root:Chocolates12.@cluster0.py9r6pf.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

module.exports = app;
