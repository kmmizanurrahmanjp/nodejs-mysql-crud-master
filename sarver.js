/**
 * Import core node module
 */
var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

/**
 * Parse all form data
 */
app.use(bodyParser.urlencoded({extended:true}));

/**
 * Import node module that used for formating date
 */
var dateFormate = require('dateformat');
var now = new Date();

/**
 * This is view engine
 * Template parsing
 * Here using EJS type
 */
app.set('view engine','ejs');

/**
 * Import all related JavaScript and CSS file to enject our project
 */
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

/**
 * Database connection
 */
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "nodejs_db"
});

/**
 * Global site title and base URL
 */
const siteTitle = "NodeJs CRUD App";
const baseURL = "http://localhost:9090";

/**
 * Save employee to database and render to index page
 */
app.post('/employee/add',function(req, res){
    var query = "INSERT INTO employee (e_name,e_address,e_join_date) VALUES (";
        query += "'"+req.body.e_name+"',";
        query += "'"+req.body.e_address+"',";
        query += "'"+dateFormate(req.body.e_join_date, "yyyy-mm-dd")+"')";
    con.query(query, function(err, result){
        res.redirect(baseURL);
    });
});

/**
 * Update employee to database and render to index page
 */
app.post('/employee/update/:id',function(req, res){
    var query = "UPDATE employee SET";
        query += " e_name = '"+req.body.e_name+"',";
        query += " e_address = '"+req.body.e_address+"',";
        query += " e_join_date = '"+dateFormate(req.body.e_join_date, "yyyy-mm-dd")+"'";
        query += " WHERE e_id = "+req.body.e_id;
    con.query(query, function(err, result){
        res.redirect(baseURL);
    });
});

/**
 * Delete employee and Render to index page
 */
app.get('/employee/delete/:id',function(req, res){
    con.query("DELETE FROM employee WHERE e_id = '"+req.params.id+"'", function(err, result){
        res.redirect(baseURL);
    });
});

/**
 * Get all employee from database and render to index page
 */
app.get('/',function(req, res){
    con.query("SELECT * FROM employee", function(err, result){
        res.render('pages/index',{
            siteTitle : siteTitle,
            pageTitle : "Employee List",
            items : result
        });
    });
});

/**
 * Render to employee-form page
 */
app.get('/employee/form',function(req, res){
    res.render('pages/employee-form',{
        siteTitle : siteTitle,
        pageTitle : "Employee Form",
        items : ''
    });
});

/**
 * Render to update-employee-form page
 */
app.get('/employee/updateForm/:id',function(req, res){
    con.query("SELECT * FROM employee WHERE e_id = '"+req.params.id+"'", function(err, result){
        result[0].e_join_date = dateFormate(result[0].e_join_date,"yyyy-mm-dd");
        res.render('pages/update-employee-form',{
            siteTitle : siteTitle,
            pageTitle : "Employee Update @ "+result[0].e_name,
            item : result
        });
    });
});

/**
 * Connect to server
 */
var server = app.listen(9090,function(){
    console.log("Server started on 9090 port");
});

