const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const PORT = process.env.PORT || 4000;

/*Middleware for the app*/
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const cors = require('cors');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(errorhandler());
app.use(cors());

app.use(express.static('public'));

const apiRouter = require('./api/api');
app.use('/api', apiRouter);


/*const validateEmployeeInput = (req, res, next) =>{
	const employeeToCreate = req.body.employee;
	if(!employeeToCreate.name || !employeeToCreate.position || !employeeToCreate.wage){
		res.status(400);
	}

};*/

/*app.use('/api/employees/:id', (req, res, next) => {
	//if Id not valid e.g. found return status 404

	next();
});*/

const menuFieldCheck = (request) =>{
	if(!menuToGetId || !menuItem.name || !menuItem.description 
		||!menuItem.inventory || menuItem.price || !menuItem.menu_id){
	return res.status(400);
}

/*
app.use('/:menuId/menu-items', menuFieldCheck, (req,res,next) => {
	if(req.body.menu){
		const menuToGetId = Number(req.body.menu);
		res.send(menuToGetId);
		req.menuToGetId = menuToGetId;
		//next(menuToGetId);
	}else{
		res.status(400);
	}
	next();
});

app.use('/:menuItemId', menuFieldCheck, (req,res,next) => {
	const menuItem = req.body.menuItem;
	const menuToGetId = Number(menuItem.id);
	//res.send(menuItem, menuToGetId);
	req.menuItem = menuItem;
	req.menuToGetId = menuToGetId;
	next();
	//or return with key pairs?
});
*/

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;