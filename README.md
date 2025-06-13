Este proyecto fue realizado por 

Maria Alejandra Angulo: [Github](https://github.com/marialeang2)

Juan Diego Lozano: [Github](https://github.com/juanlozano3)

Francois Morales: [Github](https://github.com/francoismorales)

Laura Murcia: [Github](https://github.com/lauram354)

Marco Ramirez: [Github](https://github.com/LilMark0o)

# How to start the repo

Run in your terminal:

rm -rf node_modules package-lock.json

npm cache clean --force

npm install typescript@4.9.5 --save-dev --force

# Notas adicionale
Nuestra aplicación está diseñada para dos tipos de perfiles: usuarios estándar y empresas. Se debe crear una cuenta de Individual  y otra de Fundación para poder las funcionalidades de ambos roles

# Correr el back

La información completa se encuentra en el README del [Repositorio Back](https://github.com/marialeang2/Donaccion-Back) 

# Poblar base de datos

Para poblar la base de datos con datos falsos de prueba, sigue estos pasos:

1. Asegúrate de tener Python instalado.
2. Instala la librería [`faker`](https://pypi.org/project/Faker/):
3. Ve a la carpeta testZonePython dentro del proyecto
4. Ejecuta el script populateDB.py
```bash 
   pip install faker 
   cd testZonePython 
   python populateDB.py
```
   


# Como comprobar los permisos de los usuarios

Debe importarse a postman la colección del proyecto del back llamada AdminsPostman.json

A continuación se demuestra como probar los diferentes permisos de usuario en el back. Asimismo se dan instrucciones de como acceder a la variable foundation_id



https://github.com/user-attachments/assets/bf235afe-2338-4164-ad27-8e6e91830caf



En este caso se utiliza una fundación de prueba, cuyo id se obtiene de abrir Pgadmin, y generar un select para elegir cualquiera de los id disponibles



https://github.com/user-attachments/assets/c2c9e043-c25d-4411-a7b1-5701606aae57


*nota: si llegan a vayar los videos entre como si fuera a editar el readme y no cambie nada. Por alguna razón se lee 

# Enlaces de interés

- [Jenkins](http://157.253.238.75:8080/jenkins-isis2603/) -> Autentíquese con sus credencias de GitHub
- [SonarQube](http://157.253.238.75:8080/sonar-isis2603/) -> No requiere autenticación
