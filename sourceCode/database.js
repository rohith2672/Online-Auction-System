const mysql=require('mysql');

const db = mysql.createConnection({
  host     : "auctiondatabase.c5xfieorp2bw.ap-south-1.rds.amazonaws.com" ,
  user     : "rohith26721",
  password : "Rohith1290",
  port     : "3306",
  database : "auctionHouse"
});

var pword;

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  db.query("select password from userInfo where username='user3'", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});

