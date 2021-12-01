const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

const main = async () => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "cfrDB",
    password: "11037",
    port: 5432,
  });
  await client.connect();

  const app = express();
  app.use(cors({ origin: "http://localhost:3000" }));
  app.use(express.json());

  app.listen(3333, async () => {
    console.log("Server started on port 3333");
    await client.query(`
    CREATE TABLE IF NOT EXISTS problem
    (
      id SERIAL PRIMARY KEY,
      code TEXT
    )`);
    await client.query(`
    CREATE TABLE IF NOT EXISTS users
    (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`);
    await client.query(`
    CREATE TABLE IF NOT EXISTS review
    (
      id SERIAL PRIMARY KEY, 
      content TEXT,
      uid INTEGER,
      pid INTEGER,
      FOREIGN KEY (uid) REFERENCES users(id),
      FOREIGN KEY (pid) REFERENCES problem(id)
    )`);
  });

  app.get("/", async (req, res) => {
    const ret = { problem: [], users: [], review: [] };
    await client.query(`SELECT * FROM problem`).then((result) => {
      ret.problem = result.rows;
    });
    await client.query(`SELECT * FROM users`).then((result) => {
      ret.users = result.rows;
    });
    await client.query(`SELECT * FROM review`).then((result) => {
      ret.review = result.rows;
    });
    res.send(ret);
  });

  app.post("/mp", (req, res) => {
    client.query(`INSERT INTO problem(code) VALUES($1)`, [req.body.code]);
  });

  app.post("/register", (req, res) => {
    client
      .query(`INSERT INTO users(username, password) VALUES($1, $2)`, [
        req.body.username,
        req.body.password,
      ])
      .then(() => {
        res.send({ username: req.body.username });
      });
  });
  app.post("/login", (req, res) => {
    client
      .query(`SELECT * FROM users WHERE username = $1 AND password = $2`, [
        req.body.username,
        req.body.password,
      ])
      .then((result) => {
        if (result.rowCount === 0) {
          res.send({ error: "Invalid username or password" });
        } else {
          res.send({ username: req.body.username });
        }
      });
  })

  app.post("/mr", (req, res) => {
    client.query(`INSERT INTO review(content, uid, pid) VALUES($1, $2, $3)`, [
      req.body.content,
      req.body.uid,
      req.body.pid,
    ]);
  });

  app.get("/ur", (req, res) => {
    client
      .query(`SELECT * FROM review WHERE uid = $1`, [req.body.uid])
      .then((result) => {
        res.send(result.rows);
      });
  });

  app.get("/pr", (req, res) => {
    client
      .query(`SELECT * FROM review WHERE pid = $1`, [req.body.pid])
      .then((result) => {
        res.send(result.rows);
      });
  });
};

main().catch((e) => console.log(e));
