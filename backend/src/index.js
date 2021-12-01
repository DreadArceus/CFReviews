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

  app.post("/register", (req, res) => {
    client
      .query(`INSERT INTO users(username, password) VALUES($1, $2)`, [
        req.body.username,
        req.body.password,
      ])
      .then(() => {
        res.send("success");
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
          res.send({ username: req.body.username, id: result.rows[0].id });
        }
      });
  });

  app.get("/problems", (req, res) => {
    client.query(`SELECT * FROM problem`).then((result) => {
      res.send(result.rows);
    });
  });

  app.post("/problemReviews", async (req, res) => {
    var pid;
    await client
      .query(`SELECT * FROM problem WHERE code = $1`, [req.body.code])
      .then((result) => {
        if (result.rowCount === 0) {
          client.query(`INSERT INTO problem(code) VALUES($1)`, [req.body.code]);
          client
            .query(`SELECT * FROM problem WHERE code = $1`, [req.body.code])
            .then((result) => (pid = result.rows[0].id));
        } else {
          pid = result.rows[0].id;
        }
      });
    client
      .query(
        `SELECT a.*, b.username FROM review AS a INNER JOIN users AS b ON a.uid = b.id WHERE pid = $1`,
        [pid]
      )
      .then((result) => {
        const reviews = [];
        for (var id = 0; id < result.rows.length; id++) {
          const row = result.rows[id];
          reviews.push({
            id: row.id,
            content: row.content,
            user: row.username,
          });
        }
        res.send({ id: pid, reviews: reviews });
      });
  });

  app.post("/newReview", async (req, res) => {
    await client
      .query(`SELECT * FROM review WHERE uid = $1 AND pid = $2`, [
        req.body.uid,
        req.body.pid,
      ])
      .then((result) => {
        if (result.rowCount) {
          res.send({ error: "You have already reviewed this problem" });
        }
      });
    client
      .query(`INSERT INTO review(content, uid, pid) VALUES($1, $2, $3)`, [
        req.body.content,
        req.body.uid,
        req.body.pid,
      ])
      .then(() => {
        client
          .query(`SELECT review.id FROM review WHERE uid = $1 AND pid = $2`, [
            req.body.uid,
            req.body.pid,
          ])
          .then((result) => {
            res.send({ id: result.rows[0].id });
          });
      });
  });
  app.post("/deleteReview", (req, res) => {
    client.query(`DELETE FROM review WHERE id = $1`, [req.body.id]).then(() => {
      res.send("success");
    });
  });
};

main().catch((e) => console.log(e));
