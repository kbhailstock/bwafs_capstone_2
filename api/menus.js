
const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuRouter = express.Router();

module.exports = menuRouter; 

menuRouter.get('/', (req,res,next) => {
	db.all(`SELECT * FROM Menu`, 
		function(err, rows){
				res.status(200).send({rows});
		});
});

menuRouter.get('/:id', (req,res,next) => {
	//const menuToGetId = Number(req.body.menu);
	//console.log(menuToGet);
	db.get(`SELECT * FROM Menu WHERE id = $id`, {
		$id: menuToGet
	},function(err, row){
			if(row){
				res.status(200).send({menu: row});
			}else{
				res.status(404).send();
			}
	});
});

menuRouter.post('/', (req,res,next) =>{
	const menuItem = req.body.menuItem;
	const menuToGetId = Number(menuItem.id);
	db.get(`SELECT * FROM Menu WHERE id = $id`,{
		$id: menuToGetId 
	}, (err,row)=>{ 
		if(!row){
			return res.status(404);
		}
		db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id) 
			VALUES ($name, $description, $inventory, $price, $menu_id)`,{
			$name: menuItem.name, 
			$description: menuItem.description, 
			$inventory: menuItem.inventory, 
			$price: menuItem.price, 
			$menu_id: menuItem.menu_id	
		},function(err,row){
			if(row){
				res.status(201).send({menuItem:row});
			}
		});
	});
});

menuRouter.put('/:id', (req,res,next) => {
	//const menuToGetId = Number(req.body.menu);
	//console.log(menuToGet);
	const updatedTitle = req.body.title;
	console.log(updatedTitle);
	if(!idToUpdate || !updatedTitle){
		res.status(400);
	}
	db.get(`SELECT * FROM Menu WHERE id = $id`, {
		$id: menuToGetId
	},function(err, row){
		if(!row){
			res.status(404).send();
		}
		db.run(`UPDATE Menu SET title = $title WHERE id = $id`, {
			$title: updatedTitle
		},function(err){

		});
	});
});


menuRouter.delete('/:menuId', (req,res,next) => {
	//IF SEARCH OF MENU_ID COLUMN TURNS UP ANY ROWS DO NOT PROCEED
	const menuToGetId = Number(req.body.menu);
	db.all(`SELECT * FROM MenuItem WHERE menu_id = $id`,
	{$id: menuToGetId}, function(err,rows){
		if(!rows){
			res.status(400).send();
		}
		db.get(`SELECT * FROM Menu WHERE id = $id`, 
		{$id: menuToGetId}, function(err,row){
			if(!row){
				res.status(404);
			}
			db.run(`DELETE FROM Menu WHERE id = $id`, 
			{$id: menuToGetId}, function(err,row){
				res.status(204);
			});
		});
	});
});