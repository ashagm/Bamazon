
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

const connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "Bamazon"
});

connection.connect(function(err){
	if(err)
		throw err;
	console.log("connected as id : " + connection.threadId + "\n");
	console.log("_____________________________________________\n");

	listProducts();
});


function listProducts(){
	inquirer.prompt([
	  {
	    type: "list",
	    message: "What do you want to do?",
	    choices: ["Display Products Available","Prefer to Exit"],
	    name: "action"
	  },

	]).then(function(selection) {

		if(selection.action === "Display Products Available"){
			var query = "SELECT item_id, product_name, price from products";
			
			connection.query(query, function(err, results, fields){
				
				if(err) throw err;
				
				if(results){	
					
					var table = new Table({
						head: ['Product Id#', 'Product Name', 'Price'],
						style: {
							head: ['red'],
							compact: false,
							colAligns: ['center'],
						}
					});
	
				  	for (var i = 0; i < results.length; i++) {
				  		table.push(
						    [results[i].item_id, results[i].product_name, results[i].price]
						);  				 
					}

					console.log(table.toString());
					
				} 

				selectNext();				
			});
		}else if(selection.action === "Prefer to Exit"){
			process.exit();
		}
	});
}

function selectNext(){
	inquirer.prompt([
	  {
	    type: "list",
	    message: "What do you want to do?",
	    choices: ["Purchase Products","Prefer to Exit"],
	    name: "action"
	  },

	]).then(function(selection) {
		  if(selection.action === "Purchase Products"){
		  	purchaseProducts();				  	
		  }else if(selection.action === "Prefer to Exit"){
			process.exit();
		  }
	});
}


function purchaseProducts(){

	inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Enter the ID of the product you wish to purchase",
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do you wish to purchase? ",
        }
    ]).then(function(response) {
    	let query = "SELECT * FROM products WHERE item_id = ?";

        connection.query( query, [response.item], function(err, result) {
            let totalCost = (result[0].price * response.quantity).toFixed(2);

            if (response.quantity > result[0].stock_quantity) {
                console.log("Insufficient quantity!! Please try again later!\n");
                selectNext();
            } 
            else {
            	let query = "UPDATE Products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
                connection.query(query, [response.quantity, response.item], function(err, result) {                    
                    console.log("Your Total cost is : $" + totalCost);
                    console.log("\n____________________________________________");
                    selectNext();
                });
            }
        });
    });

}