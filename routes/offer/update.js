// route /offer/update
const express = require(`express`);
const Publish = require(`../../models/Publish`);
const router = express.Router();

router.put(`/offer/update`, async (req, res) => {
  try {
    const _id = req.fields._id;
    const price = req.fields.price;

    const search = await Publish.findById({ _id: _id }).select(
      `title price description`
    );
    if (search) {
      search.price = Number(price);
      await search.save();
      res.status(200).json(`mise a jour effectuée`);
    } else if (!search) {
      res.status(400).json(`_id inconnu`);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
