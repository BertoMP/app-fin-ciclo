-- Creación de la base de datos si no existe
CREATE DATABASE IF NOT EXISTS clinica;

-- Selección de la base de datos
USE clinica;

-- Eliminación de las tablas si existen
DROP TABLE IF EXISTS tension_arterial;
DROP TABLE IF EXISTS glucometria;
DROP TABLE IF EXISTS paciente_medicamento;
DROP TABLE IF EXISTS medicamento;
DROP TABLE IF EXISTS cita;
DROP TABLE IF EXISTS informe;
DROP TABLE IF EXISTS especialista;
DROP TABLE IF EXISTS especialidad;
DROP TABLE IF EXISTS consulta;
DROP TABLE IF EXISTS paciente;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;

-- Creación de las tablas
-- Tabla rol
CREATE TABLE rol (
    id      INT AUTO_INCREMENT,
    nombre  VARCHAR(255),
        CONSTRAINT pk_rol
            PRIMARY KEY (id),
        CONSTRAINT uq_rol_nombre
            UNIQUE (nombre),
        CONSTRAINT ck_rol_nombre
            CHECK (nombre IN ('admin', 'paciente', 'especialista')),
        CONSTRAINT ck_rol_null
            CHECK (nombre IS NOT NULL)
);

-- Tabla usuario
CREATE TABLE usuario (
    id                  INT AUTO_INCREMENT,
    email               VARCHAR(255),
    password            VARCHAR(255),
    nombre              VARCHAR(255),
    primer_apellido     VARCHAR(255),
    segundo_apellido    VARCHAR(255),
    dni                 VARCHAR(9),
    rol_id              INT,
        CONSTRAINT pk_usuario
            PRIMARY KEY (id),
        CONSTRAINT uq_usuario_email
            UNIQUE (email),
        CONSTRAINT uq_usuario_dni
            UNIQUE (dni),
        CONSTRAINT ck_usuario_null
            CHECK (email IS NOT NULL AND
                   password IS NOT NULL AND
                   nombre IS NOT NULL AND
                   primer_apellido IS NOT NULL AND
                   segundo_apellido IS NOT NULL AND
                   dni IS NOT NULL),
        CONSTRAINT ck_usuario_email
            CHECK (email LIKE '%@%'),
        CONSTRAINT ck_usuario_dni
            CHECK (dni REGEXP '^[0-9]{8}[A-Z]$'),
        CONSTRAINT fk_usuario_rol
            FOREIGN KEY (rol_id)
            REFERENCES rol (id)
);

-- Tabla especialidad
CREATE TABLE especialidad (
    id          INT AUTO_INCREMENT,
    nombre      VARCHAR(255),
    descripcion TEXT,
    imagen      VARCHAR(255),
        CONSTRAINT pk_especialidad
            PRIMARY KEY (id),
        CONSTRAINT uq_especialidad_nombre
            UNIQUE (nombre),
        CONSTRAINT up_especialidad_imagen
            UNIQUE (imagen),
        CONSTRAINT ck_especialidad_null
            CHECK (nombre IS NOT NULL AND
                   descripcion IS NOT NULL AND
                   imagen IS NOT NULL)
);

-- Tabla consulta
CREATE TABLE consulta (
    id      INT AUTO_INCREMENT,
    nombre  VARCHAR(255),
        CONSTRAINT pk_consulta
            PRIMARY KEY (id),
        CONSTRAINT uq_consulta_nombre
            UNIQUE (nombre),
        CONSTRAINT ck_consulta_nombre
            CHECK (nombre REGEXP '^[1-9][0-9]?-[A-Z]$'),
        CONSTRAINT ck_consulta_null
            CHECK (nombre IS NOT NULL)
);

