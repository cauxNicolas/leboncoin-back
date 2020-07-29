// route /user/log_in
const express = require(`express`);
const router = express.Router();
const User = require(`../../models/User`);
const SHA256 = require(`crypto-js/sha256`);
const encBase64 = require(`crypto-js/enc-base64`);

router.post(`/user/log_in`, async (req, res) => {
  try {
    // on récupère le post
    const postEmail = req.fields.email;
    const password = req.fields.password;
    const search = await User.findOne({ email: postEmail });
    if (req.fields.email) {
      // si l'utilisateur existe en bdd
      if (search) {
        const newHash = SHA256(password + search.salt).toString(encBase64);
        if (newHash === search.hash) {
          res.status(200).json({
            _id: search._id,
            token: search.token,
            account: search.account,
          });
        } else {
          res.status(400).json(`Le mot de passe est incorrect`);
        }
      } else {
        res.status(400).json(`${postEmail} inconnu en bdd`);
      }
    } else {
      res
        .status(400)
        .json(`Vous devez rentrer une adresse mail pour vous connecter`);
    }
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

module.exports = router;
