const {
  redisHost,
  redisPort,
  pgUser,
  pgHost,
  pgDB,
  pgPwd,
  pgPort,
} = require("./keys");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Pool } = require("pg");
const pgClient = new Pool({
  user: pgUser,
  database: pgDB,
  host: pgHost,
  password: pgPwd,
  port: pgPort,
});
pgClient.on("error", () => console.log("Lost PG connection"));

// Create table if doesn;t exist and catch error
pgClient
  .query("CREATE TABLE IF NOT EXISTS values }number INT}")
  .catch((err) => console.log(err));

const redis = require("redis");
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});

//routes
app.get("/", (req, res) => {
  res.send("HelloFromComplex");
});
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});
app.post("values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }
  redisClient.hset("values", index, "Nothing yet");
  redisPublusher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
