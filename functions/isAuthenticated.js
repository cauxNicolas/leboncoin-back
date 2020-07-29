// function isAuthenticated
const User = require(`../models/User`);

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace(`Bearer `, ``),
    });

    if (!user) {
      return res.status(401).json({ error: `non autorisé` });
    } else {
      // créer une clé "user" dans req. La route pourra avoir accès à req.user
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: `non autorisé` });
  }
};

module.exports = isAuthenticated;
