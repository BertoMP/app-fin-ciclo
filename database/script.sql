CREATE TABLE users
(
    email VARCHAR(255),
    password VARCHAR(255),
        CONSTRAINT pk_users PRIMARY KEY(email)
);

INSERT INTO users (email, password)
    VALUES ('admin@dominio.es', '$2a$12$pq8femq8aeUBs5LG1ECb/u/s.PlN5Eh8JwYVI7KReI64f3jeRoU6C');