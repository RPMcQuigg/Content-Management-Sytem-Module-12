
SELECT * FROM departments;

SELECT roles.id, roles.title, roles.salary, departments.name AS department
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

SELECT
  employees.id,
  employees.first_name,
  employees.last_name,
  roles.title AS job_title,
  departments.name AS department,
  roles.salary,
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees manager ON employees.manager_id = manager.id;

INSERT INTO departments (name) VALUES ('New Department');

INSERT INTO roles (title, salary, department_id) VALUES ('New Role', 60000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('New', 'Employee', 1, NULL);

UPDATE employees SET role_id = 2 WHERE id = 1;
