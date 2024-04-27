-- Habilitar el planificador de eventos
SET GLOBAL event_scheduler = ON;

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
        TRUNCATE TABLE token;
    END //
DELIMITER ;


DELIMITER //
CREATE EVENT eliminar_tomas_vencidas_event
    ON SCHEDULE EVERY 1 DAY
        STARTS CONCAT(CURRENT_DATE, ' 02:00:00')
    DO
    CALL eliminar_tomas_vencidas_procedure()//
DELIMITER ;