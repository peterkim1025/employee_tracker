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

function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:'
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department ID for the role:'
      }
    ])
    .then(answer => {
      db.query('INSERT INTO role SET ?', { title: answer.title, salary: answer.salary, department_id: answer.department_id }, (err, result) => {
        if (err) throw err;
        console.log('Role added successfully!');
        startApplication();
      });
    });
}

function addEmployee(){
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the first name:'
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the last name:'
      },
      {
        name: 'role_id',
        type: 'input',
        message: "Enter the role ID: "
      },
      {
        name: 'manager_id',
        type: 'input',
        message: "Enter the manager ID:"
      }
    ])
    .then(answer => {
      db.query('INSERT INTO employee SET ?', {first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id, manager_id: answer.manager_id},
      (err, result) => {
        if (err) throw err;
        console.log('Employee added successfully!');
        startApplication();
      });
    });
}

function updateEmployeeRole() {
  db.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    inquirer
      .prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employeeChoices
        },
        {
          name: 'newRoleId',
          type: 'input',
          message: 'Enter the new role ID for the employee:'
        }
      ])
      .then(answer => {
        const { employeeId, newRoleId } = answer;
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId], (err, result) => {
          if (err) throw err;
          console.log('Employee role updated successfully!');
          startApplication();
        });
      });
  });
}

return startApplication();