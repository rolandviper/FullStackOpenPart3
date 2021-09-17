const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.fm4mc.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url).then(() => console.log("Connected to database"));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 5) {
  person.save().then(() => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("Phonebook numbers:");
    res.map((person) => {
      console.log(`${person.name} - ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log(
    "Ensure the correct number of arguments, e.g node pass <NAME> <NUM>, if name has whitespacing wrap it in quotes"
  );
  mongoose.connection.close();
}
