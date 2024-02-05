
SELECT * FROM department;


SELECT role.id, role.title, role.salary, department.name AS department
FROM role
INNER JOIN department ON role.department_id = department.id;


SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title AS job_title,
  department.name AS department,
  role.salary,
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;


INSERT INTO department (name) VALUES ('New Department');


INSERT INTO role (title, salary, department_id) VALUES ('New Role', 60000, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('New', 'Employee', 1, NULL);


UPDATE employee SET role_id = 2 WHERE id = 1;
