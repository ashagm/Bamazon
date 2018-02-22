var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host : "localhost",
	port  : 8889,
	user: "root",
	password: "",
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
	    choices: ["View Products for Sale","View Low Inventory","Add to Inventory", "Add New Product", "Prefer to Exit"],
	    name: "action"
	  },

	]).then(function(selection) {

		if(selection.action === "View Products for Sale"){
			connection.query("SELECT * from products", function(err, results, fields){
				if(err) throw err;
				if(results){	
					console.log("ID\t" + "\tProduct\t" + "\tDepartment\t" + "\tStock\t" + "\tPrice" + "\n");
					console.log("____________________________________________________________________");		
				  	for (var i = 0; i < results.length; i++) {
	   				 	console.log("#"+results[i].item_id + "\t" +
	   				 	"\t" + results[i].product_name + "\t" +
	   				 	"\t" + results[i].department_name + "\t" +
	   				 	"\t" + results[i].stock_quantity + "\t" +
	   				 	"\t$" + results[i].price);   				 
					}
					console.log("____________________________________________");
				} 

				beginBamazonManager();
			
			});
		}else if(selection.action === "View Low Inventory"){
			connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, results, fields){
				if(err) throw err;
				if(results){	
					console.log("___________________________________________");		
				  	for (var i = 0; i < results.length; i++) {
	   				 	console.log("#"+results[i].item_id + 
	   				 	"\tProduct: " + results[i].product_name + 
	   				 	"\tDepartment: " + results[i].department_name +
	   				 	"\tIn Stock: " + results[i].stock_quantity +
	   				 	"\tPrice: $ " + results[i].price);   				 
					}
					console.log("___________________________________________");
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
                connection.query("UPDATE products SET stock_quantity =" +
                	"stock_quantity + ? WHERE item_id = ?", 
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
		            name: "itemId",
		            message: "What is the Id of the product?"
		        },
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
                connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (?,?,?,?,?)", [response.itemId,response.product,response.department,response.price,response.quantity], function(err, results) {                    
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