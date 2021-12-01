const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const main = async () => {
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lasertag',
  database : 'cfrDB'
});
  await connection.connect();

  const app = express();
  app.use(cors({ origin: "http://localhost:3000" }));
  app.use(express.json());

  app.listen(3333, async () => {
    console.log("Server started on port 3333");
    await connection.query(`
    CREATE TABLE IF NOT EXISTS problem
    (
      id SERIAL PRIMARY KEY,
      code TEXT
    )`);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users
    (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS review
    (
      id SERIAL PRIMARY KEY, 
      content TEXT,
      uid BIGINT UNSIGNED,
      pid BIGINT UNSIGNED,
      FOREIGN KEY (uid) REFERENCES users(id),
      FOREIGN KEY (pid) REFERENCES problem(id)
    )`);
  });

  app.get("/", async (req, res) => {
    const ret = { problem: [], users: [], review: [] };
    await connection.query(`SELECT * FROM problem`).then((result) => {
      ret.problem = result.rows;
    });
    await connection.query(`SELECT * FROM users`).then((result) => {
      ret.users = result.rows;
    });
    await connection.query(`SELECT * FROM review`).then((result) => {
      ret.review = result.rows;
    });
    res.send(ret);
  });

  app.post("/register", (req, res) => {
    connection
      .query(`INSERT INTO users(username, password) VALUES(?, ?)`, [
        req.body.username,
        req.body.password,
      ], (error, result) => {
        res.send("success");
      });
  });
  app.post("/login", (req, res) => {
    connection
      .query(`SELECT * FROM users WHERE username = ? AND password = ?`, [
        req.body.username,
        req.body.password,
      ],(error,result) => {
        if (result.length === 0) {
          res.send({ error: "Invalid username or password" });
        } else {
          res.send({ username: req.body.username, id: result[0].id });
        }
      });
  });

  app.get("/problems", (req, res) => {
    connection.query(`SELECT * FROM problem`,(errors,result) => {
      res.send(result);
    });
  });

  app.post("/problemReviews", async (req, res) => {
    connection
      .query(`SELECT * FROM problem WHERE code = ?`, [req.body.code],
      (errors,result) => {
        var pid;
        if (result.length === 0) {
          connection.query(`INSERT INTO problem(code) VALUES(?)`, [req.body.code]);
          connection
            .query(`SELECT * FROM problem WHERE code = ?`, [req.body.code],
            (errors,result) => (pid = result[0].id));
        } else {
          pid = result[0].id;
        }
        connection
      .query(
        `SELECT a.*, b.username FROM review AS a INNER JOIN users AS b ON a.uid = b.id WHERE pid = ?`,
        [pid]
      ,
      (errors,result) => {
        const reviews = [];
        for (var id = 0; id < result.length; id++) {
          const row = result[id];
          reviews.push({
            id: row.id,
            content: row.content,
            user: row.username,
          });
        }
        res.send({id: pid, reviews: reviews});
      });
      });

  });

  app.post("/newReview", async (req, res) => {
    await connection
      .query(`SELECT * FROM review WHERE uid = ? AND pid = ?`, [
        req.body.uid,
        req.body.pid,
      ],(errors,result) => {
        if (result.length) {
          res.send({ error: "You have already reviewed this problem" });
        }
      });
    connection
      .query(`INSERT INTO review(content, uid, pid) VALUES(?,?,?)`, [
        req.body.content,
        req.body.uid,
        req.body.pid,
      ],() => {
        console.log(req.body.uid);
        console.log(req.body.pid);
        connection
          .query(`SELECT review.id FROM review WHERE uid = ? AND pid = ?`, [
            req.body.uid,
            req.body.pid,
          ],(errors,result) => {
            console.log(result)
            res.send({ id: result[0].id });
          });
      });
  });
  app.post("/deleteReview", (req, res) => {
    connection.query(`DELETE FROM review WHERE id = ?`, [req.body.id],() => {
      res.send("success");
    });
  });
};

main().catch((e) => console.log(e));
