const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERADMIN,
    password: process.env.MYSQL_PASSWORDADMIN,
    database: process.env.MYSQL_DATABASE 
}).promise()

exports.updateDB = async (query) => {
    const [result] = await pool.query(`Update ${query}`)

    return result
}

exports.insertDB = async (query) => {
    const [result] = await pool.query(`INSERT INTO ${query}`)

    return result
}

exports.deleteDB = async (query) => {
    const [result] = await pool.query(`DELETE ${query}`)

    return result
}