const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const app = express();
app.set('port', process.env.PORT || 8000);

app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || 
                req.connection.remoteAddress || 
                req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(ip);
    res.send('Hello, Wecome to 1조! : ' + ip + "," + new Date());
});

app.get('/health', (req, res) => {
    res.status(200).send();
});

app.get('/users', (req, res) => {
  connection.query('SELECT * from Account', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

// test용
app.get('/users/:id', (req, res) => {
  connection.query('SELECT * from Account WHERE id=\'' + req.params.id + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});
// test용
app.get('/users/:pw', (req, res) => {
  connection.query('SELECT * from Account WHERE id=\'' + req.params.id + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

app.get('/check_id_from_account', (req, res) => {
  connection.query('SELECT * from Account WHERE id=\'' + req.query.id+ '\'', (error, rows) => {
    if (error) throw error;
    console.log(req.query.id + '에 해당하는 account 정보 : ', rows);
    res.send(rows);
  });
});

app.get('/check_pw_from_account', (req, res) => {
  connection.query('SELECT * from Account WHERE pw=\'' + req.query.pw + '\'', (error, rows) => {
    if (error) throw error;
    console.log(req.query.pw + '에 해당하는 account 정보 : ', rows);
    res.send(rows);
  });
});




app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
