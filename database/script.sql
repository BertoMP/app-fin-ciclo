create table users {
    _id int auto_increment,
    name varchar(255),
    firstname varchar(255),
    lastname varchar(255),
    email varchar(255),
    password varchar(255),
    address varchar(255),
    phone varchar(255),
    mobile varchar(255),
    role int,

    constraint pk_users primary key (user_id),
    constraint fk_users_roles foreign key (user_role) references roles(role_id)
}

create table patients {
    id_patient int auto_increment,
    user_id int,

    constraint pk_patients primary key (id_patient),
    constraint fk_patients_users foreign key (user_id) references users(user_id)
}

create table doctors {
    id_doctor int auto_increment,
    user_id int,
    college_number varchar(255),
    specialty int,
    description varchar(255),

    constraint pk_doctors primary key (id_doctor),
    constraint fk_doctors_users foreign key (user_id) references users(user_id),
    constraint specialty foreign key (specialty) references specialties(specialty_id),
    constraint uc_doctors_college_number unique (college_number)
}

create table specialties {
    specialty_id int auto_increment,
    specialty_name varchar(255),
    specialty_description varchar(255),

    constraint pk_specialties primary key (specialty_id),
    constraint uc_specialties_name unique (specialty_name)
}

create table appointments {
    appointment_id int auto_increment,
    patient_id int,
    doctor_id int,
    date datetime

    constraint pk_appointments primary key (appointment_id),
    constraint fk_appointments_patients foreign key (patient_id) references patients(id_patient),
    constraint fk_appointments_doctors foreign key (doctor_id) references doctors(id_doctor),
}

create table roles {
    role_id int auto_increment,
    role_name varchar(255),

    constraint pk_roles primary key (role_id)
}