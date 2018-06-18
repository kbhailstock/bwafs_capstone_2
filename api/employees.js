const express = require('express'); 
const app = express();

const employeeRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const timesheetsRouter = require('./timesheets');

module.exports = employeeRouter;

employeeRouter.use('/:employeeId/timesheets', timesheetRouter);

employeeRouter.get('/', (req, res, next) => {
	db.all(`SELECT * FROM Employee WHERE is_current_employee = "1"`, (err, rows) => { 
	if (err) {
      		res.status(500).send(err);
    	} else {
      		res.status(200).send({employees: rows});
	    }
	 });
});

employeeRouter.get('/:id', (req, res, next) => {
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

employeeRouter.post('/', (req, res, next) => {     
	const employeeToCreate = req.body.employee;
	//console.log(employeeToCreate);
			/*Am i able to insert a statement here before db.get? 
	 		I tried to insert the below line and it seemed to break the code*/
	  		if(!employeeToCreate.name || !employeeToCreate.position || 
	  			!employeeToCreate.wage){
			res.status(400);
			}
			const sql = 'INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position,$wage, '1')';
			const values = {
				$name: employeeToCreate.name , 
				$position: employeeToCreate.position, 
				$wage: employeeToCreate.wage
			};
			db.run(sql, values,
			function(err,row){
				if(err){
					res.send(err);
					//debugger;
					//console.log(row);
				}
				db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`,(err,row)=>{
					if (!row) {
			       		res.status(400);
			      	}else{
			      		res.status(201).send({employee: row});
			      	}
				});
			});
});

employeeRouter.put('/:id', (req,res,next) => {
	//Updates the employee with the specified employee ID 
	const employeeUpdate = req.body.employee;
	//console.log(req.body.employee);
	const employeeToUpdateId = Number(req.params.id);
	//console.log(employeeToUpdateId);
	debugger;
	if(!employeeUpdate.name || 
	!employeeUpdate.wage || !employeeUpdate.position){
		res.status(400);
	}
	db.get(`SELECT * FROM Employee WHERE id = $id`,{
		$id: employeeToUpdateId
	}, function(err,row){
		/*if(err) {
			res.status(400);
		}
		else */if(!row){
			res.status(400);
		}
		const sql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage WHERE id = $id';
		const values = {
					$id: employeeToUpdateId,
					$name: employeeUpdate.name , 
					$position: employeeUpdate.position, 
					$wage: employeeUpdate.wage
		};
		db.run(sql, values ,function(err){
			/*if(err){
			 res.status(400);
			}*/
			db.get(`SELECT * FROM Employee WHERE id = $id`,{
				$id: employeeToUpdateId
			},function(err,row){
				if(err){
			 	res.status(400);
				}/*else if(!row){
				res.status(400);	
				}*/
				//console.log(row);
				res.status(200).send({row});
			});
		});	
	});
});

employeeRouter.delete('/:id', (req,res,next) => {
	//Updates the employee with the specified employee ID 
	debugger;
	//console.log(req.body);
	//const employeeDelete = req.body;
	const employeeToDeleteId = Number(req.params.id);
	console.log(employeeToDeleteId);
	db.get(`SELECT * FROM Employee WHERE id = $id`,{
		$id: employeeToDeleteId 
	}, function(err,row){
		if(!row){
			res.status(404);
		}
		db.run(`UPDATE Employee SET is_current_employee = 0 WHERE id = $id `,{
			$id: employeeToDeleteId 
		}, 
		function(err){
			if(err){
			 res.status(500);
			}
			res.status(200);
			db.get(`SELECT * FROM Employee WHERE id = $id`,{
				$id: employeeToDeleteId 
			}, function(err,row){
			//console.log('row='+row);
			//debugger;
			return res.send({row});
			});
		});
	});	
});

