const mysql=require('mysql');

const db = mysql.createConnection({
  host     : "auctiondatabase.c5xfieorp2bw.ap-south-1.rds.amazonaws.com" ,
  user     : "rohith26721",
  password : "Rohith1290",
  port     : "3306",
  database : "auctionHouse"
});

db.connect(function(err) 
{
 if (err) throw err;
  console.log("Connected!");
  });

  var uname='user3';
  db.query("select * from userInfo where username= ? ",[uname], function (err, result, fields) {
     var passWord=JSON.stringify(result[0].password);
     console.log(passWord);
    });

