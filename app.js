var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const sqlite3 = require('sqlite3').verbose();


var app = express();

var array1=[];

/*
let db = new sqlite3.Database('./supermarket.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the supermarket database.');
});

db.serialize(() => {
  db.each(`SELECT id as id,
                  img as img
           FROM ad`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    array1.push({name: row.img, age: row.id});
  });
});

  let sql = `SELECT img img, id id FROM ad WHERE img = 'ok'`;

  db.all(sql, [], (err, rows) =>{
	if(err) {
		console.log(err.message);
	}
	else{
 	rows.forEach((row) => {
		console.log(row.id);
});
 }
});


  //insert
  db.run(`INSERT INTO ad(img, id) VALUES(?,?)`, ['fucked', 8], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });


//udpate
let sql2 = `UPDATE ad
            SET img = 'peachy'
            WHERE img = 'fucked'`;
 
db.run(sql2, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);
 
});



// delete a row based on id
db.run(`DELETE FROM ad WHERE id=2`, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) deleted ${this.changes}`);
});
 
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
*/

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//static path
app.use(express.static(path.join(__dirname, 'public')));

/*global variables
ap.use(funciton(res, req, next){
	res.locals.errors = null;
	next();
})
*/

//var per= [{name:'haritha', age:5}, {name:'myg', age:2}, {name:'fea', age:6}, {name:'hdsd', age:4}];

app.get('/', function(req, res, next){
    res.render('index', {name:'haritha', per:array1});
})


//display login page
app.get('/login', function(req, res, next){
    res.render('login',{status:req.query.status});
})



//display IR beam ad
app.get('/ad/:id', function(req, res, next){
    res.render('beamAd',{ad: req.params.id});
})



//view bill
app.get('/bill/:id', function(req, res, next){
	items=[];

  let db = new sqlite3.Database('./supermarket.db', (err) => {
  if (err) {
    //console.error(err.message);
  }
  console.log('Connected to the supermarket database.');
	});
	let sql = `SELECT product_id product_id, qty qty FROM item WHERE bill_id =?`;


  db.all(sql, [req.params.id], (err, rows) =>{
	if(err) {
		console.error(err.message);
	}
	else{
	 	rows.forEach((row) => {
	 		var quantity = row.qty;
			db.get(`SELECT name name from product WHERE id=?`, [row.product_id], (err, row) =>{
				var product_name = row.name;
				console.log('sdsd');
				items.push({name: product_name, qty:quantity});	
			});
			 	  	console.log(items);			
		});
 	}
	});
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Close the database connection.');
			res.render('bill',{items:items});
		});

});




//view finalized bill
//view bill
app.get('/finalize/:id', function(req, res, next){
	items=[];

  let db = new sqlite3.Database('./supermarket.db', (err) => {
  if (err) {
    //console.error(err.message);
  }
  console.log('Connected to the supermarket database.');
	});
	let sql = `SELECT product_id product_id, qty qty FROM item WHERE bill_id =?`;
	var amount = 0;

  db.all(sql, [req.params.id], (err, rows) =>{
	if(err) {
		console.error(err.message);
	}
	else{
	 	rows.forEach((row) => {
	 		var quantity = row.qty;
			db.get(`SELECT name name, price price from product WHERE id=?`, [row.product_id], (err, row) =>{
				var product_name = row.name;
				var cost = row.price*quantity;
				amount += cost;
				items.push({name: product_name, qty:quantity, price:cost });	
			});
			 	  				
		});
 	}
	});
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Close the database connection.');
			res.render('finalize',{items:items, amount: amount});
		});

});





/*
app.get('/add', function(req, res, next){
	console.log('submit');
    res.render('add');
})

app.post('/users/add', function(req, res, next){
	var newU = {name: req.body.name, age: req.body.age};
})
*/

//return checkout page
app.get('/checkout/:id', function(req, res, next){
    res.render('checkout',{bill: req.params.id});
})




//handle checkout verification
app.post('/checkout', function(req, res, next){

  let db = new sqlite3.Database('./supermarket.db', (err) => {
  if (err) {
    //console.error(err.message);
  }
  console.log('Connected to the supermarket database.');
	});
	console.log(req.body.bill);
	console.log(req.body.id);
	var valid=false;
	status='invalid';
	let sql = `SELECT product_id product_id FROM item WHERE bill_id =?`;

  db.all(sql, [req.body.bill], (err, rows) =>{
	if(err) {
		console.error(err.message);
	}
	else{
		rows.forEach((row) => {
			 if (row.product_id == req.body.id){
			 	valid=true;
			 	res.send(201, 'valid');
			 }
		});
		if (!valid){
			res.send(201, 'invalid');
		}
		
	}

	
	});
});




