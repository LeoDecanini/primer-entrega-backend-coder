# Configuración

- **Puerto:** 8080
- **Rutas:** /carts y /products

## Configuración de la ruta "/products":

- **GET /:** Esta solicitud traerá todos los productos disponibles, con la opción de limitar la visualización utilizando "/api/products?page=1" para la paginación.

- **GET /:id:** Esta solicitud recuperará el producto específico identificado por el ID proporcionado.

- **POST /:** Esta solicitud creará el producto con los siguientes campos:

  - **title**
  - **thumbnails**
  - **status**
  - **brand**
  - **rating**
  - **color**
  - **details**
  - **description**
  - **stock**
  - **freeshipping**
  - **dues**
  - **price**
  - **code**

- **PUT /:id:** Esta solicitud actualizará el producto, pero no modificará el ID bajo ninguna circunstancia.

- **DELETE /:id:** Esta solicitud eliminará el producto.

## Configuración de la ruta "/carts":

- **GET /:** Esta solicitud traerá todos los carritos disponibles, con la opción de limitar la visualización utilizando "/api/carts?page=1" para la paginación.

- **GET /:id:** Esta solicitud recuperará el carrito específico identificado por el ID proporcionado.

- **POST /:** Esta solicitud creará el carrito si no existe y agregará el producto si existe.

  Ejemplo de cuerpo de solicitud:

  ```json
  {
      "productId": "ABC123",
      "quantity": 2
  }
