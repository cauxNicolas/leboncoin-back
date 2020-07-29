// model Publish
const mongoose = require(`mongoose`);

const Publish = mongoose.model(`Publish`, {
  created: Date,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
  },
  description: String,
  picture: Object,
  price: Number,
  title: String,
});

module.exports = Publish;
