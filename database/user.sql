-- Creación de los usuarios para la base de datos
CREATE USER 'clinica_user'@'localhost' IDENTIFIED BY 'yHD63d9jnYfn';
CREATE USER 'clinica_user'@'127.0.0.1' IDENTIFIED BY 'yHD63d9jnYfn';
CREATE USER 'clinica_user'@'%' IDENTIFIED BY 'yHD63d9jnYfn';  

-- Asignación de permisos
GRANT SELECT, INSERT, UPDATE, DELETE ON clinica.* TO 'clinica_user'@'localhost'; 
GRANT SELECT, INSERT, UPDATE, DELETE ON clinica.* TO 'clinica_user'@'127.0.0.1'; 
GRANT SELECT, INSERT, UPDATE, DELETE ON clinica.* TO 'clinica_user'@'%';  

-- Refresco de los privilegios
FLUSH PRIVILEGES;