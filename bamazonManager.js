var mysql = require("mysql");
var inquirer = require("inquirer");
const Table = require("cli-table");

var connection = mysql.createConnection({
	host : "localhost",
	port  : 8889,
	user: "root",
	password: "root",
	database : "Bamazon"

});

connection.connect(function(err){
	if(err) throw err;
	// console.log("connected as id: " + connection.threadId);
	beginBamazonManager();
});


function beginBamazonManager(){
	inquirer.prompt([
	  {
	    type: "list",
	    message: "What do you want to do?",
	    choices: ["View Products for Sale",
	    "View Low Inventory",
	    "Add to Inventory",
	    "Add New Product", 
	    "Prefer to Exit"],
	    name: "action"
	  },

	]).then(function(selection) {

		if(selection.action === "View Products for Sale"){
			let query = "SELECT * from products";
			connection.query( query, function(err, results, fields){
				if(err) throw err;
				if(results){	

					var table = new Table({
						head: ['Product Id#', 'Product Name', 'Department Name', "In Stock", "$-Price"],
						style: {
							head: ['red'],
							compact: false,
							colAligns: ['center'],
						}
					});

			
				  	for (var i = 0; i < results.length; i++) {
				  		table.push([
						results[i].item_id, 
						results[i].product_name,
						results[i].department_name ,
	   				 	results[i].stock_quantity,
	   				 	results[i].price]);   				 
					}

					console.log(table.toString());
				} 

				beginBamazonManager();
			
			});
		}else if(selection.action === "View Low Inventory"){
			connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, results, fields){
				if(err) throw err;
				if(results){	

					var table = new Table({
						head: ['Product Name', 'Department Name', "In Stock"],
						style: {
							head: ['red'],
							compact: false,
							colAligns: ['center'],
						}
					});

			
				  	for (var i = 0; i < results.length; i++) {
				  		table.push([
						results[i].product_name,
						results[i].department_name ,
	   				 	results[i].stock_quantity
						]);   				 
					}

					console.log(table.toString());

				}

				beginBamazonManager(); 
			
			});

		}else if(selection.action === "Add to Inventory"){
			inquirer.prompt([
		        {
		            type: "input",
		            name: "itemId",
		            message: "Enter the ID of the product you wish to add to Inventory",
		        },
		        {
		            type: "input",
		            name: "quantity",
		            message: "How many do you wish to add to Inventory?",
		        }
		    ]).then(function(response) {

		    	var query = "UPDATE products SET stock_quantity =" +
                	"stock_quantity + ? WHERE item_id = ?";
                connection.query(query, 
                	[response.quantity, response.itemId], function(err, results) { 
                	if(err) throw err;

					if(results){	
						console.log(results.affectedRows + " item updated successfully");
						console.log("_______________________________________");	
					}   

					beginBamazonManager();                 

                });
                
	        });

		}else if(selection.action === "Add New Product"){
			inquirer.prompt([
		        {
		            type: "input",
		            name: "product",
		            message: "What is the product name?"
		        },
		        {
		            type: "input",
		            name: "department",
		            message: "What is the department name?"
		        },
		        {
		            type: "input",
		            name: "price",
		            message: "What is the price of each product?"
		        },
		        {
		            type: "input",
		            name: "quantity",
		            message: "How many product items in stock?"
		        }
		    ]).then(function(response) {
                connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)", [response.product,response.department,response.price,response.quantity], function(err, results) {                    
                	if(err) throw err;
					if(results){	
						console.log(results.affectedRows + " item added successfully");
						console.log("_________________________________________");	
					} 

					 beginBamazonManager();
                });

	        });

		}else if(selection.action === "Prefer to Exit"){		
			process.exit();
		}
	});
}