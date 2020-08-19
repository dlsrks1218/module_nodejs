const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const url        = require('url');
const connection = mysql.createConnection(dbconfig);

const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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

// url 파싱을 통한 다중 파라미터 전달
app.get('/check_customer/', (req, res) => {
  // var urlObject = url.parse(req.url)
  // console.log(urlObject)
  var queryData = url.parse(req.url, true).query;
  console.log(queryData)
  connection.query('select * from Customer c, Account a where a.id=\'' + queryData.id + '\'and a.pw=\'' + queryData.pw + '\'and c.c_no=a.c_no', (error, rows) => {
    if (error) throw error;
    console.log('customer - id, pw check result is: ', rows);
    res.send(rows);
  });
});

app.get('/check_salesperson/', (req, res) => {
  // var urlObject = url.parse(req.url)
  // console.log(urlObject)
  var queryData = url.parse(req.url, true).query;
  console.log(queryData)
  connection.query('select * from Salesperson s, Account a where a.id=\'' + queryData.id + '\'and a.pw=\'' + queryData.pw + '\'and s.s_no=a.s_no', (error, rows) => {
    if (error) throw error;
    console.log('salesperson - id, pw check result is: ', rows);
    res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_customer_data/', (req, res) => {
  // console.log(req.body.name)
  connection.query('insert into Customer(ticket_cnt, name, age, address, phone, id_no) values(\'' + Number(req.body.ticket_cnt) + '\',\'' + req.body.name + '\',\'' + Number(req.body.age) + '\',\'' + req.body.address + '\',\'' + req.body.phone + '\',\'' + req.body.id_no + '\')', (error, rows) => {
  // // connection.query('select * from Salesperson s, Account a where a.id=\'' + queryData.id + '\'and a.pw=\'' + queryData.pw + '\'and s.s_no=a.s_no', (error, rows) => {
    if (error) throw error;
    console.log('inserted customer - result is: ', rows);
    res.send(rows);
  });
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
