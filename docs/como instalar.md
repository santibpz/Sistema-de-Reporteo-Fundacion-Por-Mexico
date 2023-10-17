# Como instalar Incidentia en ambiente de producción

# Indice

- [Como instalar Incidentia en ambiente de producción](#como-instalar-incidentia-en-ambiente-de-producción)
- [Indice](#indice)
- [Requisitos previos:](#requisitos-previos)
- [Pasos para instalar](#pasos-para-instalar)
- [Que se acaba de instalar?](#que-se-acaba-de-instalar)


# Requisitos previos:

- Tener un servidor de Ubuntu 22.04 LTS actualizado
- Tener conocimiento del dominio o ip del servidor
- Tener accesos a la terminal
- Una instancia de MongoDB Atlas o mongodb externa. 

# Pasos para instalar

1. Acceder a la terminal del servidor
2. Correr `git clone https://github.com/santibpz/Sistema-de-Reporteo-Fundacion-Por-Mexico.git`
3. Correr `mv Sistema-de-Reporteo-Fundacion-Por-Mexico Incidentia`
4. Correr `cd Incidentia`
5. Correr `sudo ./install.sh`
6. Responder a las preguntas que se otorguen.
7. Al finalizar, se debe de ver `Server is up and running and seems to be configured correctly.` 

para hacerlo de un jalón:
```
git clone https://github.com/santibpz/Sistema-de-Reporteo-Fundacion-Por-Mexico.git
mv Sistema-de-Reporteo-Fundacion-Por-Mexico Incidentia
cd Incidentia
sudo ./install.sh
```

Al terminar estos pasos, el servidor debería de estar corriendo. 
En caso de necesitar volver a correr el sistema, quitar los `screen` llamados `front` y `back`. Correr `./start.sh` (sin sudo).

# Que se acaba de instalar?

Al correr `git clone` estas descargando el repositorio.

Seguido, estas renombrando el nombre largo del repositorio a: `Incidentia`

Estas entrando al folder y corriendo el instalador.

El instalador va a hacer lo siguiente:

- Instalar las dependencias necesarias
- Crear los archivos de ambiente
- Iniciar y configurar Nginx
- Iniciar los servicios
- Probar los servicios. 

> NOTA: el instalador también configura el firewall... Asegúrate de que estés usando ssh antes de correrlo. 

Al finalizar vas a contar con la siguiente infraestructura. A excepción de mongoDB.

![Alt text](img/arquitectura-Sistemas.png)