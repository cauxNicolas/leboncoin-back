// route /offer/publish
const express = require(`express`);
const cloudinary = require(`cloudinary`).v2;
const router = express.Router();
const isAuthenticated = require(`../../functions/isAuthenticated`);
const Publish = require(`../../models/Publish`);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post(`/offer/publish`, isAuthenticated, (req, res) => {
  const fileKeys = Object.keys(req.files);
  let results = {};

  if (req.fields.description.length >= 500) {
    res
      .status(400)
      .json(`La description est trop grande moins de 500 caractères`);
    return;
  } else if (req.fields.title.length >= 50) {
    res.status(400).json(`Le titre est trop grand moins de 50 caractères`);
    return;
  } else if (req.fields.price >= 100000) {
    res.status(400).json(`Le prix est trop élevé moins de 100000`);
    return;
  }

  if (fileKeys.length === 0) {
    res.status(400).json(`Pas de fichier séléctionné`);
    return;
  }
  fileKeys.forEach(async (fileKey) => {
    try {
      const file = req.files[fileKey];
      const result = await cloudinary.uploader.upload(file.path);
      results[fileKey] = {
        success: true,
        result: result,
      };

      if (Object.keys(results).length === fileKeys.length) {
        const newPublish = new Publish({
          created: new Date(),
          creator: req.user,
          description: req.fields.description,
          picture: result,
          price: req.fields.price,
          title: req.fields.title,
        });
        await newPublish.save();
        const affiche = await Publish.findById({
          _id: newPublish._id,
        })
          .select(`_id description price title picture.secure_url`)
          .populate({
            path: `creator`,
            select: `-token -salt -__v -hash -email`,
          });
        res.status(200).json(affiche);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
});

module.exports = router;
