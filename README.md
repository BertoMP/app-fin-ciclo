<p align="center" style="margin-bottom: 0;">
  <img src="frontend/src/assets/img/logo.svg" width="200">
</p>

<h1 align="center" style="margin-top: 0;">
  MediAPP
</h1>

Este es un proyecto de fin de ciclo desarrollado por [Alberto Martínez Pérez](https://github.com/BertoMP) y [Rafael Romero Roibu](https://github.com/romraf) utilizando las tecnologías
Angular 17.3.10 para el _frontend_, Node.JS 20.14 para el _backend_ y MySQL para la base de datos.

Nuestro _frontend_ se encarga de la interfaz de usuario y la comunicación con el _backend_ a través de peticiones HTTP. El _backend_ por su parte es el encargado 
de llevar a cabo toda la lógica de negocio así como la comunicación con la base de datos comportándose como una API REST.

El proyecto ha sido desarrollado en el marco del Ciclo Formativo de Grado Superior de Desarrollo de Aplicaciones Web en el IES Luis Braille de Coslada (Madrid).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características principales](#características-principales)
  - [Paquetes y librerías utilizadas](#paquetes-y-librerías-utilizadas)
- [Requisitos para Instalar y Ejecutar el Proyecto](#requisitos-para-instalar-y-ejecutar-el-proyecto)
  - [Cómo Instalar y Ejecutar el Proyecto](#cómo-instalar-y-ejecutar-el-proyecto)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Licencia](#licencia)

## Descripción

MediAPP se trata de una aplicación web de gestión de historiales clínicos para pacientes y especialistas médicos. La aplicación está dividida en tres
roles: pacientes, especialistas y administradores. Cada uno de ellos tiene diferentes funcionalidades y permisos en la aplicación.

El propósito principal de la aplicación es ayudar a los especialistas médicos a gestionar sus pacientes y sus historiales clínicos, así como para permitir a los
pacientes acceder a sus historiales clínicos y guardar un registro de las mediciones de glucosa y tensión arterial que se realicen en su domicilio.

## Tecnologías Utilizadas

<div align="center">

  | Tipo | Tecnologías |
  | :---: | :---: |
  | ___Frontend___ | ![Angular](https://img.shields.io/badge/-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) |
  | ___Plantillas___ | ![Handlebars](https://img.shields.io/badge/-Handlebars-F0772B?style=for-the-badge&logo=handlebars&logoColor=white) |
  | ___Estilos___ | ![Bootstrap](https://img.shields.io/badge/-Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) ![SCSS](https://img.shields.io/badge/-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white) |
  | ___Backend___ | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/-Express.js-404D59?style=for-the-badge&logo=express&logoColor=white) |
  | ___Base de Datos___ | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![PL/SQL](https://img.shields.io/badge/-PL/SQL-F80000?style=for-the-badge&logo=oracle&logoColor=white) |
  | ___Control de Versiones___ | ![Git](https://img.shields.io/badge/-Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white) |
  | ___Autenticación___ | ![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) |
  | ___Documentación___ | ![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) ![JSDoc](https://img.shields.io/badge/-JSDoc-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
  | ___Pruebas___ | ![Supertest](https://img.shields.io/badge/-Supertest-009688?style=for-the-badge&logo=node.js&logoColor=white) ![Chai](https://img.shields.io/badge/-Chai-A30701?style=for-the-badge&logo=chai&logoColor=white) ![Mocha](https://img.shields.io/badge/-Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white) |

</div>
  
### Paquetes y librerías utilizadas

__Frontend__:
- _@popperjs/core_: Librería que permite la gestión de _popovers_ y _tooltips_.
- _@types/file-saver_: Tipado de TypeScript para la librería FileSaver.
- _@auth0/angular-jwt_: Librería que permite la gestión de tokens JWT en Angular.
- _bootstrap_: Framework de CSS que permite la creación de interfaces web.
- _bootstrap-icons_: Librería que proporciona iconos de Bootstrap.
- _file-saver_: Librería que permite la descarga de archivos desde el navegador.
- _jquery_: Librería de JavaScript que permite la manipulación del DOM.
- _ng-bootstrap_: Librería que permite la integración de Bootstrap en Angular.
- _ng-select2-component_: Componente de Angular que permite la integración de la librería Select2 para la creación de elementos select con barra de búsqueda.
- _ngx-pagination_: Componente de Angular que permite la paginación de elementos.
- _ngx-quill_: Componente de Angular que permite la integración del editor de texto Quill.
- _sweetalert2_: Librería que permite la creación de alertas personalizadas.

__Backend__:
- _bcryptjs_: Librería cuya finalidad es el cifrado de contraseñas.
- _chai_: Framework de aserciones que permite realizar pruebas unitarias.
- _cors_: Middleware de Express.js que permite habilitar CORS 
(_Cross-Origin Resource Sharing_) con varias opciones.
- _date-fns_: Librería que permite trabajar con fechas en JavaScript.
- _dotenv_: Librería que permite cargar variables de entorno desde un archivo `.env`. 
- _express_: Framework de Node.js que permite crear aplicaciones web y APIs.
- _express-validator_: Middleware de Express.js que permite validar y limpiar datos de entrada.
- _handlebars_: Motor de plantillas que permite la generación de HTML dinámico.
- _html-sanitizer_: Librería que permite la limpieza de código HTML.
- _jsdoc_: Herramienta que permite la generación de documentación JSDoc.
- _jsonwebtoken_: Librería que permite la generación y verificación de tokens JWT.
- _mocha_: Framework de pruebas para Node.js.
- _moment-timezone_: Librería que permite trabajar con fechas y horas en diferentes zonas horarias.
- _morgan_: Middleware de Express.js que permite la generación de logs de peticiones HTTP.
- _mysql2_: Librería que permite la conexión a bases de datos MySQL.
- _nodemailer_: Librería que permite enviar correos electrónicos desde Node.js.
- _puppeteer_: Librería que permite la generación de PDFs a partir de páginas web.
- _qrcode_: Librería que permite la generación de códigos QR.
- _rotating-file-stream_: Librería que permite la rotación de archivos de logs.
- _supertest_: Librería que permite realizar pruebas de integración en Node.js.
- _swagger-jsdoc_: Librería que permite la generación de documentación Swagger.
- _swagger-ui-express_: Middleware de Express.js que permite la visualización de documentación Swagger en una interfaz de usuario.

## Características principales

- __Pacientes__: Los pacientes pueden registrarse, iniciar sesión, restablecer su contraseña y actualizar su contraseña. También pueden solicitar 
cita con los especialistas, ver su historial clínico y añadir mediciones de glucosa y tensión arterial.
- __Especialistas__: Los especialistas pueden iniciar sesión, restablecer su contraseña y actualizar su contraseña. Además, pueden ver las citas que tienen
pendientes, ver los pacientes que tienen asignados y ver los historiales clínicos de los pacientes.
- __Administradores__: Los administradores pueden iniciar sesión, restablecer su contraseña y actualizar su contraseña. Así mismo, pueden ver los especialistas y
pacientes registrados en la aplicación, así como las especialidades médicas que se encuentran disponibles. Pueden realizar tareas de administración de los
diferentes tipos de usuarios y de las especialidades médicas.

## Requisitos para Instalar y Ejecutar el Proyecto

Para ejecutar este proyecto, necesitarás tener instalado lo siguiente en tu máquina:

- __Node.js__: Es un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome. Puedes descargarlo [aquí](https://nodejs.org/es/download/).
- __NPM__: Es el administrador de paquetes por defecto para Node.js. Se instala junto con Node.js.
- __Angular CLI__: Es una herramienta de línea de comandos que te permite crear y gestionar aplicaciones Angular. Puedes instalarlo globalmente en tu máquina con el comando:  

      npm install -g @angular/cli

- __MySQL__: Es un sistema de gestión de bases de datos relacional. Puedes descargarlo [aquí](https://dev.mysql.com/downloads/installer/).

Además, necesitarás tener una copia del código fuente. Puedes obtenerla clonando este repositorio de GitHub.

### Cómo Instalar y Ejecutar el Proyecto

1. Clona el repositorio a tu máquina local.

       git clone https://github.com/BertoMP/mediapp.git
   
2. Abre MySQL Workbench y ejecuta los diferentes scripts .sql del directorio
`/database` para crear la base de datos.
3. Una vez en el directorio principal, utilizar una terminal para navegar hasta el directorio del 
servidor:

       cd ./server

4. Para instalar las dependencias del proyecto en el lado del servidor ejecuta.

       npm install

5. A continuación iniciar el servidor en modo producción.

       npm run start

6. Abre una nueva terminal en el directorio raíz y navega hasta el directorio 
del cliente:

       cd ./frontend

7. Para instalar las dependencias del proyecto en el lado del cliente.

       npm install

8. Ejecuta el servidor del cliente para iniciar la aplicación.

       ng serve --port 4200

   **Advertencia**: En caso de utilizar otro puerto para el servidor del cliente, el servidor del
   backend no podrá comunicarse con el cliente ya que ocurrirá un error de CORS. Para solucionar
   este problema, se debe modificar el archivo `.env` en el directorio `server` y cambiar la 
   configuración de CORS para que permita comunicación el puerto de tu elección.

9. Abre un navegador web y navega a `http://localhost:4200/` para ver la aplicación.
10. Para acceder a la documentación Swagger UI de la API REST, navega a `http://localhost:3000/api-docs`.
11. Para acceder a la documentación JSDoc, navega a `http://localhost:3000/docs`.

## Capturas de pantalla
<div align="center">
  <table align="center">
    <tr>
      <td>
        <img src="./screenshots/especialidades.png" width="200"/>
        <p>Especialidades Médicas</p>
      </td>
      <td>
        <img src="./screenshots/login.png" width="200"/>
        <p>Pantalla de Inicio de Sesión</p>
      </td>
      <td>
        <img src="./screenshots/listado-usuarios.png" width="200"/>
        <p>Listado de Usuarios Registrados</p>
      </td>
    </tr>
    <tr>
      <td>
        <img src="./screenshots/toma-tension.png" width="200"/>
        <p>Proceso de Toma de Tensión Arterial</p>
      </td>
      <td>
        <img src="./screenshots/listado-citas.png" width="200"/>
        <p>Listado de Citas Médicas</p>
      </td>
      <td>
        <img src="./screenshots/listado-glucometrias.png" width="200"/>
        <p>Listado de Resultados de Glucometrías</p>
      </td>
    </tr>
    <tr>
      <td>
        <img src="./screenshots/modal.png" width="200"/>
        <p>Ejemplo de Ventana Modal</p>
      </td>
      <td>
        <img src="./screenshots/asignacion_toma.png" width="200"/>
        <p>Ejemplo de asignación de toma a paciente</p>
      </td>
      <td>
        <img src="./screenshots/chatbot.png" width="200"/>
        <p>Ejemplo vista chatbot</p>
      </td>
    </tr>
    <tr>
      <td>
        <img src="./screenshots/listado_logs.png" width="200"/>
        <p>Vista de logs de errores</p>
      </td>
      <td>
        <img src="./screenshots/swagger.png" width="200"/>
        <p>Documentación de API con Swagger</p>
      </td>
      <td>
        <img src="./screenshots/jsdoc.png" width="200"/>
        <p>Documentación de Código con JSDoc</p>
      </td>
    </tr>
  </table>
</div>

## Licencia

Este proyecto está licenciado bajo los términos de la licencia GNU GPLv3.

## Versiones

- [v1.0.0](https://github.com/BertoMP/mediapp/releases/tag/v1.0.0): Versión inicial del proyecto.