-- Tabla especialista
CREATE TABLE especialista (
    id              INT AUTO_INCREMENT,
    num_colegiado   VARCHAR(255),
    descripcion     TEXT,
    imagen          VARCHAR(255),
    turno           VARCHAR(255),
    especialidad_id INT,
    consulta_id     INT,
        CONSTRAINT pk_especialista
            PRIMARY KEY (id),
        CONSTRAINT uq_especialista_num_colegiado
            UNIQUE (num_colegiado),
        CONSTRAINT ck_especialista_null
            CHECK (num_colegiado IS NOT NULL AND
                   descripcion IS NOT NULL AND
                   imagen IS NOT NULL),
        CONSTRAINT fk_especialista_usuario
            FOREIGN KEY (id)
            REFERENCES usuario (id),
        CONSTRAINT ck_especialista_turno
            CHECK (turno IN ('diurno', 'vespertino')),
        CONSTRAINT fk_especialista_especialidad
            FOREIGN KEY (especialidad_id)
            REFERENCES especialidad (id),
        CONSTRAINT fk_especialista_consulta
            FOREIGN KEY (consulta_id)
            REFERENCES consulta (id)
);

-- Tabla paciente
CREATE TABLE paciente (
    id                      INT AUTO_INCREMENT,
    num_historia_clinica    VARCHAR(255),
    fecha_nacimiento        DATE,
    tipo_via                VARCHAR(255),
    nombre_via              VARCHAR(255),
    numero                  INT,
    piso                    INT,
    puerta                  VARCHAR(255),
    provincia               VARCHAR(255),
    municipio               VARCHAR(255),
    codigo_postal           INT,
    tel_fijo                INT,
    tel_movil               INT,
        CONSTRAINT pk_paciente
            PRIMARY KEY (id),
        CONSTRAINT uq_paciente_num_historia_clinica
            UNIQUE (num_historia_clinica),
        CONSTRAINT ck_paciente_null
            CHECK (num_historia_clinica IS NOT NULL AND
                   fecha_nacimiento IS NOT NULL AND
                   tipo_via IS NOT NULL AND
                   nombre_via IS NOT NULL AND
                   numero IS NOT NULL AND
                   piso IS NOT NULL AND
                   puerta IS NOT NULL AND
                   provincia IS NOT NULL AND
                   municipio IS NOT NULL AND
                   codigo_postal IS NOT NULL AND
                   tel_fijo IS NOT NULL AND
                   tel_movil IS NOT NULL),
        CONSTRAINT ck_paciente_codigo_postal
            CHECK (codigo_postal BETWEEN 10000 AND 99999),
        CONSTRAINT ck_paciente_tel_fijo
            CHECK (tel_fijo REGEXP '^((+34|0034|34)-)?9[0-9]{8}$'),
        CONSTRAINT ck_paciente_tel_movil
            CHECK (tel_movil REGEXP '^((+34|0034|34)-)?[67][0-9]{8}$'),
        CONSTRAINT fk_paciente_usuario
            FOREIGN KEY (id)
            REFERENCES usuario (id)
);

-- Tabla informe
CREATE TABLE informe (
    id          INT AUTO_INCREMENT,
    contenido   TEXT,
        CONSTRAINT pk_informe
            PRIMARY KEY (id),
        CONSTRAINT ck_informe_null
            CHECK (contenido IS NOT NULL)
);

-- Tabla cita
CREATE TABLE cita (
    id              INT AUTO_INCREMENT,
    fecha           DATE,
    hora            TIME,
    especialista_id INT,
    paciente_id     INT,
    informe_id      INT,
        CONSTRAINT pk_cita
            PRIMARY KEY (id),
        CONSTRAINT uq_cita_hora_fecha_paciente
            UNIQUE (fecha, hora, paciente_id),
        CONSTRAINT uq_cita_hora_fecha_especialista
            UNIQUE (fecha, hora, especialista_id),
        CONSTRAINT ck_cita_hora
            CHECK (hora BETWEEN '08:00:00' AND '22:00:00'),
        CONSTRAINT ck_cita_null
            CHECK (fecha IS NOT NULL AND hora IS NOT NULL),
        CONSTRAINT ck_cita_hora_format
            CHECK (hora REGEXP '^[0-9]{2}:(00|30):[0-9]{2}$'),
        CONSTRAINT fk_cita_especialista
            FOREIGN KEY (especialista_id)
            REFERENCES especialista (id),
        CONSTRAINT fk_cita_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (id),
        CONSTRAINT fk_cita_informe
            FOREIGN KEY (informe_id)
            REFERENCES informe (id)
);

