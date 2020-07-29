const express = require(`express`);
const router = express.Router();
const isAuthenticated = require(`../../functions/isAuthenticated`);

const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);

router.post("/pay", isAuthenticated, async (req, res) => {
  try {
    const stripeToken = req.fields.stripeToken;
    const description = req.fields.description;
    const amount = req.fields.amount + "00";

    const response = await stripe.charges.create({
      amount: amount,
      currency: "eur",
      description: description,
      source: stripeToken,
    });
    console.log(response);
    res.status(200).json(`Votre paiement a bien été effectué`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
