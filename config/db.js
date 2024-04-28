import pg from "pg";

const {Pool} = pg;

const pool = new Pool ({
    host: "localhost",
    user: "postgres",
    password: "Getty@1234",
    max: 20,
    database: "crud-postgres",
    port: 5432
})

export default pool;