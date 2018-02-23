var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host : "localhost",
	port  : 8889,
	user: "root",
	password: "root",
	database : "Bamazon"

});

connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id: " + connection.threadId);
	beginBamazonSupervisor();
});


function beginBamazonSupervisor(){

	inquirer.prompt([
	  {
	    type: "list",
	    message: "What do you want to do?",
	    choices: ["View Product Sales by Department",
	    			"Create New Department", 
	    			"Prefer to Exit"],
	    name: "action"
	  },

	]).then(function(selection) {
		  if(selection.action === "View Product Sales by Department"){

		  	let query = "SELECT department_id, department_name, over_head_costs, total_sales, (total_sales - over_head_costs) AS total_profit FROM departments";

		  	console.log(query);

		  	connection.query(query, function(err, results) { 
                	if(err) 
                		throw err;

					if(results){

						var table = new Table({
							head: ['Deparment Id#', 'Department Name', 'Over Head Costs', 'Total Sales', 'Total Profit'],
							style: {
								head: ['red'],
								compact: false,
								colAligns: ['center']
							}
						});
	
					  	for (var i = 0; i < results.length; i++) {
					  		table.push(
							    [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].total_sales, results[i].total_profit]
							);  				 
						}

					console.log(table.toString());

				} 

				beginBamazonSupervisor();      
            });	

		  }else if(selection.action === "Create New Department"){

		  	inquirer.prompt([
		        {
		            type: "input",
		            name: "department_name",
		            message: "What is the Department name?"
		        }
		    ]).then(function(response) {
		  	 connection.query("INSERT INTO departments (department_name) VALUES (?)", [response.department_name], function(err, results) {                    
                	if(err) throw err;
					if(results){	
						console.log(results.affectedRows + " Department added successfully");
					} 
				beginBamazonSupervisor(); 

            	});
		  	});

		  }else if(selection.action === "Prefer to Exit"){
			process.exit();
		  }

	});

}