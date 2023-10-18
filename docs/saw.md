# SAW

El propósito de este documento es informar sobre como sirve el sistema de Incidentia.

# Indice

- [SAW](#saw)
- [Indice](#indice)
- [Introducción](#introducción)
  - [Usuario](#usuario)
    - [Usuarios de Aula](#usuarios-de-aula)
    - [Usuarios Nacionales](#usuarios-nacionales)
    - [Usuarios Ejecutivos](#usuarios-ejecutivos)
  - [Front end](#front-end)
  - [Back end](#back-end)
  - [DB](#db)
- [Diseño](#diseño)
  - [Arquitectura del sistema](#arquitectura-del-sistema)
  - [Como sirve una petición](#como-sirve-una-petición)

# Introducción

Incidentia esta separado en 4 diferentes areas:

- Usuario
- Front end
- Back end
- BD

Cada area procesa y se encarga de un dato especifico.

## Usuario

Es la persona que esta usando el sistema. Incidentia reconoce 3 tipos de usuarios:

1. Aula
2. Nacional 
3. Ejecutivo

### Usuarios de Aula

El rol de los usuarios de Aula es poder generar reportes y ver el seguimiento de sus reportes. 

Estos usuarios no cuentan con permisos para ver mas que sus propios reportes hechos, y agregar comentarios al propio.

### Usuarios Nacionales

El propósito de estos usuarios es administrar Aulas. Ellos son los que ven y actualizan los estatus de los reportes generados. 

A su vez, pueden ver todos los reportes generados

### Usuarios Ejecutivos

Estos usuarios son los que le pertenecen a roles administrativos. Pueden generar y ver los reportes que sean necesarios.

## Front end

Se le define front end a todo el software que interactué con el usuario. Cuanta con una interfaz visual. 

## Back end

El back end es lo que procesa los datos y genera lo necesario para poder presentar los datos de la forma deseada. no cuenta con interfaz visual.

## DB

La DB sobre la que Incidentia esta construida es MongoDB. Es el lugar donde se guardan todos los datos. El front end no cuenta con comunicación directa. 

# Diseño

Para Incidentia, se asume que la ejecución del sistema va a ser contenida en una sola instancia. Esta instancia comparte recursos con todos los documentos. En caso de requerir separar los recursos en varios servidores, es necesario cambiar la configuración de nginx. Sin embargo, el protocolo del backend sirve de forma independiente, haciendo la separación de nodos mas sencilla. 

## Arquitectura del sistema

El sistema Incidentia tiene 3 sistemas ejecutándose en paralelo, al igual que nginx, funcionando como el reverse proxy server.

El sistema de incidentia depende al 100% de cada uno de estos sitemas. 

Los sitemas se encuentran ordenados de la siguiente manera:

![Alt text](img/arquitectura-Sistemas.png)

> Nota: MongoDB se puede encontrar en un servidor externo, y se recomienda para un mejor funcionamiento.

El firewall no permite entradas de ningún lado a excepción de los puertos para http y conexiones a configurar la computadora.

Los servicios se descargan e instalan de github, usando el documento de configuración.

Para poder tener un funcionamiento mas rápido, se usa nginx como provedor de certificados ssl, permitiendo manejar el trafico de forma eficiente, y si se desea, permitir proveer archivos estáticos en un futuro.

## Como sirve una petición

Los pasos por los que pasa una petición son los siguientes:

![Alt text](<img/protocolo comms.png>)

Como se puede observar, una petición inicia en el usuario, donde interactúa con el sistema. A continuación es donde el sistema inicia a interactuar. El front end prepara la petición al backend en formato json, agregando los headers con con el token JWT (sesión) y manda la manda al back end.

El back end procede a pasar por el proceso de AAA (Autenticar, Autorizar y Acontar).