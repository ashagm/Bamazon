var mysql = require("mysql");
var inquirer = require("inquirer");

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
		  	connection.query("SELECT department_id, department_name, over_head_costs, total_sales, (total_sales - over_head_costs) AS total_profit FROM departments", function(err, results) { 
                	if(err) 
                		throw err;

					if(results){
						console.log("_______________________________________________________");			
					  	for (var i = 0; i < results.length; i++) {
		   				 	console.log("#"+results[i].department_id + "\t" +
		   				 	"Name : " + results[i].department_name+ "\t" +
		   				 	" | Over Head Costs : " + results[i].over_head_costs + "\t" +
		   				 	" | Total Sales : " + results[i].total_sales + "\t" +
		   				 	" | Total Profit : " + results[i].total_profit);    				 
					}

					console.log("_______________________________________________________");
				} 

				beginBamazonSupervisor();      
            });	
            		  	
		  }else if(selection.action === "Create New Department"){

		  	inquirer.prompt([
		        {
		            type: "input",
		            name: "itemId",
		            message: "What is the Department name?"
		        }
		    ]).then(function(response) {
		  	 connection.query("INSERT INTO departments (department_name) VALUES (?)", [response.department_name], function(err, results) {                    
                	if(err) throw err;
					if(results){	
						console.log(results.affectedRows + " Department added successfully");
						console.log("_________________________________________");	
					} 
				beginBamazonSupervisor(); 
            	});
		  	});

		  }else if(selection.action === "Prefer to Exit"){
			process.exit();
		  }

	});

}