// route /user/sign_up
const express = require(`express`);
const router = express.Router();
const User = require(`../../models/User`);
const uid2 = require(`uid2`);
const salt = uid2(16);
const token = uid2(16);
const SHA256 = require(`crypto-js/sha256`);
const encBase64 = require(`crypto-js/enc-base64`);

router.post(`/user/sign_up`, async (req, res) => {
  try {
    const postEmail = req.fields.email;
    const postUsername = req.fields.username;
    const postPhone = req.fields.phone;
    const password = req.fields.password;
    // crypter le password
    const hashGenerate = SHA256(password + salt).toString(encBase64);
    // verif de l'email
    const searchEmail = await User.findOne({ email: postEmail });
    if (searchEmail) {
      res
        .status(400)
        .json(`${postEmail} existe déjà dans notre base de donnée`);
      // on verifie que le nom existe
    } else if (!req.fields.username) {
      res.status(400).json(`Merci de renseigner le nom`);
    } else {
      const newUser = new User({
        email: postEmail,
        token: token,
        salt: salt,
        hash: hashGenerate,
        account: {
          username: postUsername,
          phone: postPhone,
        },
      });
      await newUser.save();
      await res.status(200).json({
        _id: newUser._id,
        token: newUser.token,
        account: {
          username: newUser.account.username,
          phone: newUser.account.phone,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
