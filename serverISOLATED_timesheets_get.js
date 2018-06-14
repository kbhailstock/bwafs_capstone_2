const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());




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