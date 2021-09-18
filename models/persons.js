const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
});
personSchema.plugin(uniqueValidator);

//Returns and convert the _id from MongoDB and change it to id, removes _id and _v from it.
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
