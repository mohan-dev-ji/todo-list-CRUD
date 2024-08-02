import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todolist",
    // add your password here
    password: "123456", 
    port: 5432,
  });
  db.connect();

let items = []  

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM items ORDER BY id ASC");
        items = result.rows;
        console.log(items);

        res.render("index.ejs", {
            listTitle: "Todo List",
            listItems: items,
        });
    } catch (err) {
        console.log(err);
    }
  });

app.post("/add", async (req, res) => {
    const addItem = req.body.newItem;
    console.log(addItem)
    try {
        await db.query(
          "INSERT INTO items (title) VALUES ($1)",
          [addItem]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    console.log(req.body.updatedItemTitle);
    const editTitle = req.body.updatedItemTitle;
    const editId = req.body.updatedItemId;
    try {
      await db.query(
        "UPDATE items SET title = ($1) WHERE id = ($2)",
        [editTitle, editId]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    const deleteId = req.body.deleteItemId;
    console.log(deleteId);
    try {
        await db.query(
            "DELETE from items WHERE id = ($1)",
            [deleteId]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });