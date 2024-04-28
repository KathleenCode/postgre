import express from "express"
import dotenv from "dotenv"
import Pool from "./config/db.js"



dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json());


(async function () {
    try {
        const connect = await Pool.connect();

        if(connect) console.log('connected to database')
    } catch(error) {
        console.log("Unable to connect to pg db");
}
})()
//Pool.query(select *)//

//creating a record into the db
app.post("/users", async(req, res) => {
try {
    const { username, email, age } = req.body;
    //const results = await pool.query(`INSERT INTO users (username, email, age) VALUES ("lalas", "lalas@gmail.com", 25)`);
    //res.json(results);
    const results = await Pool.query(`INSERT INTO users (username, email, age) VALUES ($1, $2, $3) RETURNING *`, [username, email, age]);
    res.json(results.rows[0]);
} catch(error) {
    console.log(error);
    res.status(500).json("something happened");
}
})

//get all users
app.get("/users", async(req, res) => {
    try {
        const result = await Pool.query(`SELECT * FROM users`);
        res.json(result.rows);
    } catch(error) {
        console.log(error);
        res.status(500).json("something happened");
    }
})

//delete a user
app.delete("/users/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const result = await Pool.query(`DELETE FROM users WHERE id = $1`, [id]);

        if(result) res.json({msg: "deleted successfully"})

    } catch(error) {
        console.log(error);
        res.status(500).json("internal server error");
    }
})

//update a user
app.put("/users/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const { username, email, age } = req.body;

        const result = await Pool.query(`UPDATE users SET username = $1, email = $2, AGE = $3 WHERE id = $4 RETURNING *`, [username, email, age, id]);

        if(result) {
            res.json(result.rows[0])
        }
    } catch(error) {
        console.log(error);
        res.status(500).json("internal server error");
    }
})

app.listen (PORT, () => console.log("app is running " + PORT ))