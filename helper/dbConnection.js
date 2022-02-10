const mysql = require('mysql2');

const options = {
	host: process.env.DB_URL,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
}

const connection = mysql.createConnection(options);

connection.connect(function (err) {
	if (err) throw err;
	console.log('Connected to DB');
});

module.exports = connection;
