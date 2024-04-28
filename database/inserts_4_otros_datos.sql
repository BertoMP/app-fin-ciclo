-- Inserción de datos en la tabla informe
INSERT INTO informe (motivo, contenido)
VALUES
    ('Dolor en el pecho', 'El paciente presenta dolor en el pecho y palpitaciones. Se recomienda realizar un electrocardiograma para evaluar la presencia de arritmias.'),
    ('Erupción cutánea',  'El paciente presenta una erupción cutánea en el brazo derecho. Se recomienda aplicar una crema hidratante y evitar el contacto con sustancias irritantes.'),
    ('Fatiga y aumento de peso',  'El paciente presenta fatiga, aumento de peso y piel seca. Se recomienda realizar un análisis de sangre para evaluar la función tiroidea.'),
    ('Dolor abdominal','El paciente presenta dolor abdominal y acidez estomacal. Se recomienda realizar una endoscopia para evaluar la presencia de gastritis.'),
    ('Anemia y fatiga',  'El paciente presenta anemia y fatiga. Se recomienda realizar un análisis de sangre para evaluar los niveles de hierro y hemoglobina.');

-- Inserción de datos en la tabla patologia
INSERT INTO patologia (nombre, descripcion) 
VALUES 
    ('Diabetes', 'Enfermedad crónica que se caracteriza por niveles elevados de glucosa en sangre debido a la incapacidad del cuerpo para producir o utilizar adecuadamente insulina.'),
    ('Hipertensión', 'Afección en la cual la presión arterial en las arterias es persistentemente elevada, aumentando el riesgo de enfermedades cardíacas, accidentes cerebrovasculares, etc.'),
    ('Asma', 'Trastorno crónico de las vías respiratorias que causa inflamación y estrechamiento, provocando dificultad para respirar, tos y sibilancias.'),
    ('Artritis', 'Inflamación de una o más articulaciones, que puede causar dolor, hinchazón y dificultad para moverse.'),
    ('Depresión', 'Trastorno del estado de ánimo que provoca sentimientos de tristeza, pérdida de interés o placer, cambios en el apetito o el sueño, y dificultad para concentrarse.'),
    ('Ansiedad', 'Trastorno mental caracterizado por preocupación, miedo o nerviosismo excesivo, que puede interferir con la vida diaria.'),
    ('Enfermedad de Alzheimer', 'Trastorno neurodegenerativo progresivo que causa deterioro cognitivo y funcional, afectando la memoria, el pensamiento y el comportamiento.'),
    ('Arritmia', 'Alteración en el ritmo cardíaco, que puede manifestarse como latidos irregulares, demasiado rápidos o demasiado lentos.'),
    ('Dermatitis', 'Inflamación de la piel que puede causar enrojecimiento, picazón, descamación y otras molestias.'),
    ('Hipotiroidismo', 'Trastorno en el cual la glándula tiroides no produce suficiente hormona tiroidea, lo que puede causar fatiga, aumento de peso, piel seca y otros síntomas.'),
    ('Gastritis', 'Inflamación del revestimiento del estómago, que puede causar dolor abdominal, indigestión, náuseas y otros síntomas.'),
    ('Anemia Ferropénica', 'Deficiencia de hierro en el cuerpo que conduce a una disminución en el número de glóbulos rojos y la capacidad de transportar oxígeno, resultando en fatiga, debilidad y otros síntomas.');

-- Inserción de datos en la tabla informe_patologia
INSERT INTO informe_patologia (informe_id, patologia_id)
VALUES
	(1, 1),
    (1, 2),
    (1, 3),
    (1, 6);

-- Inserción de datos en la tabla cita
INSERT INTO cita (fecha, hora, especialista_id, paciente_id, informe_id)
VALUES
    ('2024-04-21', '08:00:00', 3, 11, 1),
    ('2024-04-21', '14:30:00', 6, 11, 2),
    ('2024-04-21', '08:30:00', 7, 11, 3),
    ('2024-04-21', '15:00:00', 9, 11, 4),
    ('2024-04-21', '09:00:00', 10, 11, 5);

