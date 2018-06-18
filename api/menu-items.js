const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemRouter = express.Router({mergeParams: true});

module.exports = menuItemRouter;

menuItemRouter.get('/', (req,res,next) =>{
	const menuToGetId = Number(menuItem.id);
	db.all(`SELECT * FROM MenuItem WHERE menu_id = $id`,
	{$id: menuToGetId}, (err,rows) => {
		if(rows){
			res.status(200).send({menuItems: rows});
		}else{
			res.status(404);
		}
	});
});

menuItemRouter.put('/:menuItemId',(req,res,next)=>{
	const menuItem = req.body.menuItem;
	const menuToGetId = Number(menuItem.id);
	db.get(`SELECT * FROM MenuItem WHERE id = $id`,{
		$id: menuToGetId 
	},(err,row)=>{ 
		if(!row){
			return res.status(404);//res.send({menuItem: row});
		}
		const sql = 'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menu_id WHERE id = $id';
		const values = {
			$id: menuToGetId,
			$name: menuItem.name, 
			$description: menuItem.description, 
			$inventory: menuItem.inventory, 
			$price: menuItem.price, 
			$menu_id: menuItem.menu_id	
		};
		db.run(sql , values,function(err){
			db.get(`SELECT * FROM MenuItem WHERE id = $id`,{
			$id: menuToGetId 
			},(err,row)=>{ 
				if(row){
					res.send({menuItem: row});
				}
			});	
		});
	});
});

menuItemRouter.delete('/:menuItemId',(req,res,next) => {
	const menuItem = req.body.menuItem;
	const menuToGetId = Number(menuItem.id);
	db.get(`SELECT * FROM MenuItem WHERE id = $id`,{
		$id: menuToGetId 
	},(err,row)=>{ 
		if(!row){
			return res.status(404);
		}
		db.run(`DELETE FROM MenuItem WHERE id = $id`,{
			Sid: menuToGetId 
		}, (err) => {
			res.status(204).send();
		});
	});
});
