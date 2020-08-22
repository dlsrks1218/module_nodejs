const express    = require('express');
const mysql      = require('mysql');
const url        = require('url');

const dbconfig_master   = require('./config/database_master.js');
const connection_master = mysql.createConnection(dbconfig_master);

const dbconfig_slave   = require('./config/database_slave.js');
const connection_slave = mysql.createConnection(dbconfig_slave);

const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.set('port', process.env.PORT || 8000);

app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || 
                req.connection_master.remoteAddress || 
                req.socket.remoteAddress ||
            (req.connection_master.socket ? req.connection_master.socket.remoteAddress : null);
    console.log(ip);
    res.send('Hello, Wecome to 1조! : ' + ip + "," + new Date());
});


app.get('/health', (req, res) => {
    res.status(200).send();
});

app.get('/account', (req, res) => {
  connection_slave.query('SELECT * from Account', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

///////////////////////////////////////////////////////
// user_init

// 파라미터 포함 GET method
app.get('/account/id/:id', (req, res) => {
  connection_slave.query('SELECT * from Account WHERE id=\'' + req.params.id + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/account/pw/:pw', (req, res) => {
  connection_slave.query('SELECT * from Account WHERE pw=\'' + req.params.pw + '\'', (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/customer/cno/:name', (req, res) => {
  connection_slave.query('select c_no from Customer where name=\'' + req.params.name + '\'', (error, rows) => {
    if (error) throw error;
    console.log('customer - cno result is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/salesperson/sno/:name', (req, res) => {
  connection_slave.query('select s_no from Salesperson where name=\'' + req.params.name + '\'', (error, rows) => {
    if (error) throw error;
    console.log('Salesperson - sno result is: ', rows);
    res.send(rows);
  });
});

// url 파싱을 통한 다중 파라미터 전달
app.get('/check_customer/', (req, res) => {
  // var urlObject = url.parse(req.url)
  // console.log(urlObject)
  var queryData = url.parse(req.url, true).query;
  console.log(queryData)
  connection_slave.query('select * from Customer c, Account a where a.id=\'' + queryData.id + '\'and a.pw=\'' + queryData.pw + '\'and c.c_no=a.c_no', (error, rows) => {
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
  connection_slave.query('select * from Salesperson s, Account a where a.id=\'' + queryData.id + '\'and a.pw=\'' + queryData.pw + '\'and s.s_no=a.s_no', (error, rows) => {
    if (error) throw error;
    console.log('salesperson - id, pw check result is: ', rows);
    res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_customer_data/', (req, res) => {
  // console.log(req.body.name)
  connection_master.query('insert into Customer(ticket_cnt, name, age, address, phone, id_no) values(\'' + Number(req.body.ticket_cnt) + '\',\'' + req.body.name + '\',\'' + Number(req.body.age) + '\',\'' + req.body.address + '\',\'' + req.body.phone + '\',\'' + req.body.id_no + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted customer - result is: ', rows);
    // res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_customer_account/', (req, res) => {
  connection_master.query('insert into Account(id, pw, c_no) values(\'' + req.body.id + '\',\'' + req.body.pw + '\',\'' + Number(req.body.c_no) + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted account - result is: ', rows);
    // res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_salesperson_data/', (req, res) => {
  connection_master.query('insert into Salesperson(name) values(\'' + req.body.name + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted salesperson - result is: ', rows);
    // res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_salesperson_account/', (req, res) => {
  connection_master.query('insert into Account(id, pw, s_no) values(\'' + req.body.id + '\',\'' + req.body.pw + '\',\'' + Number(req.body.s_no) + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted account - result is: ', rows);
    // res.send(rows);
  });
});


///////////////////////////////////////////////////////
// customer_module
app.get('/available_car_list', (req, res) => {
  connection_slave.query('SELECT car_no, brand, year, model, color FROM Car WHERE c_no IS NULL', (error, rows) => {
    if (error) throw error;
    console.log('available car info is: ', rows);
    res.send(rows);
  });
});

app.get('/total_car_list', (req, res) => {
  connection_slave.query('SELECT car_no, brand, year, model, color FROM Car', (error, rows) => {
    if (error) throw error;
    console.log('total car info is: ', rows);
    res.send(rows);
  });
});

app.get('/total_customer_list', (req, res) => {
  connection_slave.query('select c_no, name, age, address, phone from Customer', (error, rows) => {
    if (error) throw error;
    console.log('total customer info is: ', rows);
    res.send(rows);
  });
});

// update문을 수행할 POST 메소드
app.post('/update_car_data/', (req, res) => {
  connection_master.query('update Car set c_no = ' + Number(req.body.c_no) + ' where car_no = ' + Number(req.body.car_num), (error, rows) => {
    if (error) throw error;
    console.log('updated car data - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/update_customer_name_data/', (req, res) => {
  connection_master.query('update Customer set name = \'' + req.body.name + '\' where c_no = \'' + Number(req.body.c_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('updated customer name data - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/update_customer_age_data/', (req, res) => {
  connection_master.query('update Customer set age = \'' + req.body.age + '\' where c_no = \'' + Number(req.body.c_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('updated customer age data - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/update_customer_address_data/', (req, res) => {
  connection_master.query('update Customer set address = \'' + req.body.address + '\' where c_no = \'' + Number(req.body.c_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('updated customer address data - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/update_customer_phone_data/', (req, res) => {
  connection_master.query('update Customer set phone = \'' + req.body.phone + '\' where c_no = \'' + Number(req.body.c_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('updated customer address data - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/delete_customer_data/', (req, res) => {
  connection_master.query('delete from Customer where c_no = \'' + Number(req.body.c_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('deleted customer data - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/delete_car_data/', (req, res) => {
  connection_master.query('delete from Car where car_no = \'' + Number(req.body.car_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('deleted car data - result is: ', rows);
    // res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/car/s_no/:car_num', (req, res) => {
  // console.log(Number(req.params.car_num))
  connection_slave.query('select s_no from Car where car_no=\'' + Number(req.params.car_num) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('car - sno result is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/parts/parts_select/:p_no', (req, res) => {
  // console.log(Number(req.params.car_num))
  connection_slave.query('select * from Parts where p_no=\'' + Number(req.params.p_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('parts result is: ', rows);
    res.send(rows);
  });
});

app.get('/work/m_no/', (req, res) => {
  connection_slave.query('SELECT distinct m_no from Work', (error, rows) => {
    if (error) throw error;
    console.log('mechanic who have work result is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/work/:m_no', (req, res) => {
  connection_slave.query('select * from Work where m_no=\'' + Number(req.params.m_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('all work of each mechanic result is: ', rows);
    res.send(rows);
  });
});

// 파라미터 한개 포함 GET method
app.get('/repair_or_service/:his', (req, res) => {
  // console.log(req.params.his)
  connection_slave.query('select service_no from `Repair-or-Service` where history=\'' + req.params.his + '\'', (error, rows) => {
    if (error) throw error;
    console.log('service number result is: ', rows);
    res.send(rows);
  });
});

app.get('/total_invoice_list', (req, res) => {
  connection_slave.query('SELECT * from Invoice', (error, rows) => {
    if (error) throw error;
    console.log('Invoice info is: ', rows);
    res.send(rows);
  });
});

app.get('/registered_service_list', (req, res) => {
  connection_slave.query('SELECT w.service_no, w.m_no, w.work_date, r.c_no FROM Work w, `Repair-or-Service` r where w.service_no=r.service_no', (error, rows) => {
    if (error) throw error;
    console.log('Registered service info is: ', rows);
    res.send(rows);
  });
});


// insert문을 수행할 POST 메소드
app.post('/insert_invoice_data/', (req, res) => {
  connection_master.query('insert into Invoice(s_no, c_no) values(\'' + Number(req.body.s_no) + '\',\'' + Number(req.body.c_no) + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted invoice - result is: ', rows);
    // res.send(rows);
  });
});


// update문을 수행할 POST 메소드
app.post('/update_parts_minus/', (req, res) => {
  connection_master.query('update Parts set p_cnt = p_cnt-1 where p_no = \'' + Number(req.body.p_no) + '\'', (error, rows) => {
    if (error) throw error;
    console.log('updated parts count - result is: ', rows);
    // res.send(rows);
  });
});



// insert문을 수행할 POST 메소드
app.post('/insert_history_data/', (req, res) => {
  connection_master.query('insert into `Repair-or-Service`(history, c_no, p_no) values(\'' + req.body.history + '\',\'' + Number(req.body.c_no) + '\',\'' + Number(req.body.p_no) + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted history - result is: ', rows);
    // res.send(rows);
  });
});

// insert문을 수행할 POST 메소드
app.post('/insert_work_data/', (req, res) => {
  connection_master.query('insert into Work(service_no, m_no, work_date) values(\'' + Number(req.body.service_no) + '\',\'' + Number(req.body.m_no) + '\',\'' + req.body.work_date + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted work - result is: ', rows);
    // res.send(rows);
  });
});

app.post('/insert_car_data/', (req, res) => {
  connection_master.query('insert into Car(s_no, brand, year, model, color) values(\'' + Number(req.body.s_no) + '\',\'' + req.body.brand + '\',\'' + req.body.year + '\',\'' + req.body.model + '\',\'' + req.body.color + '\')', (error, rows) => {
    if (error) throw error;
    console.log('inserted car - result is: ', rows);
    // res.send(rows);
  });
});


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
