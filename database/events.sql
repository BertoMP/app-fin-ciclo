-- Selección de la base de datos
USE clinica;

-- Eliminación de los eventos si existen
DROP EVENT IF EXISTS limpiar_tabla_tokens_event;
DROP EVENT IF EXISTS eliminar_tomas_vencidas_event;

-- Evento para limpiar la tabla tokens
DELIMITER //
CREATE EVENT limpiar_tabla_tokens_event
    ON SCHEDULE EVERY 1 DAY
        STARTS CONCAT(CURRENT_DATE, ' 02:00:00')
    DO
    BEGIN
        DELETE
        FROM token
        WHERE created_at < NOW() - INTERVAL 1 HOUR;
    END //
DELIMITER ;


-- Evento para eliminar las tomas vencidas de la tabla toma y de paciente_toma_medicamento
DELIMITER //
CREATE EVENT eliminar_tomas_vencidas_event
    ON SCHEDULE EVERY 1 DAY
        STARTS CONCAT(CURRENT_DATE, ' 02:00:00')
    DO
    CALL eliminar_tomas_vencidas_procedure()//
DELIMITER ;