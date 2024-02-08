const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'rootroot',
    database: 'employee_management'
  },
  console.log(`Connected to the classlist_db database.`)
);

function startApp() {
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
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;

        case 'View all roles':
          viewRoles();
          break;

        case 'View all employees':
          viewEmployees();
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
          connection.end();
          console.log('Connection closed.');
          break;

        default:
          break;
      }
    });
}

function viewDepartments() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewRoles() {
  const query =
    'SELECT roles.id, roles.title, roles.salary, departments.name AS departments FROM roles INNER JOIN departments ON roles.department_id = departments.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewEmployees() {
  const query =
    'SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS departments, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON employees.manager_id = manager.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the departments:',
    })
    .then((answer) => {
      const query = 'INSERT INTO department SET ?';
      connection.query(query, { name: answer.name }, (err) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApp();
      });
    });
}

function addRole() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for the role:',
        },
        {
          name: 'department',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departments.map((department) => department.name),
        },
      ])
      .then((answers) => {
        const departmentId = departments.find(
          (department) => department.name === answers.department
        ).id;

        const role = {
          title: answers.title,
          salary: answers.salary,
          department_id: departmentId,
        };

        const query = 'INSERT INTO roles SET ?';
        connection.query(query, role, (err) => {
          if (err) throw err;
          console.log('Role added successfully!');
          startApp();
        });
      });
  });
}

function addEmployee() {
  const queryRoles = 'SELECT * FROM roles';
  const queryEmployees =
    'SELECT id, first_name, last_name FROM employees WHERE manager_id IS NULL';

  connection.query(queryRoles, (err, roles) => {
    if (err) throw err;

    connection.query(queryEmployees, (err, managers) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee:',
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee:',
          },
          {
            name: 'role',
            type: 'list',
            message: 'Select the role for the employee:',
            choices: roles.map((role) => role.title),
          },
          {
            name: 'manager',
            type: 'list',
            message: 'Select the manager for the employee:',
            choices: managers.map((manager) => manager.id),
          },
        ])
        .then((answers) => {
          const roleId = roles.find((role) => role.title === answers.role).id;

          const employee = {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: roleId,
            manager_id: answers.manager,
          };

          const query = 'INSERT INTO employee SET ?';
          connection.query(query, employee, (err) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            startApp();
          });
        });
    });
  });
}

function updateEmployeeRole() {
  const queryEmployees = 'SELECT * FROM employees';
  const queryRoles = 'SELECT * FROM roles';

  connection.query(queryEmployees, (err, employees) => {
    if (err) throw err;

    connection.query(queryRoles, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employee',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: 'newRole',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          const { employee, newRole } = answers;

          const updateQuery =
            'UPDATE employee SET role_id = ? WHERE id = ?';
          connection.query(updateQuery, [newRole, employee], (err) => {
            if (err) throw err;

            console.log('Employee role updated successfully!');
            startApp();
          });
        });
    });
  });
}

startApp();
