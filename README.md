# React + Vite
# Coffe Shop Project - (Vite, React, Supabase)

## Crear base de datos
Luego de analizar los requerimientos del proyecto, el primer paso fue plantear la estructura de la base de datos en Supabase, con el objetivo de soportar la gestión de productos, clientes y ventas de forma clara y escalable.

La base de datos fue diseñada siguiendo un modelo relacional, separando cada entidad principal en su propia tabla y estableciendo relaciones entre ellas.

Se crearon la tablas "products", "sales" y "customers" siguiendo los requrimientos planteados en el reto, adicionamete se agregeo la columna "created_at" para tener un registro tipo log de la creación de cada registro tipo producto o tener la posibildiad de escalar las metricas filtrando por mes, año, día o semana...

Igualmente ser creó la tabla "sale_iteams" para establecer una relación entre las tablas "products" y "sales", en donde se establece el detalle de cada compra realizada.

## Funciones, flujo y seguridad
Como se indicó en el pliego de requisitos se habilitó el RLS, en donde se estableció la seguridad de los datos, en donde unos se dejaron de lectura publica y otros de escritura para usuarios autenticados, adicionalmente se creó el bucket para el almacenamiento de las imagenes en Supabase.

La primera función que se realizó fue la de agregar productos, que como no se tiene actentificación de usuario se inició por agregar un usuario, solicitando datos de contacto y tomando el correo como único, con el fin de no repetir clientes, seguido se crea la venta y se procesan los productos, en donde se analiza el stock disponible y se realiza el descargo del producto.

Posteriormente se crearon las funciones para mostrar las metricas tales como top clientes, top productos, total ventas, total productos y total clientes, estas se manejaron como consultas SQL individuales para tener mayor indenpendencia en cada uso de las mismas.

## Construcción del front
Se crea una app por medio de Vite para trabajar con React 

Lo primero que se hizo fue crear una carperta llamada lib para hacer el uso de la libreria de Supabase y realiza la conexíon mediante los datos de URL y contraseña ANON, además se creó un archivo tipo .env para tener portección sobre los datos sensibles para esta conexión.

Posteriormente se crearon las vistas en donde en las vistas Admin y Dashboard se hizo la validación para que en caso de no estar autentificado no mostrara el contenido, inicialmente se hizo el flujo completo y a medida que se fue necesitando se crearon los componentes con el fin de modular y no llenar de peso funcional una vista.

Por último se hizo el testing del flujo, en donde se hicieron varios ajustes de visuales que optimizaron la UX.

## Conceptos a mejora 
Me hubiese gustado ofrecer un informe de ventas mensual, semana o diario y este graficarlo, pero no me alcanzo el tiempo y el modelo que incnié no fue funcional entonces decidí no incluirlo.

# Ejecución Local del Proyecto
## Requisitos previos
Node.js (versión 20 LTL)
npm (incluido con Node.js)

git clone https://github.com/SebastianCastellanos24/Coffee-Shop-Challenge.git
cd Coffee-Shop-Challenge

npm install

cp .env.example .env
VITE_SUPABASE_URL=https://lhzkecvjajxobuqlvzxi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoemtlY3ZqYWp4b2J1cWx2enhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTU3MTQsImV4cCI6MjA4NDI3MTcxNH0.UVuIehsMeWu1kXVU_PqWPQpHHsB5f_srkgSj7CFCm3I

npm run dev