// route /offer/with-count
const express = require(`express`);
const router = express.Router();
const Publish = require(`../../models/Publish`);

router.get(`/offer/with-count`, async (req, res) => {
  try {
    const count = await Publish.countDocuments();
    const filters = {};
    // chercher le titre d'un produit
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, `i`);
    }
    // chercher un produit avec un prix maximum de 500 €
    if (req.query.priceMax) {
      filters.price = { $lte: req.query.priceMax };
    }
    // chercher un produit entre un prix min et prix max
    if (req.query.priceMin && req.query.priceMax) {
      filters.price = { $gte: req.query.priceMin, $lte: req.query.priceMax };
    }
    // trier du prix plus grand au plus petit et inversement
    let sort = {};
    if (req.query.sort === `price-desc`) {
      sort = { price: -1 };
    } else if (req.query.sort === `price-asc`) {
      sort = { price: 1 };
    } else if (req.query.sort === `date-desc`) {
      sort = { created: -1 };
    } else if (req.query.sort === `date-asc`) {
      sort = { created: 1 };
    }
    // le nombre de page
    const limit = 3;
    let page;
    let skip;
    if (req.query.page) {
      page = Number(req.query.page);
      skip = page * limit - 1 * limit;
    }
    const result = await Publish.find(filters)
      .select(`title description picture.secure_url price creator created`)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    res.status(200).json({ count: count, offers: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