-- Inserción de datos en la tabla medicamento
INSERT INTO medicamento (nombre, descripcion)
VALUES
    ('Paracetamol', 'Analgésico y antipirético'),
    ('Ibuprofeno', 'Antiinflamatorio y analgésico'),
    ('Omeprazol', 'Inhibidor de la bomba de protones'),
    ('Amoxicilina', 'Antibiótico de amplio espectro'),
    ('Loratadina', 'Antihistamínico'),
    ('Atorvastatina', 'Estatina para reducir el colesterol'),
    ('Metformina', 'Antidiabético oral'),
    ('Losartán', 'Antagonista de los receptores de angiotensina II'),
    ('Levotiroxina', 'Hormona tiroidea sintética'),
    ('Insulina', 'Hormona para el tratamiento de la diabetes'),
    ('Aspirina', 'Antiagregante plaquetario y analgésico'),
    ('Diazepam', 'Ansiolítico y relajante muscular'),
    ('Ondansetrón', 'Antiemético para las náuseas y vómitos'),
    ('Furosemida', 'Diurético para la retención de líquidos'),
    ('Metoclopramida', 'Procinético y antiemético'),
    ('Dexametasona', 'Corticosteroide con efecto antiinflamatorio'),
    ('Ranitidina', 'Antagonista de los receptores H2'),
    ('Ciprofloxacino', 'Antibiótico de amplio espectro'),
    ('Dipirona', 'Analgésico y antipirético'),
    ('Clonazepam', 'Ansiolítico y antiepiléptico');

-- Inserción de datos en la tabla tension_arterial
INSERT INTO tension_arterial (paciente_id, sistolica, diastolica, fecha, hora, pulsaciones_minuto)
VALUES
    (2, 120, 80, '2024-04-21', '10:00:00', 70),
    (4, 130, 85, '2024-04-22', '11:00:00', 75),
    (5, 140, 90, '2024-04-23', '12:00:00', 80),
    (8, 150, 95, '2024-04-24', '13:00:00', 85),
    (11, 160, 100, '2024-03-25', '14:00:00', 90),
    (2, 120, 80, '2024-04-26', '10:00:00', 70),
    (4, 130, 85, '2024-04-27', '11:00:00', 75),
    (5, 140, 90, '2024-04-28', '12:00:00', 80),
    (8, 150, 95, '2024-04-29', '13:00:00', 85),
    (11, 160, 100, '2024-03-30', '14:00:00', 90),
    (2, 120, 80, '2024-05-01', '10:00:00', 70),
    (4, 130, 85, '2024-05-02', '11:00:00', 75),
    (5, 140, 90, '2024-05-03', '12:00:00', 80),
    (8, 150, 95, '2024-05-04', '13:00:00', 85),
    (11, 160, 100, '2024-03-05', '14:00:00', 90),
    (2, 120, 80, '2024-05-06', '10:00:00', 70),
    (4, 130, 85, '2024-05-07', '11:00:00', 75),
    (5, 140, 90, '2024-05-08', '12:00:00', 80),
    (8, 150, 95, '2024-05-09', '13:00:00', 85),
    (11, 160, 100, '2024-03-10', '14:00:00', 90),
    (2, 120, 80, '2024-05-11', '10:00:00', 70),
    (4, 130, 85, '2024-05-12', '11:00:00', 75),
    (5, 140, 90, '2024-05-13', '12:00:00', 80),
    (8, 150, 95, '2024-05-14', '13:00:00', 85),
    (11, 160, 100, '2024-03-15', '14:00:00', 90),
    (2, 120, 80, '2024-05-16', '10:00:00', 70),
    (4, 130, 85, '2024-05-17', '11:00:00', 75),
    (5, 140, 90, '2024-05-18', '12:00:00', 80),
    (8, 150, 95, '2024-05-19', '13:00:00', 85),
    (11, 160, 100, '2024-03-20', '14:00:00', 90),
    (2, 120, 80, '2024-05-21', '10:00:00', 70),
    (4, 130, 85, '2024-05-22', '11:00:00', 75),
    (5, 140, 90, '2024-05-23', '12:00:00', 80),
    (8, 150, 95, '2024-05-24', '13:00:00', 85),
    (2, 120, 80, '2024-05-26', '10:00:00', 70),
    (4, 130, 85, '2024-05-27', '11:00:00', 75),
    (5, 140, 90, '2024-05-28', '12:00:00', 80),
    (8, 150, 95, '2024-05-29', '13:00:00', 85);

