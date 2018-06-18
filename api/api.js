const express = require('express');
const app = express();

const apiRouter = express.Router();

const employeeRouter = require('./employees');
apiRouter.use('/employees', employeeRouter);

const timesheetRouter = require('./timesheets');
apiRouter.use('/employees', employeeRouter);

const menuRouter = require('./menus');
apiRouter.use('/menus', menuRouter);

module.exports = apiRouter;
