const mysql = require('mysql2');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'mysql_docs'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to DB')
});

module.exports = connection;