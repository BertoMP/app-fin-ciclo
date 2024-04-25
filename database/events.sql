-- Eliminación de los eventos si existen
DROP EVENT IF EXISTS limpiar_tabla_tokens;

-- Creación de los eventos
USE clinica;

-- Evento para limpiar la tabla tokens
DELIMITER $$

CREATE EVENT limpiar_tabla_tokens
    ON SCHEDULE EVERY 1 DAY STARTS CONCAT(CURRENT_DATE, ' 02:00:00')
    DO
BEGIN
TRUNCATE TABLE token;
END $$

DELIMITER ;