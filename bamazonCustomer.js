// Running this application will first display all of 
// the items available for sale. Include the ids, names, and prices of products for sale.
// 

const mysql = require("mysql");
const inquirer = require("inquirer");

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
	console.log("\n_________________________________________________________");
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
			console.log("\nProducts Available" + "\n__________________________________________\n");
			connection.query(query, function(err, results, fields){
				if(err) throw err;
				if(results){	
					console.log("ProductId\t" + "Product\t" + "\tPrice\n");		
				  	for (var i = 0; i < results.length; i++) {
	   				 	console.log("#"+results[i].item_id + "\t" +
	   				 	"\t" + results[i].product_name + "\t" +
	   				 	"\t$" + results[i].price);   				 
					}
					console.log("___________________________________________\n");
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
        connection.query("SELECT * FROM products WHERE item_id = ?", [response.item], function(err, result) {
            var totalCost = (result[0].price * response.quantity).toFixed(2);
            if (response.quantity > result[0].stock_quantity) {
                console.log("Insufficient quantity!! Please try again later!\n");
                selectNext();
            } 
            else {
                connection.query("UPDATE Products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [response.quantity, response.item], function(err, result) {                    
                    console.log("Your Total cost is : $" + totalCost + "\n____________________________________________");
                    selectNext();
                });
            }
        });
    });

}