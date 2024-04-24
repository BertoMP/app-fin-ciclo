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
DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS tipo_via;
DROP TABLE IF EXISTS codigo_postal_municipio;
DROP TABLE IF EXISTS codigo_postal;
DROP TABLE IF EXISTS municipio;
DROP TABLE IF EXISTS provincia;
DROP TABLE IF EXISTS patologia;
DROP TABLE IF EXISTS informe_patologia;
DROP TABLE IF EXISTS paciente_medicamento_toma;
DROP TABLE IF EXISTS toma;

-- Eliminación de los eventos si existen
DROP EVENT IF EXISTS limpiar_tabla_tokens;

-- Creación de las tablas
-- Tabla provincia
CREATE TABLE provincia (
	id		INT AUTO_INCREMENT,
    nombre	VARCHAR(255),
        CONSTRAINT uq_provincia_nombre
            UNIQUE (nombre),
		CONSTRAINT pk_provincia
			PRIMARY KEY (id)
);

-- Tabla municipio
CREATE TABLE municipio (
    provincia_id	INT,
    id				VARCHAR(255),
    nombre			VARCHAR(255),
		CONSTRAINT pk_municipio
			PRIMARY KEY (id),
		CONSTRAINT fk_municipio_provincia
			FOREIGN KEY (provincia_id) 
            REFERENCES provincia (id)
);

-- Tabla codigo_postal
CREATE TABLE codigo_postal (
	codigo_postal	VARCHAR(255),
		CONSTRAINT pk_codigo_postal
			PRIMARY KEY (codigo_postal)
);

-- Tabla codigo_postal_municipio
CREATE TABLE codigo_postal_municipio (
	codigo_postal_id	VARCHAR(255),
    municipio_id		VARCHAR(255),
		CONSTRAINT pk_codigo_postal_municipio
			PRIMARY KEY (codigo_postal_id, municipio_id),
		CONSTRAINT fk_codigo_postal
			FOREIGN KEY (codigo_postal_id)
            REFERENCES codigo_postal (codigo_postal),
		CONSTRAINT fk_municipio
			FOREIGN KEY (municipio_id)
            REFERENCES municipio (id)
);

-- Tabla tipo_via
CREATE TABLE tipo_via (
    id		INT AUTO_INCREMENT,
    nombre	VARCHAR(255),
        CONSTRAINT uq_tipo_via_nombre
            UNIQUE (nombre),
        CONSTRAINT pk_tipo_via
            PRIMARY KEY (id)
);

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
    refresh_token		VARCHAR(255),
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

-- Tabla Tokens
CREATE TABLE token (
    id          INT AUTO_INCREMENT,
    reset_token VARCHAR(255),
    usuario_id  INT,
        CONSTRAINT pk_tokens
            PRIMARY KEY (id),
        CONSTRAINT fk_tokens_usuario
            FOREIGN KEY (usuario_id)
            REFERENCES usuario (id)
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
    usuario_id      INT,
    num_colegiado   VARCHAR(255),
    descripcion     TEXT,
    imagen          VARCHAR(255),
    turno           VARCHAR(255),
    especialidad_id INT,
    consulta_id     INT,
        CONSTRAINT pk_especialista
            PRIMARY KEY (usuario_id),
        CONSTRAINT uq_especialista_num_colegiado
            UNIQUE (num_colegiado),
        CONSTRAINT ck_especialista_null
            CHECK (num_colegiado IS NOT NULL AND
                   descripcion IS NOT NULL AND
                   imagen IS NOT NULL),
        CONSTRAINT fk_especialista_usuario
            FOREIGN KEY (usuario_id)
            REFERENCES usuario (id),
        CONSTRAINT ck_especialista_turno
            CHECK (turno IN ('diurno', 'vespertino', 'no-trabajando')),
        CONSTRAINT fk_especialista_especialidad
            FOREIGN KEY (especialidad_id)
            REFERENCES especialidad (id),
        CONSTRAINT fk_especialista_consulta
            FOREIGN KEY (consulta_id)
            REFERENCES consulta (id)
);

