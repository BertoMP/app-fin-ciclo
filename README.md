# MediAPP

Este es un proyecto de fin de ciclo desarrollado por 
[Alberto Martínez Pérez](https://github.com/BertoMP)
y [Rafael Romero Roibu](https://github.com/romraf) utilizando las tecnologías
Angular 17 para el _frontend_, Node.js (v. 20.11.1) para el _backend_ 
y SQL para la base de datos.

Además, se han utilizado las siguientes librerías y herramientas:

- __Backend__: Express.js, bcrypt, jsonwebtoken, mysql2, nodemailer, nodemon, 
cors, dotenv, multer y express-validator.

El _frontend_ se encarga de la interfaz de usuario y la comunicación con el backend
a través de peticiones HTTP. El _backend_ se encarga de la lógica de negocio y de
la comunicación con la base de datos comportándose como una API REST.

El proyecto ha sido desarrollado en el marco del Ciclo Formativo de Grado Superior
de Desarrollo de Aplicaciones Web en el IES Luis Braille de Coslada (Madrid).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características principales](#características-principales)
- [Requisitos para Instalar y Ejecutar el Proyecto](#requisitos-para-instalar-y-ejecutar-el-proyecto)
  - [Cómo Instalar y Ejecutar el Proyecto](#cómo-instalar-y-ejecutar-el-proyecto)
- [Licencia](#licencia)

## Descripción

MediAPP se trata de una aplicación web de gestión de historiales clínicos
para pacientes y especialistas médicos. La aplicación está dividida en tres
roles: pacientes, especialistas y administradores. Cada uno de ellos tiene
diferentes funcionalidades y permisos en la aplicación.

El propósito principal de la aplicación es ayudar a los especialistas médicos 
a gestionar sus pacientes y sus historiales clínicos, así como para permitir a los
pacientes acceder a sus historiales clínicos y guardar un registro de las
mediciones de glucosa y tensión arterial que se realicen en su domicilio.

## Tecnologías Utilizadas

* ___Frontend___: ![Angular](https://img.shields.io/badge/-Angular-DD0031?style=flat&logo=angular) 
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3)
* ___Backend___: ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white) 
![Express.js](https://img.shields.io/badge/-Express.js-404D59?style=flat)
* ___Base de Datos___: ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

## Características principales

- __Pacientes__: Los pacientes pueden registrarse, iniciar sesión, 
restablecer su contraseña y actualizar su contraseña. Además pueden solicitar 
cita con los especialistas, ver su historial clínico y añadir mediciones de
glucosa y tensión arterial.
- __Especialistas__: Los especialistas pueden iniciar sesión, restablecer su
contraseña y actualizar su contraseña. Además pueden ver las citas que tienen
pendientes, ver los pacientes que tienen asignados y ver los historiales clínicos
de los pacientes.
- __Administradores__: Los administradores pueden iniciar sesión, restablecer su
contraseña y actualizar su contraseña. Además pueden ver los especialistas y
pacientes registrados en la aplicación, así como las especialidades médicas
que se encuentran disponibles. Pueden realizar tareas de administración de los
diferentes tipos de usuarios y de las especialidades médicas.

## Requisitos para Instalar y Ejecutar el Proyecto

Para ejecutar este proyecto, necesitarás tener instalado lo siguiente en tu máquina:

- __Node.js__: Es un entorno de ejecución para JavaScript construido con el motor 
de JavaScript V8 de Chrome. Puedes descargarlo [aquí](https://nodejs.org/es/download/).
- __NPM__: Es el administrador de paquetes por defecto para Node.js. 
Se instala junto con Node.js.
- __Angular CLI__: Es una herramienta de línea de comandos que te 
permite crear y gestionar aplicaciones Angular. Puedes instalarlo 
globalmente en tu máquina con el comando `npm install -g @angular/cli`.
- __MySQL__: Es un sistema de gestión de bases de datos relacional. Puedes 
descargarlo [aquí](https://dev.mysql.com/downloads/installer/).

Además, necesitarás tener una copia del código fuente. Puedes obtenerla clonando este repositorio de GitHub.

### Cómo Instalar y Ejecutar el Proyecto

1. Clona el repositorio a tu máquina local.
2. Abre MySQL Workbench y ejecuta el script `database.sql` del directorio
`/database` para crear la base de datos.
3. Una vez en el directorio principal, utilizar una terminal para navegar hasta el directorio del 
servidor: `cd ./server`.
4. Ejecuta `npm install` para instalar las dependencias del proyecto en el lado
del servidor.
5. Ejecuta `npm start` para iniciar el servidor.
6. Abre una nueva terminal en el directorio raíz y navega hasta el directorio 
del cliente: `cd ./client`.
7. Ejecuta `npm install` para instalar las dependencias del proyecto en el lado
del cliente.
8. Ejecuta `ng serve -o` para iniciar la aplicación.

## Licencia

Este proyecto está licenciado bajo los términos de la licencia GNU GPL.
