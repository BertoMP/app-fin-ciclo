# MediAPP

Este es un proyecto de fin de ciclo desarrollado por 
[Alberto Martínez Pérez](https://github.com/BertoMP)
y [Rafael Romero Roibu](https://github.com/romraf) utilizando las tecnologías
Angular 17.3.5 para el _frontend_, Node.js (v. 20.12.2) para el _backend_ 
y MySQL para la base de datos.

Nuestro _frontend_ se encarga de la interfaz de usuario y la comunicación con el 
_backend_ a través de peticiones HTTP. El _backend_ por su parte es el encargado 
de llevar a cabo toda la lógica de negocio así como la comunicación con la base 
de datos comportándose como una API REST.

El proyecto ha sido desarrollado en el marco del Ciclo Formativo de Grado Superior
de Desarrollo de Aplicaciones Web en el IES Luis Braille de Coslada (Madrid).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características principales](#características-principales)
  - [Paquetes y librerías utilizadas](#paquetes-y-librerías-utilizadas)
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

* ___Frontend___:  
![Angular](https://img.shields.io/badge/-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) 
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
* ___Plantillas___:  
![Handlebars](https://img.shields.io/badge/-Handlebars-F0772B?style=for-the-badge&logo=handlebars&logoColor=white)
* ___Estilos___:  
![Bootstrap](https://img.shields.io/badge/-Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![SCSS](https://img.shields.io/badge/-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
* ___Backend___:  
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) 
![Express.js](https://img.shields.io/badge/-Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
* ___Base de Datos___:  
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![PL/SQL](https://img.shields.io/badge/-PL/SQL-F80000?style=for-the-badge&logo=oracle&logoColor=white)
* ___Control de Versiones___:  
![Git](https://img.shields.io/badge/-Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
* ___Autenticación___:  
![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
* ___Documentación___:  
![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![JSDoc](https://img.shields.io/badge/-JSDoc-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  
### Paquetes y librerías utilizadas

__Frontend__:
- _@popperjs/core_: Librería que permite la gestión de _popovers_ y _tooltips_.
- _@types/file-saver_: Tipado de TypeScript para la librería FileSaver.
- _@auth0/angular-jwt_: Librería que permite la gestión de tokens JWT en Angular.
- _bootstrap_: Framework de CSS que permite la creación de interfaces web.
- _bootstrap-icons_: Librería que proporciona iconos de Bootstrap.
- _file-saver_: Librería que permite la descarga de archivos desde el navegador.
- _jquery_: Librería de JavaScript que permite la manipulación del DOM.
- _ngprime_: Librería de componentes de Angular.
- _ng-select2-component_: Componente de Angular que permite la integración de
la librería Select2 para la creación de elementos select con barra de búsqueda.
- _ngx-pagination_: Componente de Angular que permite la paginación de elementos.
- _sweetalert2_: Librería que permite la creación de alertas personalizadas.

__Backend__:
- _bcryptjs_: Librería cuya finalidad es el cifrado de contraseñas.
- _cors_: Middleware de Express.js que permite habilitar CORS 
(_Cross-Origin Resource Sharing_) con varias opciones.
- _date-fns_: Librería que permite trabajar con fechas en JavaScript.
- _dotenv_: Librería que permite cargar variables de entorno desde un 
archivo `.env`. 
- _express_: Framework de Node.js que permite crear aplicaciones web y APIs.
- _express-validator_: Middleware de Express.js que permite validar y limpiar
datos de entrada.
- _handlebars_: Motor de plantillas que permite la generación de HTML dinámico.
- _jsdoc_: Herramienta que permite la generación de documentación JSDoc.
- _jsonwebtoken_: Librería que permite la generación y verificación de tokens 
JWT.
- _moment-timezone_: Librería que permite trabajar con fechas y horas en diferentes
zonas horarias.
- _mysql2_: Librería que permite la conexión a bases de datos MySQL.
- _nodemailer_: Librería que permite enviar correos electrónicos desde Node.js.
- _puppeteer_: Librería que permite la generación de PDFs a partir de páginas web.
- _qrcode_: Librería que permite la generación de códigos QR.
- _swagger-jsdoc_: Librería que permite la generación de documentación Swagger.
- _swagger-ui-express_: Middleware de Express.js que permite la visualización de 
documentación Swagger en una interfaz de usuario.

## Características principales

- __Pacientes__: Los pacientes pueden registrarse, iniciar sesión, 
restablecer su contraseña y actualizar su contraseña. También pueden solicitar 
cita con los especialistas, ver su historial clínico y añadir mediciones de
glucosa y tensión arterial.
- __Especialistas__: Los especialistas pueden iniciar sesión, restablecer su
contraseña y actualizar su contraseña. Además, pueden ver las citas que tienen
pendientes, ver los pacientes que tienen asignados y ver los historiales clínicos
de los pacientes.
- __Administradores__: Los administradores pueden iniciar sesión, restablecer su
contraseña y actualizar su contraseña. Así mismo, pueden ver los especialistas y
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
2. Abre MySQL Workbench y ejecuta los diferentes scripts .sql del directorio
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

Este proyecto está licenciado bajo los términos de la licencia GNU GPLv3.