-- Tabla paciente
CREATE TABLE paciente (
    usuario_id              INT,
    num_historia_clinica    VARCHAR(255),
    fecha_nacimiento        DATE,
    tipo_via                INT,
    nombre_via              VARCHAR(255),
    numero                  INT,
    piso                    INT,
    puerta                  VARCHAR(255),
    municipio               VARCHAR(255),
    codigo_postal           VARCHAR(255),
    tel_fijo                INT,
    tel_movil               INT,
        CONSTRAINT pk_paciente
            PRIMARY KEY (usuario_id),
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
                   municipio IS NOT NULL AND
                   codigo_postal IS NOT NULL AND
                   tel_fijo IS NOT NULL AND
                   tel_movil IS NOT NULL),
		CONSTRAINT ck_paciente_codigo_postal
			CHECK (codigo_postal REGEXP '^[0-9]{5}$'),
        CONSTRAINT ck_paciente_tel_fijo
            CHECK (tel_fijo REGEXP '^(\\+34|0034|34)?-?9[0-9]{8}$'),
        CONSTRAINT ck_paciente_tel_movil
            CHECK (tel_movil REGEXP '^(\\+34|0034|34)?-?[67][0-9]{8}$'),
        CONSTRAINT fk_paciente_tipo_via
            FOREIGN KEY (tipo_via)
            REFERENCES tipo_via (id),
        CONSTRAINT fk_paciente_municipio
            FOREIGN KEY (municipio)
            REFERENCES municipio (id),
		CONSTRAINT fk_paciente_codigo_postal
			FOREIGN KEY (codigo_postal)
            REFERENCES codigo_postal (codigo_postal),
        CONSTRAINT fk_paciente_usuario
            FOREIGN KEY (usuario_id)
            REFERENCES usuario (id)
);

-- Tabla informe
CREATE TABLE informe (
    id          INT AUTO_INCREMENT,
    motivo      VARCHAR(255),
    contenido   TEXT,
        CONSTRAINT pk_informe
            PRIMARY KEY (id),
        CONSTRAINT ck_informe_null
            CHECK (motivo IS NOT NULL AND
                   contenido IS NOT NULL)
);

-- Tabla patologia
CREATE TABLE patologia (
    id          INT AUTO_INCREMENT,
    nombre      VARCHAR(255),
    descripcion TEXT,
        CONSTRAINT pk_patologia
            PRIMARY KEY (id),
        CONSTRAINT uq_patologia_nombre
            UNIQUE (nombre),
        CONSTRAINT ck_patologia_null
            CHECK (nombre IS NOT NULL AND
                   descripcion IS NOT NULL)
);

-- Tabla informe_patologia
CREATE TABLE informe_patologia (
    informe_id      INT,
    patologia_id    INT,
        CONSTRAINT pk_informe_patologia
            PRIMARY KEY (informe_id, patologia_id),
        CONSTRAINT fk_informe_patologia_informe
            FOREIGN KEY (informe_id)
            REFERENCES informe (id),
        CONSTRAINT fk_informe_patologia_patologia
            FOREIGN KEY (patologia_id)
            REFERENCES patologia (id)
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
            REFERENCES especialista (usuario_id),
        CONSTRAINT fk_cita_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (usuario_id),
        CONSTRAINT fk_cita_informe
            FOREIGN KEY (informe_id)
            REFERENCES informe (id)
);

-- Tabla tension_arterial
CREATE TABLE tension_arterial (
    paciente_id         INT,
    fecha               DATE,
    hora                TIME,
    sistolica           INT,
    diastolica          INT,
    pulsaciones_minuto  INT,
        CONSTRAINT pk_tension_arterial
            PRIMARY KEY (paciente_id, fecha, hora),
        CONSTRAINT ck_tension_arterial_null
            CHECK (sistolica IS NOT NULL AND
                   diastolica IS NOT NULL AND
                   pulsaciones_minuto IS NOT NULL),
        CONSTRAINT fk_tension_arterial_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (usuario_id)
);

-- Tabla glucometria
CREATE TABLE glucometria (
    paciente_id INT,
    fecha       DATE,
    hora        TIME,
    medicion    INT,
        CONSTRAINT pk_glucometria
            PRIMARY KEY (paciente_id, fecha, hora),
        CONSTRAINT ck_glucometria_null
            CHECK (medicion IS NOT NULL),
        CONSTRAINT fk_glucometria_paciente
            FOREIGN KEY (paciente_id)
            REFERENCES paciente (usuario_id)
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

-- Tabla toma
CREATE TABLE toma (
	id			INT AUTO_INCREMENT,
    hora		DATETIME,
    dosis		INT,
		CONSTRAINT pk_toma
			PRIMARY KEY (id)
);

-- Tabla paciente_medicamento_toma
CREATE TABLE paciente_medicamento_toma (
	paciente_id		INT,
    medicamento_id	INT,
    toma_id			INT,
		CONSTRAINT pk_paciente_medicamento_toma
			PRIMARY KEY (paciente_id, medicamento_id, toma_id),
		CONSTRAINT fk_paciente_medicamento_tom
			FOREIGN KEY (paciente_id)
            REFERENCES paciente (usuario_id),
        CONSTRAINT fk_medicamento_toma
            FOREIGN KEY (medicamento_id)
            REFERENCES medicamento (id),
        CONSTRAINT fk_toma
            FOREIGN KEY (toma_id)
            REFERENCES toma (id)
);