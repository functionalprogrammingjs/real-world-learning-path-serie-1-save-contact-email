# Functional refactor

Es repositorio contiene la implementación de un problema con diferentes enfoques.
La idea es comparar y adquirir conocimiento práctico en programación funcional desde la implementación. 

El ejercicio contiene los aspectos más comunes encontrados en APPs del mundo real.

* Manejo de errores.
* Manejo de excepciones.
* Disyunción por decisiones.
* Obtención de datos de forma asíncrona.
* Datos introducidos por el usuario.

Vamos a llevar el ejercicio desde:

1. Una implementación imperativa.
2. De una implementación imperativa a una con patrones funcionales de composición.
3. De una implementación con patrones funcionales a una con tipos de datos algebraicos.
4. De una implementación usando tipos de datos algebraicos a patrones más avanzados como transformadores de monadas.

Con cada enfoque evaluaremos: 

* ¿Cómo mejora la modularidad? 
* ¿Qué pasa con el mantenimiento al añadir nuevos requisitos?
* ¿Qué pasa con nuevas excepciones? 
* ¿Qué pasa al añadir estrategias de respaldo de datos ?

## Descripción del ejercicio

Como usuario queremos guardar el email de un contacto en un fichero local dada una lista de contactos alojada en una API de forma interactiva.

Para obtener  el email del contacto vamos a introducir de forma interactiva su nombre, si no existe email para ese nombre introducido debe mostrar un mensaje que lo indique.

Si existe un email para el nombre introducido, preguntaremos al usuario si quiere guardarlo.
Si el usuario escribe “yes” en la terminal, el contacto será guardado en un fichero local.
Si ocurre un error al intentar guardar el correo, debe mostrar un mensaje que lo indique.
Si el usuario escribe “no”, debe mostrar un mensaje que lo indique.

## Requistos futuros

* Los contactos no están normalizados en el API, debe notificar al usuario.
* El API de contactos puede fallar, debe tener una estrategia de respaldo.
## Ejectutar

Cada carpeta contiene su tipo de implementación

* imperative: la forma a la que estamos acostumbrados.
* declarative: usando patrones funcionales pero no ADTs.
* adt: usando ADTs.
* monad-transformers: patrones avanzados.

Para ejecutar utilizar el index.js que tienen dentro.

ejemplo:

```bash
node imperative/index.js
```
