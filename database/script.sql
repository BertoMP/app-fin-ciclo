CREATE TABLE tension (
	id			INT AUTO_INCREMENT,
    sistolica	INT,
    diastolica	INT,
    puls_min	INT,
    id_paciente	INT,
		CONSTRAINT pk_tension PRIMARY KEY(id),
        CONSTRAINT ck_tension CHECK(sistolica IS NOT NULL 
									AND diastolica IS NOT NULL 
                                    AND puls_min IS NOT NULL),
		CONSTRAINT fk_paciente_tension FOREIGN KEY(id_paciente) 
			REFERENCES paciente(id)
);

CREATE TABLE medicamento (
	id			INT AUTO_INCREMENT,
    nombre		VARCHAR(255),
    descripcion	TEXT,
		CONSTRAINT pk_medicamento PRIMARY KEY(id),
        CONSTRAINT uq_nombre UNIQUE(nombre),
        CONSTRAINT ck_medicamento CHECK(nombre IS NOT NULL 
										AND descripcion IS NOT NULL)
);

CREATE TABLE medicamento_paciente (
	id_medicamento	INT,
    id_paciente		INT,
    toma_diurna		INT,
    toma_vesper		INT,
    toma_nocturna	INT,
		CONSTRAINT pk_medicamento_paciente PRIMARY KEY(id_medicamento, id_paciente),
        CONSTRAINT fk_medicamento_paciente FOREIGN KEY(id_medicamento) 
			REFERENCES medicamento(id), 
		CONSTRAINT fk_paciente_medicamento FOREIGN KEY(id_paciente)
			REFERENCES paciente(id)
);

CREATE TABLE glucometria (
	id			INT AUTO_INCREMENT,
    medicion	INT,
    hora		DATETIME,
    id_paciente	INT,
		CONSTRAINT pk_glucometria PRIMARY KEY(id),
        CONSTRAINT ck_glucometria CHECK(medicion IS NOT NULL
										AND hora IS NOT NULL),
        CONSTRAINT fk_paciente FOREIGN KEY(id_paciente) REFERENCES paciente(id)
);

CREATE TABLE informe (
	id			INT AUTO_INCREMENT,
    descripcion	TEXT,
    id_cita		INT,
		CONSTRAINT pk_informe PRIMARY KEY(id),
        CONSTRAINT ck_informe CHECK(descripcion IS NOT NULL),
        CONSTRAINT fk_cita_informe FOREIGN KEY(id_cita) 
			REFERENCES cita(id)
);

CREATE TABLE especialidad (
	id			INT AUTO_INCREMENT,
    nombre		VARCHAR(255),
    descripcion	TEXT,
    imagen_path	VARCHAR(255),
		CONSTRAINT pk_especialidad PRIMARY KEY(id),
        CONSTRAINT uq_nombre UNIQUE(nombre),
        CONSTRAINT ck_especialidad CHECK(nombre IS NOT NULL
										 AND descripcion IS NOT NULL
										 AND imagen_path IS NOT NULL)
);

CREATE TABLE consulta (
	id				INT AUTO_INCREMENT,
    nombre_cabina	VARCHAR(255),
		CONSTRAINT pk_consulta PRIMARY KEY(id),
        CONSTRAINT uq_nombre_cabina UNIQUE(nombre_cabina),
        CONSTRAINT ck_nombre_canina CHECK(nombre_cabina REGEXP '^[1-9][0-9]?-[A-Z]$')
);

CREATE TABLE cita (
	id				INT AUTO_INCREMENT,
    fecha			DATE,
    hora			TIME,
    id_paciente		INT,
    id_especialista INT,
		CONSTRAINT pk_cita PRIMARY KEY(id),
        CONSTRAINT fk_cita_paciente FOREIGN KEY(id_paciente)
			REFERENCES paciente(id),
		CONSTRAINT fk_cita_especialista FOREIGN KEY(id_especialista)
			REFERENCES especialista(id)
);
