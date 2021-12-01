const express = require("express");
const { Client } = require("pg");

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

  app.listen(3333, async () => {
    console.log("Server started on port 3333");
    await client.query(`
    CREATE TABLE IF NOT EXISTS problem
    (
      id INTEGER PRIMARY KEY,
      code TEXT
    )`);
    await client.query(`
    CREATE TABLE IF NOT EXISTS users
    (
      id INTEGER PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`);
    await client.query(`
    CREATE TABLE IF NOT EXISTS review
    (
      id INTEGER PRIMARY KEY, 
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

  app.get("/mp", (req, res) => {
    client.query(`INSERT INTO problem(id, code) VALUES($1, $2)`, [1, "123A"]);
  });

  app.get("/mu", (req, res) => {
    client.query(
      `INSERT INTO users(id, username, password) VALUES($1, $2, $3)`,
      [1, "dread", "123"]
    );
  });

  app.get("/mr", (req, res) => {
    client.query(
      `INSERT INTO review(id, content, uid, pid) VALUES($1, $2, $3, $4)`,
      [1, "Great problem must try", 1, 1]
    );
  });

  app.get("/ur", (req, res) => {
    client.query(`SELECT * FROM review WHERE uid = $1`, [1]).then((result) => {
      res.send(result.rows);
    });
  });

  app.get("/pr", (req, res) => {
    client.query(`SELECT * FROM review WHERE pid = $1`, [1]).then((result) => {
      res.send(result.rows);
    });
  });
};

main().catch((e) => console.log(e));
