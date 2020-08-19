const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const url        = require('url');
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

app.get('/account', (req, res) => {
  connection.query('SELECT * from Account', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 포함 GET method
app.get('/account/id/:id', (req, res) => {
  connection.query('SELECT * from Account WHERE id=\'' + req.params.id + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 포함 GET method
app.get('/account/pw/:pw', (req, res) => {
  connection.query('SELECT * from Account WHERE pw=\'' + req.params.pw + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 포함 GET method
app.get('/check_customer_or_salesperson/:idpw', (req, res) => {
  var urlObject = url.parse(req.url)
  console.log(urlObject)
  // connection.query('select * from Salesperson s, Account a where a.id=\'' + req.params.id + '\'and a.pw=\'' + req.params.pw + '\'and s.s_no=a.s_no', (error, rows) => {
  // // connection.query('SELECT * from Account WHERE id=\'' + req.params.pw + '\'', (error, rows) => {
  //   if (error) throw error;
  //   console.log('id, pw check result is: ', rows);
  //   res.send(rows);
  // });
});


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
