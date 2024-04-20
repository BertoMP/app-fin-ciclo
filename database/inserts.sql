-- Inserción de datos en la tabla tipos_via
INSERT INTO tipo_via (nombre)
VALUES
    ('Calle'),
    ('Avenida'),
    ('Plaza'),
    ('Paseo'),
    ('Camino'),
    ('Travesía'),
    ('Carretera'),
    ('Cuesta'),
    ('Pasaje'),
    ('Ronda'),
    ('Glorieta'),
    ('Rambla'),
    ('Callejón'),
    ('Prolongación'),
    ('Riera');

-- Inserción de los datos de la tabla rol
INSERT INTO rol (nombre)
VALUES  ('admin'),
        ('paciente'),
        ('especialista');

-- Inserción de datos en la tabla especialidad
INSERT INTO especialidad (nombre, descripcion, imagen)
VALUES
    ('Cardiología', 'Especialidad médica dedicada al estudio del corazón', 'imagen_cardiologia.jpg'),
    ('Dermatología', 'Especialidad médica que se ocupa de la piel', 'imagen_dermatologia.jpg'),
    ('Endocrinología', 'Especialidad médica que estudia las glándulas que producen las hormonas', 'imagen_endocrinologia.jpg'),
    ('Gastroenterología', 'Especialidad médica que se ocupa del sistema digestivo', 'imagen_gastroenterologia.jpg'),
    ('Hematología', 'Especialidad médica que se ocupa de la sangre y sus enfermedades', 'imagen_hematologia.jpg'),
    ('Infectología', 'Especialidad médica que se ocupa de las enfermedades infecciosas', 'imagen_infectologia.jpg'),
    ('Nefrología', 'Especialidad médica que se ocupa de los riñones', 'imagen_nefrologia.jpg'),
    ('Neumología', 'Especialidad médica que se ocupa del sistema respiratorio', 'imagen_neumologia.jpg'),
    ('Neurología', 'Especialidad médica que se ocupa del sistema nervioso', 'imagen_neurologia.jpg'),
    ('Oncología', 'Especialidad médica que se ocupa del cáncer', 'imagen_oncologia.jpg'),
    ('Oftalmología', 'Especialidad médica que se ocupa de los ojos', 'imagen_oftalmologia.jpg'),
    ('Ortopedia', 'Especialidad médica que se ocupa del sistema musculoesquelético', 'imagen_ortopedia.jpg'),
    ('Otorrinolaringología', 'Especialidad médica que se ocupa de los oídos, nariz y garganta', 'imagen_otorrinolaringologia.jpg'),
    ('Pediatría', 'Especialidad médica que se ocupa de los niños y adolescentes', 'imagen_pediatría.jpg'),
    ('Psiquiatría', 'Especialidad médica que se ocupa de la salud mental', 'imagen_psiquiatría.jpg');

-- Inserción de datos en la tabla consulta
INSERT INTO consulta (nombre)
VALUES
    ('1-A'),
    ('2-B'),
    ('3-C'),
    ('4-D'),
    ('5-E'),
    ('6-F'),
    ('7-G'),
    ('8-H'),
    ('9-I'),
    ('10-J'),
    ('11-K'),
    ('12-L'),
    ('13-M'),
    ('14-N'),
    ('15-O'),
    ('16-P'),
    ('17-Q'),
    ('18-R'),
    ('19-S'),
    ('20-T');

