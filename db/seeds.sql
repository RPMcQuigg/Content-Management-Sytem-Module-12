
INSERT INTO department (name) VALUES
('Sales'),
('Development'),
('Human Resources');


INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 60000, 1),
('Software Engineer', 70000, 2),
('HR Specialist', 50000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Bob', 'Johnson', 3, NULL);
