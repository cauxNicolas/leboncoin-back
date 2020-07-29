// route /offer/delete
const express = require(`express`);
const router = express.Router();
const Publish = require(`../../models/Publish`);

router.delete(`/offer/delete`, async (req, res) => {
  try {
    const suppr = await Publish.findByIdAndDelete({ _id: req.fields._id });
    res.status(200).json(`L'offre a bien été supprimée de la base de donnée`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
