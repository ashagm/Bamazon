DROP DATABASE IF EXISTS Bamazon;

CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,3) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("1", "Diapers", "Kids",12.99,10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("2", "Shampoo", "Cosmetics",3.99,8);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("3", "Pasta", "Grocery",4.50,12);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("4", "Milk", "Dairy",2.50,20);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("5", "Oil", "Grocery",7.50,10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("6", "Salt", "Grocery",0.50,15);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("7", "Sugar", "Grocery",0.80,10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("8", "Soap", "Cosmetics",0.70,6);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("9", "Balm", "Cosmetics",0.30,2);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("10", "Soda", "Grocery",0.20,20);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs INT NULL,
  total_sales INT NULL,
  PRIMARY KEY (department_id)
);


INSERT INTO departments (department_id, department_name, over_head_costs, total_sales)
VALUES ("01", "Electronics", 10000,20000);
INSERT INTO departments (department_id, department_name, over_head_costs, total_sales)
VALUES ("02", "Clothing", 60000, 100000);