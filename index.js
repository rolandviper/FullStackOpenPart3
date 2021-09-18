require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/persons");

app.use(cors());
app.use(express.static("build"));

//Morgan
morgan.token("person", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});

app.use(express.json()); //json-parser
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} persons</p>
    <p>As of ${new Date().toDateString()}</p>
    `);
  });
});

//Get information from phonebook
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
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

  person
    .save()
    .then((newPersons) => {
      res.json(newPersons);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatePerson) => {
      res.json(updatePerson);
    })
    .catch((err) => next(err));
});

//handle unknown request
const unknownRoute = (req, res) => {
  res.status(404).send({ error: "unknown route endpoint" });
};
app.use(unknownRoute);

//Error Handling
const errHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