-- Inserción de datos en la tabla usuario
INSERT INTO usuario (email, password, nombre, primer_apellido, segundo_apellido, dni, rol_id)
VALUES
    ('joseperez@example.com', '$2a$10$RNKIrdkRrPG5rMRx/LL06.6dvvy1S05oZDeD3IhLhQrjzqCJ8vNRe', 'Jose', 'Perez', 'Gomez', '12345678A', 1), -- Password_1
    ('anamartinez@example.com', '$2a$10$4x32KSHtkQMxLp9gXczQ1eE9CbQ2nrJwxrXN0o8ybGzBfH8WtFAMC', 'Ana', 'Martinez', 'Lopez', '12345679B', 2), -- Password_2
    ('carlosgutierrez@example.com', '$2a$10$K3Td2n0rlZBXPJKYX0QfK.c/bNmewdb7V.HNrN8z22gbHCN/ck3Mu', 'Carlos', 'Gutierrez', 'Torres', '12345680C', 3), -- Password_3
    ('mariarodriguez@example.com', '$2a$10$sAL0pjvGgdVBXT5w7RkF/eSkVe9gdcgDAUhlee4jcwu375Ka9/K2S', 'Maria', 'Rodriguez', 'Morales', '12345681D', 2), -- Password_4
    ('juangonzalez@example.com', '$2a$10$e2UHiqEnKEAZvjDheTkeYOYJ/OiuX50ca2QqmJiUH3t9eqwgiIwKy', 'Juan', 'Gonzalez', 'Guerrero', '12345682E', 2), -- Password_5
    ('lauraramirez@example.com', '$2a$10$eTVH7a9hepLY.LP0GSrk6ufwQcqdwtxDQUptj8kiyMmWOzYeAzUOm', 'Laura', 'Ramirez', 'Santos', '12345683F', 3), -- Password_6
    ('davidmorales@example.com', '$2a$10$DEFgybDeBQjHZrEb15cPo.sEsxkvxDmr7FxaD5hMy70mzZV6dDlmu', 'David', 'Morales', 'Peña', '12345684G', 3), -- Password_7
    ('carmenlopez@example.com', '$2a$10$Se0xTl6HVLjumMsuzyUWDOH9HVnlsZHJP5mcOwpoLkRarVlN5mNmy', 'Carmen', 'Lopez', 'Cano', '12345685H', 2), -- Password_8
    ('franciscotorres@example.com', '$2a$10$w0rtDkkgct4xnLZuqsjcrOcqjqLAnqrxMS9BKOnHaivCE6.pVFYX2', 'Francisco', 'Torres', 'Romero', '12345686I', 3), -- Password_9
    ('patriciamedina@example.com', '$2a$10$ZLfC3hOHt3vko2kr8hseQOSkweAjcp.2fuNwqQ94AJEe07YAzoF8e', 'Patricia', 'Medina', 'Navarro', '12345687J', 3), -- Password_10
    ('alberto.martinezp1990@gmail.com', '$2a$10$Myo7jf8Snf5ueV0dv62NPeYVt/dpKUqHfDmjoRlJjYAJGeyLX612C', 'Alberto', 'Martinez', 'Perez', '47234226T', 2); -- Waypo_1990

-- Inserción de datos en la tabla paciente
INSERT INTO paciente (usuario_id, fecha_nacimiento,  num_historia_clinica, tipo_via, nombre_via, numero, piso, puerta, municipio, codigo_postal, tel_movil, tel_fijo)
VALUES
    (2, '1990-01-01', '2024042018551234', 1, 'Mayor', 1, 1, 5, 3535, '28001', '666666666', '911111111'),
    (4, '1991-02-02', '2024042018551235', 2, 'Reina Victoria', 2, 2, 'B', 3535, '28002', '666666667', '911111112'),
    (5, '1992-03-03', '2024042018551236', 3, 'Sol', 3, 3, 8, 3535, '28003', '666666668', '911111113'),
    (8, '1993-04-04', '2024042018551237', 4, 'Castellana', 4, 4, 4, 3535, '28004', '666666669', '911111114'),
    (11, '2000-11-11', '2024042018551244', 1, 'Cuba', 8, 3, 3, 2296, '28822', '667412545', '910712071');

-- Inserción de datos en la tabla especialista
INSERT INTO especialista (usuario_id, num_colegiado, descripcion, imagen, turno, especialidad_id, consulta_id)
VALUES
    (3, '123456789', 'Especialista en cardiología con más de 10 años de experiencia en el diagnóstico y tratamiento de enfermedades del corazón. Ha trabajado en varios hospitales de renombre y tiene una amplia formación en el campo.', 'imagen_cardiologia.jpg', 'diurno', 1, 1),
    (6, '123456790', 'Especialista en dermatología con un enfoque particular en el tratamiento de enfermedades de la piel. Ha publicado varios artículos en revistas médicas y es reconocido por su enfoque integral en el cuidado de la piel.', 'imagen_dermatologia.jpg', 'vespertino', 2, 2),
    (7, '123456791', 'Especialista en endocrinología con una amplia experiencia en el manejo de trastornos hormonales. Se especializa en el tratamiento de la diabetes y otras enfermedades endocrinas.', 'imagen_endocrinologia.jpg', 'diurno', 3, 3),
    (9, '123456792', 'Especialista en gastroenterología con experiencia en el diagnóstico y tratamiento de enfermedades del sistema digestivo. Ha trabajado en varios centros médicos de alto nivel y es conocido por su enfoque personalizado en el cuidado del paciente.', 'imagen_gastroenterologia.jpg', 'vespertino', 4, 4),
    (10, '123456793', 'Especialista en hematología con un enfoque en el diagnóstico y tratamiento de enfermedades de la sangre. Ha trabajado en varios hospitales de renombre y tiene una amplia formación en el campo.', 'imagen_hematologia.jpg', 'no-trabajando', 5, 5);