-- Inserción de datos en la tabla glucometria
INSERT INTO glucometria (paciente_id, medicion, fecha, hora)
VALUES
    (2, 120, '2024-04-21', '10:00:00'),
    (4, 130, '2024-04-22', '11:00:00'),
    (5, 140, '2024-04-23', '12:00:00'),
    (8, 150, '2024-04-24', '13:00:00'),
    (11, 160, '2024-04-25', '14:00:00'),
    (2, 120, '2024-04-26', '10:00:00'),
    (4, 130, '2024-04-27', '11:00:00'),
    (5, 140, '2024-04-28', '12:00:00'),
    (8, 150, '2024-04-29', '13:00:00'),
    (11, 160, '2024-04-30', '14:00:00'),
    (2, 120, '2024-05-01', '10:00:00'),
    (4, 130, '2024-05-02', '11:00:00'),
    (5, 140, '2024-05-03', '12:00:00'),
    (8, 150, '2024-05-04', '13:00:00'),
    (11, 160, '2024-05-05', '14:00:00'),
    (2, 120, '2024-05-06', '10:00:00'),
    (4, 130, '2024-05-07', '11:00:00'),
    (5, 140, '2024-05-08', '12:00:00'),
    (8, 150, '2024-05-09', '13:00:00'),
    (11, 160, '2024-05-10', '14:00:00'),
    (2, 120, '2024-05-11', '10:00:00'),
    (4, 130, '2024-05-12', '11:00:00'),
    (5, 140, '2024-05-13', '12:00:00'),
    (8, 150, '2024-05-14', '13:00:00'),
    (11, 160, '2024-05-15', '14:00:00'),
    (2, 120, '2024-05-16', '10:00:00'),
    (4, 130, '2024-05-17', '11:00:00'),
    (5, 140, '2024-05-18', '12:00:00'),
    (8, 150, '2024-05-19', '13:00:00'),
    (11, 160, '2024-05-20', '14:00:00'),
    (2, 120, '2024-05-21', '10:00:00'),
    (4, 130, '2024-05-22', '11:00:00'),
    (5, 140, '2024-05-23', '12:00:00'),
    (8, 150, '2024-05-24', '13:00:00'),
    (11, 160, '2024-05-25', '14:00:00'),
    (2, 120, '2024-05-26', '10:00:00'),
    (4, 130, '2024-05-27', '11:00:00'),
    (5, 140, '2024-05-28', '12:00:00'),
    (8, 150, '2024-05-29', '13:00:00'),
    (11, 160, '2024-05-30', '14:00:00');

-- Inserción de datos en toma
INSERT INTO toma (hora, dosis, fecha_inicio, fecha_fin, observaciones)
VALUES
    ('10:00:00', 1, '2024-04-25', '2024-05-25', 'Tomar con agua'),
    ('14:00:00', 2, '2024-04-26', NULL, 'Tomar después de comer'),
    ('20:00:00', 1, '2024-04-27', '2024-05-27', NULL),
    ('22:00:00', 2, '2024-04-28', NULL, NULL),
    ('07:00:00', 1, '2024-04-29', '2024-05-29', 'Tomar con el desayuno'),
    ('15:00:00', 2, '2024-04-30', NULL, 'Tomar después de comer'),
    ('21:00:00', 1, '2024-05-01', '2024-06-01', NULL),
    ('23:00:00', 2, '2024-05-02', NULL, NULL),
    ('06:00:00', 1, '2024-05-03', '2024-06-03', 'Tomar antes del desayuno'),
    ('16:00:00', 2, '2024-05-04', NULL, 'Tomar durante la cena'),
    ('22:00:00', 1, '2024-05-05', '2024-06-05', NULL),
    ('00:00:00', 2, '2024-05-06', NULL, NULL);

-- Inserción de datos en paciente_toma_medicamento
INSERT INTO paciente_toma_medicamento (paciente_id, toma_id, medicamento_id)
VALUES
    (11, 1, 1),
    (11, 2, 1),
    (11, 3, 1),
    (11, 4, 2),
    (11, 5, 2),
    (11, 6, 3),
    (11, 7, 4),
    (11, 8, 4),
    (11, 9, 4),
    (11, 10, 4),
    (11, 11, 5),
    (11, 12, 6);