-- Creación del usuario admin para la base de datos
CREATE USER 'clinica_user'@'localhost' IDENTIFIED BY 'yHD63d9jnYfn';
CREATE USER 'clinica_user'@'127.0.0.1' IDENTIFIED BY 'yHD63d9jnYfn';
CREATE USER 'clinica_user'@'%' IDENTIFIED BY 'yHD63d9jnYfn';  

-- Asignación de permisos
GRANT ALL ON clinica.* TO 'clinica_user'@'localhost'; 
GRANT ALL ON clinica.* TO 'clinica_user'@'127.0.0.1'; 
GRANT ALL ON clinica.* TO 'clinica_user'@'%';  

-- Refresco de los privilegios
FLUSH PRIVILEGES;