-- Tabla tension_arterial
CREATE TABLE tension_arterial (
    id                  INT AUTO_INCREMENT,
    sistolica           INT,
    diastolica          INT,
    pulsaciones_minuto  INT,
    fecha               DATE,
    hora                TIME,
    paciente_id         INT,
        CONSTRAINT pk_tension_arterial
            PRIMARY KEY (id),
        CONSTRAINT ck_tension_arterial_null
            CHECK (sistolica IS NOT NULL AND
                   diastolica IS NOT NULL AND
                   fecha IS NOT NULL AND
                   hora IS NOT NULL AND
                   pulsaciones_minuto IS NOT NULL),
        CONSTRAINT fk_tension_arterial_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (id)
);

-- Tabla glucometria
CREATE TABLE glucometria (
    id          INT AUTO_INCREMENT,
    medicion    INT,
    fecha       DATE,
    hora        TIME,
    paciente_id INT,
        CONSTRAINT pk_glucometria
            PRIMARY KEY (id),
        CONSTRAINT ck_glucometria_null
            CHECK (medicion IS NOT NULL AND
                   fecha IS NOT NULL AND
                   hora IS NOT NULL),
        CONSTRAINT fk_glucometria_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (id)
);

-- Tabla medicamento
CREATE TABLE medicamento (
    id          INT AUTO_INCREMENT,
    nombre      VARCHAR(255),
    descripcion TEXT,
        CONSTRAINT pk_medicamento
            PRIMARY KEY (id),
        CONSTRAINT uq_medicamento_nombre
            UNIQUE (nombre),
        CONSTRAINT ck_medicamento_null
            CHECK (nombre IS NOT NULL AND
                   descripcion IS NOT NULL)
);

-- Tabla paciente_medicamento
CREATE TABLE paciente_medicamento (
    paciente_id     INT,
    medicamento_id  INT,
    toma_diurna     INT,
    toma_vespertina INT,
    toma_nocturna   INT,
        CONSTRAINT pk_paciente_medicamento
            PRIMARY KEY (paciente_id, medicamento_id),
        CONSTRAINT ck_paciente_medicamento_null
            CHECK (toma_diurna IS NOT NULL AND
                   toma_vespertina IS NOT NULL AND
                   toma_nocturna IS NOT NULL),
        CONSTRAINT fk_paciente_medicamento_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (id),
        CONSTRAINT fk_paciente_medicamento_medicamento
            FOREIGN KEY (medicamento_id)
            REFERENCES medicamento (id)
);

-- Inserción de los datos de la tabla rol
INSERT INTO rol (nombre)
    VALUES  ('admin'),
            ('paciente'),
            ('especialista');

-- Inserción de datos dummy en la tabla usuario
INSERT INTO usuario (email, password, nombre, primer_apellido, segundo_apellido, dni, rol_id)
    VALUES  ('admin@admin.es', '$2y$10$kgYGNms6J4PhRa/VxbKUKeI24/Vo5pLgsOsQVRu93c.T.VWh5sLzO', 'Admin', 'Admin', 'Admin', '12345678Z', 1),
            ('paciente@paciente.es', '$2y$10$nK1i6y.2ThrH6AJrIrsGwemc4DYnYzkigw3dkbEoNalXfwslcV1/.', 'Paciente', 'Paciente', 'Paciente', '22345678Z', 2),
            ('especialista@especialista.es', '$2y$10$jxxv3w.KONPRfOVtu2ICbOLNwPqaEhEwuPWhcHS5u.nuxPKbiY9zm', 'Especialista', 'Especialista', 'Especialista', '32345678Z', 3);