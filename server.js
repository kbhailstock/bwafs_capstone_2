const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const PORT = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());


//const employeeRouter = express.Router();
//app.use('/api/employees', employeeRouter);
//const timesheetsRouter = express.Router({mergeParams: true});
//employeeRouter.use('/:id/timesheets', timesheetsRouter);
//refactor all '/api/employees' to '/' 
//refactor all 
//refactor all '/api/employees/:id/timesheets' to '/'

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


app.get('/api/employees', (req, res, next) => {
	db.all(`SELECT * FROM Employee WHERE is_current_employee = "1"`, (err, rows) => { 
	if (err) {
      		res.status(500).send(err);
    	} else {
      		res.status(200).send({employees: rows});
	    }
	 });
});

app.get('/api/employees/:id', (req, res, next) => {
	//console.log(req.params);     
	const requestedEmployeeId = Number(req.params.id);
		db.get(`SELECT * FROM Employee WHERE id = $id`, {$id : requestedEmployeeId},
			(err, row) => {      
				if(!row){
					res.status(404);
				}else if (err) {             
					res.status(500).send(err);
				}else{             
					res.status(200).send({employee: row});         
				}    
			});
});

app.post('/api/employees', (req, res, next) => {     
	const employeeToCreate = req.body.employee;
	//console.log(employeeToCreate);
			/*Am i able to insert a statement here before db.get? 
	 		I tried to insert the below line and it seemed to break the code
	  		if(!employeeToCreate.name || !employeeToCreate.position || !employeeToCreate.wage){
			res.status(400);*/
			db.run(`INSERT INTO Employee 
			(name, position, wage, is_current_employee) VALUES ($name, $position,
			$wage, '1')`, {
				$name: employeeToCreate.name , 
				$position: employeeToCreate.position, 
				$wage: employeeToCreate.wage
			},
			(err, row) =>{
				if(err){
					res.send(err);
					debugger;
					console.log(row);
				}
				db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`,(err,row)=>{
					if (!row) {
			       		res.sendStatus(400);
			      	}else{ 
			      		res.status(201).send({employee: row});
			        }
				});
			});
});


/**app.put('/api/employees/:id', (req,res,next) => {
	//Updates the employee with the specified employee ID 
	const employeeUpdate = req.body.employee;
	/*if(!employeeUpdate.id || !employeeUpdate.name || 
	/!employeeUpdate.wage || !employeeUpdate.position){
		return res.sendStatus(400);
	};*/
	/*
	db.run(`SELECT FROM Employee WHERE id = $id`,{
		$id: employeeUpdate.id
	}, function(err){
		if(!row){
			return res.sendStatus(400);
		}
		db.run(`DELETE FROM Employee WHERE id = $id`,{
			$id: employeeUpdate.id
		}, 
		function(err){
			if(err){
			 return res.sendStatus(500);
			}
			db.run(`INSERT INTO Employee (id, name, position, wage, is_current_employee) 
			VALUES ($id, $name, $position, $wage, '1')`, {
					$id: employeeUpdate.id,
					$name: employeeUpdate.name , 
					$position: employeeUpdate.position, 
					$wage: employeeUpdate.wage
			},function(err){
				if(err){
			 	return res.sendStatus(500);
			}
			});
		});
	});	
});*/

app.put('/api/employees/:id', (req,res,next) => {
	//Updates the employee with the specified employee ID 
	const employeeUpdate = req.body.employee;
	//console.log(req.body.employee);
	const employeeToUpdateId = Number(req.params.id);
	console.log(employeeToUpdateId);
	/*if(!employeeUpdate.id || !employeeUpdate.name || 
	/!employeeUpdate.wage || !employeeUpdate.position){
		return res.sendStatus(400);
	};*/
	db.run(`SELECT FROM Employee WHERE id = $id`,{
		$id: employeeToUpdateId
	}, function(err){
		if(!row){
			return res.sendStatus(400);
		}
		db.run(`UPDATE Employee SET name = $name, position = $position, wage = $wage`, {
					$id: employeeToUpdateId,
					$name: employeeUpdate.name , 
					$position: employeeUpdate.position, 
					$wage: employeeUpdate.wage
		},function(err){
			if(err){
			 	return res.sendStatus(400);
			}
			res.status(200);
			db.run(`SELECT FROM Employee WHERE id = $id`,{
				$id: employeeToUpdateId
			},function(err){
				//return error
			});
		});
	});	
});

app.delete('/api/employees/:id', (req,res,next) => {
	//Updates the employee with the specified employee ID 
	//debugger;
	//console.log(req.body);
	//const employeeDelete = req.body;
	const employeeToDeleteId = Number(req.params.id);
	db.run(`SELECT FROM Employee WHERE id = $id`,{
		$id: employeeToDeleteId 
	}, function(err){
		if(!row){
			return res.sendStatus(404);
		}
		db.run(`UPDATE Employee WHERE id = $id SET is_current_employee = 0`,{
			$id: employeeToDeleteId 
		}, 
		function(err){
			if(err){
			 return res.sendStatus(500);
			}
			return res.sendStatus(200);
		});
	});	
});

app.get('/api/employees/:id/timesheets', (req,res,next) => {
	debugger;
	const employeeToGetTimesheets = Number(req.params.id);
	console.log(employeeToGetTimesheets);
	db.run(``,function(err,row){
		//res.status(200).send({timesheets: row});
	});

});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;