//handle login
app.post('/login', function(req, res, next){

  let db = new sqlite3.Database('./supermarket.db', (err) => {
  if (err) {
    //console.error(err.message);
  }
  console.log('Connected to the supermarket database.');
	});
	console.log(req.body.mobile);
	let sql = `SELECT name name, phone_no phone_no, id id FROM customer WHERE phone_no =?`;

  db.all(sql, [req.body.mobile], (err, rows) =>{
	if(err) {
		console.error(err.message);
	}
	else{
		if (rows==0){
			res.redirect('/login/?status=error');
		}
		else{
		 	rows.forEach((row) => {
				console.log(row.id);
				res.redirect('/home/?id='+row.id); 
			});
 		}
 		}
	});
  /*
  db.close((err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Close the database connection.');
	});*/
});


//switch to self checkout
app.post('/self', function(req, res, next) {

	//create a new bill
		let db = new sqlite3.Database('./supermarket.db', (err) => {
		  if (err) {
		    //console.error(err.message);
		  }
		  console.log('Connected to the supermarket database.');
			});


		db.run(`INSERT INTO bill(customer_id, date, status, amount, outlet, pay_method, self_check) VALUES(?, DATETIME('now'), 'shopping', 0, "keells rajagiriya", 'card', 1)`, [req.body.id], function(err) {
    		if (err) {
      			return console.log(err.message);
    		}
    		// get the last insert id
    		console.log(`new bill created with id ${this.lastID}`);
    		res.send(201, this.lastID);
  		});
});



//add item to cart
app.post('/addToCart', function(req, res, next) {

	//create entry in item table
		let db = new sqlite3.Database('./supermarket.db', (err) => {
		  if (err) {
		    //console.error(err.message);
		  }
		  console.log('Connected to the supermarket database.');
			});


  		//check if the item already exists in the 

		let sql = `SELECT qty qty FROM item WHERE bill_id =? and product_id=?`;

		  db.all(sql, [req.body.bill, req.body.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
				else{
				 	if (rows==0){
				 		//add item if it doesnt exist
				 			db.run(`INSERT INTO item(bill_id, product_id, qty) VALUES(?, ?,  ?)`, [req.body.bill, req.body.id, req.body.qty], function(err) {
					    	if (err) {
					      		return console.log(err.message);
					    	}
					    	// get the last insert id
					    	console.log(`new item created with id ${this.lastID}`);
					  		});

				 	}
				 	else{
				 		//update qantity if it does exist
						let sql = `UPDATE item
						            SET qty = ?
						            WHERE product_id = ?`;
						 console.log(rows[0].qty+ parseInt(req.body.qty));
						db.run(sql, [rows[0].qty+parseInt(req.body.qty), req.body.id], function(err) {
						  if (err) {
						    return console.error(err.message);
						  }
						  console.log(`Row(s) updated: ${this.changes}`);
						 
						});
				 	}

					};
		 		});    		

});



//remove item from cart
app.post('/removeFromCart', function(req, res, next) {

	//create entry in item table
		let db = new sqlite3.Database('./supermarket.db', (err) => {
		  if (err) {
		    //console.error(err.message);
		  }
		  console.log('Connected to the supermarket database.');
			});


  		//check if the item already exists in the bill
		let sql = `SELECT qty qty FROM item WHERE bill_id =? and product_id=?`;

		  db.all(sql, [req.body.bill, req.body.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
				else{

				 	if (rows.length!==0){


				 		//delete item from bill if it does exist
						db.run(`DELETE FROM item WHERE bill_id =? and product_id=?`, [req.body.bill, req.body.id], function(err) {
						  if (err) {
						    return console.error(err.message);
						  }
						  console.log(`Row(s) deleted: ${this.changes}`);
						  res.send(201, 'success');						 
						});
				 	}
				 	else{
				 		res.send(201, 'fail');
				 	}
					};
		 		});    		
});



//join queue
app.post('/queue', function(req, res, next) {


	//create queue entry
		let db = new sqlite3.Database('./supermarket.db', (err) => {
		  if (err) {
		    //console.error(err.message);
		  }
		  console.log('Connected to the supermarket database.');
			});




		db.run(`INSERT INTO queue(customer_id, queueTime, counter_assigned) VALUES(?, DATETIME('now'), 0)`, [req.body.id], function(err) {
    		if (err) {
      			return console.log(err.message);
    		}
    		// get the last insert id
    		console.log(`new queue entry created with id ${this.lastID}`);
  		});
});


