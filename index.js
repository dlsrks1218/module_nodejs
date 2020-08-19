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

///////////////////////////////////////////////////////
// user_init

// 파라미터 포함 GET method
app.get('/account/id/:id', (req, res) => {
  connection.query('SELECT * from Account WHERE id=\'' + req.params.id + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/account/pw/:pw', (req, res) => {
  connection.query('SELECT * from Account WHERE pw=\'' + req.params.pw + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/customer/cno/:cno', (req, res) => {
  connection.query('select c_no from Customer where name=\'' + req.params.cno + '\'', (error, rows) => {
    if (error) throw error;
    console.log('customer - cno result is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/salesperson/sno/:sno', (req, res) => {
  connection.query('select s_no from Salesperson where name=\'' + req.params.name + '\'', (error, rows) => {
    if (error) throw error;
    console.log('customer - cno result is: ', rows);
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
    if (error) throw error;
    console.log('inserted customer - result is: ', rows);
    res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_customer_account/', (req, res) => {
  connection.query('insert into Account(id, pw, c_no) values(\'' + req.body.id + '\',\'' + req.body.pw + '\',\'' + Number(req.body.c_no) + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted account - result is: ', rows);
    res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_salesperson_data/', (req, res) => {
  connection.query('insert into Salesperson(name) values(\'' + req.body.name + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted salesperson - result is: ', rows);
    res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_salesperson_account/', (req, res) => {
  connection.query('insert into Account(id, pw, s_no) values(\'' + req.body.id + '\',\'' + req.body.pw + '\',\'' + Number(req.body.s_no) + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted account - result is: ', rows);
    res.send(rows);
  });
});


///////////////////////////////////////////////////////
// customer_module
app.get('/available_car_list', (req, res) => {
  connection.query('SELECT car_no, brand, year, model, color FROM Car WHERE c_no IS NULL', (error, rows) => {
    if (error) throw error;
    console.log('available car info is: ', rows);
    res.send(rows);
  });
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
