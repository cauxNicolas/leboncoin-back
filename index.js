// Exercice LeBonCoin
require(`dotenv`).config();

const express = require(`express`);
const expressFormidable = require(`express-formidable`);
const mongoose = require(`mongoose`);
const cors = require("cors");

const app = express();
app.use(cors());
app.use(expressFormidable());

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// routes
const userSignup = require(`./routes/user/sign_up`);
app.use(userSignup);
const userLogin = require(`./routes/user/log_in`);
app.use(userLogin);
const offerPublish = require(`./routes/offer/publish`);
app.use(offerPublish);
const offerWithCount = require(`./routes/offer/withCount`);
app.use(offerWithCount);
const offer = require(`./routes/offer/offer`);
app.use(offer);
const offerUpdate = require(`./routes/offer/update`);
app.use(offerUpdate);
const offerDelete = require(`./routes/offer/delete`);
app.use(offerDelete);
// /pay
const offerPay = require(`./routes/offer/pay`);
app.use(offerPay);
// catch error
app.all(`*`, (req, res) => {
  try {
    res.status(200).json(`app.all -> route inconnue !`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3200, () => {
  console.log(`Server Started dossier 14 -> "leboncoin"`);
});
