const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the movies_db database.`)
);

function startApplication() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          db.end();
          break;
      }
    });
}

function viewAllDepartments() {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
}

function viewAllRoles() {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
}

function viewAllEmployees() {
  db.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    })
    .then(answer => {
      db.query('INSERT INTO department SET ?', { name: answer.name }, (err, result) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApplication();
      });
    });
}

return startApplication();