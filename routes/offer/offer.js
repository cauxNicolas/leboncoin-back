// route //offer:/id
const express = require(`express`);
const Publish = require(`../../models/Publish`);
const router = express.Router();

router.get(`/offer/:id`, async (req, res) => {
  try {
    if (req.params.id) {
      const searchId = await Publish.findById({ _id: req.params.id })
        .select(`_id title description price picture.secure_url created`)
        .populate({
          path: `creator`,
          select: `-__v -hash -token -salt -email -_id`,
        });
      res.status(200).json(searchId);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