-- Inserción de datos en la tabla informe
INSERT INTO informe (motivo, patologia, contenido)
VALUES
    ('Dolor en el pecho', 'Arritmia', 'El paciente presenta dolor en el pecho y palpitaciones. Se recomienda realizar un electrocardiograma para evaluar la presencia de arritmias.'),
    ('Erupción cutánea', 'Dermatitis', 'El paciente presenta una erupción cutánea en el brazo derecho. Se recomienda aplicar una crema hidratante y evitar el contacto con sustancias irritantes.'),
    ('Fatiga y aumento de peso', 'Hipotiroidismo', 'El paciente presenta fatiga, aumento de peso y piel seca. Se recomienda realizar un análisis de sangre para evaluar la función tiroidea.'),
    ('Dolor abdominal', 'Gastritis', 'El paciente presenta dolor abdominal y acidez estomacal. Se recomienda realizar una endoscopia para evaluar la presencia de gastritis.'),
    ('Anemia y fatiga', 'Anemia ferropénica', 'El paciente presenta anemia y fatiga. Se recomienda realizar un análisis de sangre para evaluar los niveles de hierro y hemoglobina.');

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

-- Inserción de datos en la tabla paciente_medicamento
INSERT INTO paciente_medicamento (paciente_id, medicamento_id, toma_diurna, toma_vespertina, toma_nocturna)
VALUES
    (2, 1, 1, 0, 1),
    (2, 2, 0, 1, 0),
    (4, 3, 1, 0, 1),
    (4, 4, 0, 1, 0),
    (5, 5, 1, 0, 1),
    (5, 6, 0, 1, 0),
    (8, 7, 1, 0, 1),
    (8, 8, 0, 1, 0),
    (11, 11, 1, 0, 1),
    (11, 12, 0, 1, 0),
    (11, 13, 1, 0, 1),
    (11, 14, 0, 1, 0),
    (11, 15, 1, 0, 1),
    (11, 16, 0, 1, 0),
    (11, 17, 1, 0, 1);

-- Inserción de datos en la tabla tension_arterial
INSERT INTO tension_arterial (paciente_id, sistolica, diastolica, fecha, hora, pulsaciones_minuto)
VALUES
    (2, 120, 80, '2024-04-21', '10:00:00', 70),
    (4, 130, 85, '2024-04-22', '11:00:00', 75),
    (5, 140, 90, '2024-04-23', '12:00:00', 80),
    (8, 150, 95, '2024-04-24', '13:00:00', 85),
    (11, 160, 100, '2024-04-25', '14:00:00', 90),
    (2, 120, 80, '2024-04-26', '10:00:00', 70),
    (4, 130, 85, '2024-04-27', '11:00:00', 75),
    (5, 140, 90, '2024-04-28', '12:00:00', 80),
    (8, 150, 95, '2024-04-29', '13:00:00', 85),
    (11, 160, 100, '2024-04-30', '14:00:00', 90),
    (2, 120, 80, '2024-05-01', '10:00:00', 70),
    (4, 130, 85, '2024-05-02', '11:00:00', 75),
    (5, 140, 90, '2024-05-03', '12:00:00', 80),
    (8, 150, 95, '2024-05-04', '13:00:00', 85),
    (11, 160, 100, '2024-05-05', '14:00:00', 90),
    (2, 120, 80, '2024-05-06', '10:00:00', 70),
    (4, 130, 85, '2024-05-07', '11:00:00', 75),
    (5, 140, 90, '2024-05-08', '12:00:00', 80),
    (8, 150, 95, '2024-05-09', '13:00:00', 85),
    (11, 160, 100, '2024-05-10', '14:00:00', 90),
    (2, 120, 80, '2024-05-11', '10:00:00', 70),
    (4, 130, 85, '2024-05-12', '11:00:00', 75),
    (5, 140, 90, '2024-05-13', '12:00:00', 80),
    (8, 150, 95, '2024-05-14', '13:00:00', 85),
    (11, 160, 100, '2024-05-15', '14:00:00', 90),
    (2, 120, 80, '2024-05-16', '10:00:00', 70),
    (4, 130, 85, '2024-05-17', '11:00:00', 75),
    (5, 140, 90, '2024-05-18', '12:00:00', 80),
    (8, 150, 95, '2024-05-19', '13:00:00', 85),
    (11, 160, 100, '2024-05-20', '14:00:00', 90),
    (2, 120, 80, '2024-05-21', '10:00:00', 70),
    (4, 130, 85, '2024-05-22', '11:00:00', 75),
    (5, 140, 90, '2024-05-23', '12:00:00', 80),
    (8, 150, 95, '2024-05-24', '13:00:00', 85),
    (11, 160, 100, '2024-05-25', '14:00:00', 90),
    (2, 120, 80, '2024-05-26', '10:00:00', 70),
    (4, 130, 85, '2024-05-27', '11:00:00', 75),
    (5, 140, 90, '2024-05-28', '12:00:00', 80),
    (8, 150, 95, '2024-05-29', '13:00:00', 85),
    (11, 160, 100, '2024-05-30', '14:00:00', 90);

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
