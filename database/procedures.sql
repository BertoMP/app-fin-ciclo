-- Eliminación del procedimiento si existe
DROP PROCEDURE IF EXISTS eliminar_tomas_vencidas_procedure;

DELIMITER //
CREATE PROCEDURE eliminar_tomas_vencidas_procedure()
BEGIN
    -- Declaración de variables
    DECLARE done INT DEFAULT FALSE;
    DECLARE _toma_id INT;
    
    -- Declaración de variables para el manejo de errores
    DECLARE sql_state 	CHAR(5);
    DECLARE err_no 		INT;
    DECLARE err_txt 	VARCHAR(255);
    
    -- Declaración del manejador del cursor
    DECLARE tomas_vencidas CURSOR FOR SELECT id FROM toma WHERE fecha_fin < CURDATE();
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback en caso de error
        ROLLBACK;

        -- Capturar el error
        GET DIAGNOSTICS CONDITION 1
            sql_state	= RETURNED_SQLSTATE,
            err_no		= MYSQL_ERRNO,
            err_txt		= MESSAGE_TEXT;

        -- Insertar el error en la tabla de log
        INSERT INTO error_log (errno, sql_state, error_text)
            VALUES (err_no, sql_state, err_txt);
    END;

    -- Iniciar transacción seteando autocommit a 0 para poder hacer rollback o commit
    SET autocommit = 0;

    -- Abrir cursor
    OPEN tomas_vencidas;

    -- Loop para recorrer el cursor
    loop_lectura_tomas: LOOP
        -- Fetch del cursor a la variable _toma_id
        FETCH tomas_vencidas INTO _toma_id;

        -- Si no hay mas registros, salir del loop
        IF done THEN
            LEAVE loop_lectura_tomas;
        END IF;

        -- Eliminar el registro de la tabla paciente_toma_medicamento
        DELETE FROM paciente_toma_medicamento WHERE toma_id = _toma_id;

        -- Eliminar el registro de la tabla toma
        DELETE FROM toma WHERE id = _toma_id;
    END LOOP;

    -- Cerrar cursor
    CLOSE tomas_vencidas;

    -- Commit en caso de éxito
    COMMIT;
END//
DELIMITER ;