//product page
app.get('/product/:id', function(req, res, next){
	product=[];
	 relIDs=[];
	 adIDs=[];
	 ad=[];
	let db = new sqlite3.Database('./supermarket.db', (err) => {
		  if (err) {
		    //console.error(err.message);
		  }
		  console.log('Connected to the supermarket database.');
			});

  		db.serialize(()=>{


  		//customer database connection
		let sql = `SELECT id id, name name, description description, image image, price price  FROM product WHERE id =?`;

		  db.all(sql, [req.params.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
				else{
				 	rows.forEach((row) => {
						console.log(row.name);
						product.push(row);

					});
		 		}    		
		});


		 //find related ads
		
		let sql5 = `SELECT ad_id ad_id FROM product_x_ad WHERE product_id =?`;
		db.all(sql5, [req.params.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
			else{
			 	rows.forEach((row) => {
					adIDs.push(row.ad_id);
					});
		 		}
		 		//return related ads
				let sql4 = `SELECT img img FROM ad WHERE id =?`;
				db.all(sql4, [adIDs[0]], (err, rows) =>{
					console.log(adIDs[0]);
					if(err) {
						console.error(err.message);
					}
					else{
					 	rows.forEach((row) => {
							console.log(row.img);
							ad.push(row.img);
							});
				 		}
				 	});
			});

		 //find related product ids
		
		let sql2 = `SELECT rel_product_id rel_product_id  FROM prod_x_prod WHERE product_id =?`;
		db.all(sql2, [req.params.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
			else{
			 	rows.forEach((row) => {
					relIDs.push(row.rel_product_id);
					});
		 		}
		 		//return related products
				let sql3 = `SELECT image image, name name, id id FROM product WHERE id =? or id =?`;
				db.all(sql3, [relIDs[0], relIDs[1]], (err, rows) =>{
					console.log(relIDs[1]);
					if(err) {
						console.error(err.message);
					}
					else{
					 	rows.forEach((row) => {
							console.log(row.name);
							});
				 		}
					res.render('product',{product:product[0], rel_prod:rows, ad:ad[0]});


				});

		});
					/*
					db.close((err) => {
					  if (err) {
					    console.error(err.message);
					  }
					  console.log('Close the database connection.');
						});*/
});
});




//homepage
  app.get('/home', function(req, res, next){
  	var name ='';
  	var priviledge='';
  	//connect to database to retrieve user data
  		let db = new sqlite3.Database('./supermarket.db', (err) => {
		  if (err) {
		    //console.error(err.message);
		  }
		  console.log('Connected to the supermarket database.');
			});

  		db.serialize(()=>{


  		//customer database connection
		let sql = `SELECT name name, phone_no phone_no, id id, priviledge priviledge FROM customer WHERE id =?`;

		  db.all(sql, [req.query.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
				else{
				 	rows.forEach((row) => {
						name+=row.name;
						priviledge+=row.priviledge;
						console.log(name);
						console.log(priviledge);

					});
		 		}
			});
		  //retreive ad ids
		let sql2 = 'SELECT ad_id ad_id from customer_x_ad WHERE customer_id =?';
		var adIds = [];

		db.all(sql2, [req.query.id], (err, rows) =>{
			if(err) {
				console.error(err.message);
			}
				else{
					let sql3 = 'SELECT img img from ad WHERE id =';
				 	rows.forEach((row) => {
						adIds.push(row.ad_id);
						sql3+=row.ad_id+' or id=';
					});
					var sql4=sql3.slice(0,-7);
		 			console.log(sql4);
		 		

		 		//retrieve ad urls

				var adURLs=[];
				console.log(adIds[0]);

				db.all(sql4, (err, rows) =>{
					if(err) {
						console.error(err.message);
					}
						else{
						 	rows.forEach((row) => {
								adURLs.push(row.img);
							});
							console.log(adURLs);
							console.log(rows[0].img);
							console.log(req.query.id);
							res.render('home',{name:name, id:req.query.id, priviledge:priviledge, adURLs:adURLs, row:rows}); 
				 		}
				})
				}

		})

  	});
/*
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
	});*/

});


//database management example code for buidling relationships between customers, prodcuts and advertisements


//build product x product relationships.
app.get('/prodxprod', function(req, res, next){


  let db = new sqlite3.Database('./supermarket.db', (err) => {
  if (err) {
    //console.error(err.message);
  }
  console.log('Connected to the supermarket database.');
	});
	var amount = 0;

db.serialize(() =>{

  db.all(`SELECT id id FROM product`, [], (err, rows) =>{
	if(err) {
		console.error(err.message);
	}
	else{
	 	rows.forEach((row) => {
	 		var id1 = row.id;
	 		db.all(`SELECT id id FROM product`, [], (err, rows) =>{
	 		if(err) {
				console.error(err.message);
			}
			else{
	 			rows.forEach((row) => {
	 				var id2 = row.id;
			  		var count =0;

			  		db.all(`SELECT bill bill_id, FROM item where product_id=?`, [id1], (err, rows) =>{
	 					if(err) {
							console.error(err.message);
						}
						else{
	 						rows.forEach((row) => {
	 							var bill=row.bill;
	 							db.all(`SELECT prod2 product_id, FROM item where bill=? and product_id=?`, [bill, prod2], (err, rows) =>{
	 								if(err) {
										console.error(err.message);
									}
									else{
	 									rows.forEach((row) => {
	 										count+=1;

	 									});
	 								}
	 							});




	 						});
	 					}
	 				});


			  		//create a new entry in the product x product data table
		 			db.run(`INSERT INTO prod_x_prod_data(product_id, rel_product_id, connections) VALUES(?, ?,  ?)`, [id1, row.id2, count], function(err) {
			    	if (err) {
			      		return console.log(err.message);
			    	}
			    	console.log(`new connection created with id ${this.lastID}`);
			  		});	
				});
	 		}
			 	  				
			});
 	
		});
	}
});
});
//end of serialized block.


	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Close the database connection.');
		});

});



app.listen(3000, function(){
          console.log("server on 3000");
        })

