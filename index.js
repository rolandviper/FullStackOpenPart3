require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/persons");

//Morgan
morgan.token("person", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});

//Middleware
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.use(express.json());

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people.</p><p>${new Date()}</p>`
  );
});

//Get information from phonebook
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  person = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const id = persons.length > 0 ? Math.floor(Math.random() * 1000) : 0;
  return id;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or Number missing!",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((newPersons) => {
    res.json(newPersons);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
