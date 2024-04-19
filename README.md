# 🎬 The Film Project

The Film Project es una aplicación de administración de películas creada a partir del trabajo práctico enviado por Conexa para conocer las mejores prácticas del candidato.

### 🚀 Instrucciones de uso

#### Vercel Build

La aplicación está desplegada en Vercel. Puedes acceder a ella en el siguiente enlace:

https://the-film-project-pyar7ebmc-federico-pedrazas-projects.vercel.app/api/v1/

Al ingresar, debería decir "OK". De lo contrario, algo ha ocurrido 😕.

#### Ejecución local

Para correr la aplicación localmente, necesitas seguir estos pasos:

Completar los archivos .env (utiliza las .env.example como guía).
Ejecutar el comando de Docker Compose:

```bash
docker-compose -f local-docker-compose.yml up -d
```

### 🔍 Funcionamiento

Las instrucciones del proyecto mencionan que se debe crear una aplicación de gestión de películas con usuarios, basando las acciones posibles en los roles que tenga el usuario. Este proyecto obtiene información de la API pública de Star Wars.

Para este proyecto, se utilizó la API de https://swapi.dev/.

La forma en que se obtiene la información de Star Wars fue un tanto creativa. Durante el desarrollo de la aplicación, se le dio más énfasis a la parte de gestión de películas que a la obtención de información de la API de Star Wars.

Star Wars no es más que un proveedor de información, al igual que pueden existir otros posibles proveedores de películas (PokemonAPI, RickAndMortyAPI, TheMovieDatabase).

### Funcionalidades para Usuarios Regulares:

#### Listar Películas:

El usuario regular puede listar películas de múltiples proveedores.
Se presentarán las películas de un proveedor hasta que se agoten, luego se mostrarán las películas del siguiente proveedor.
Ejemplo: Si el usuario solicita 6 películas y el proveedor por defecto es "custom", se mostrarán todas las películas "custom" disponibles y luego se completará con las películas del siguiente proveedor.

#### Obtener Detalles de una Película:

Los usuarios regulares pueden obtener detalles de una película proporcionando el nombre del proveedor y la referencia.
Para películas "custom", se proporciona el ObjectId de MongoDB; para otras películas, se usa el ID del proveedor correspondiente.

### Funcionalidades para Usuarios Administradores:

#### Crear Películas "Custom":

Los administradores pueden crear películas "custom" con detalles mínimos.
Estas películas se guardan como "custom" en la base de datos.

#### Eliminar Películas:

Los administradores pueden eliminar películas.

#### Editar Películas:

Los administradores pueden editar películas proporcionando los campos a cambiar, el proveedor y la referencia.
Para películas "custom", se edita el documento en MongoDB.
_Para películas de otros proveedores, se almacena o edita una copia exacta de la película en nuestra base de datos con los campos editados._
Importante:

**Las ediciones afectan a todas las funcionalidades de la aplicación.
Los detalles, listados y búsquedas de películas mostrarán la información modificada, no la proporcionada por el proveedor original.
Las copias falsas pueden ser eliminadas en cualquier momento.**

## ⚠️ Comentarios sobre las pruebas

Personalmente, considero que las pruebas son un tanto incompletas y no cumplen con una cobertura suficiente para garantizar que todo esté funcionando correctamente. Me gustaría tener la oportunidad de ver pruebas aplicadas a esta arquitectura que diseñé durante mi tiempo utilizando NestJS, ya que no había aplicado pruebas para esta arquitectura anteriormente.
