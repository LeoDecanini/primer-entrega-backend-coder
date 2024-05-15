import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const databasePath = path.join(__dirname, "../database/productos.json");

class ProductController {
  constructor() {
    if (!fs.existsSync(path.dirname(databasePath))) {
      fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    }

    if (!fs.existsSync(databasePath)) {
      fs.writeFileSync(databasePath, JSON.stringify([]));
    }
  }

  getAllProducts(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = 12;
      const skip = (page - 1) * limit;

      const products = JSON.parse(fs.readFileSync(databasePath));
      const paginatedProducts = products.slice(skip, skip + limit);

      const totalItems = products.length;
      const meta = {
        totalItems: totalItems,
        itemCount: paginatedProducts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };

      response.status(200).json({ data: paginatedProducts, meta: meta });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  getProduct(request, response) {
    try {
      const productId = request.params.id;
      const products = JSON.parse(fs.readFileSync(databasePath));
      const product = products.find((p) => p._id === productId);

      if (!product) {
        return response.sendStatus(404);
      }

      response.status(200).json({ data: product });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  createProduct(request, response) {
    /* {
          "title": "Nuevo producto",
          "thumbnails": ["https://example.com/image.jpg"],
          "status": true,
          "brand": "Marca",
          "rating": "5",
          "color": "Rojo",
          "details": ["Detalle 1", "Detalle 2"],
          "description": ["Descripción 1", "Descripción 2"],
          "stock": 10,
          "freeshipping": true,
          "dues": [6, 12],
          "price": 99.99,
          "code": "ABC123"
        } */

    try {
      const {
        title,
        status,
        brand,
        rating,
        color,
        details,
        description,
        stock,
        freeshipping,
        dues,
        price,
        code,
      } = request.body;

      if (
        !title ||
        !price ||
        !code ||
        !status ||
        !brand ||
        !color ||
        !details ||
        !description ||
        !stock ||
        freeshipping == null ||
        !dues
      ) {
        return response
          .status(400)
          .json({ error: "Todos los campos son obligatorios." });
      }

      const newProduct = {
        _id: Math.random().toString(36).substr(2, 9),
        title,
        thumbnails: request.body.thumbnails || [],
        status,
        brand,
        rating,
        color,
        details,
        description,
        stock,
        freeshipping,
        dues,
        price,
        code,
      };

      const products = JSON.parse(fs.readFileSync(databasePath));
      products.push(newProduct);
      fs.writeFileSync(databasePath, JSON.stringify(products));

      response
        .status(201)
        .json({ message: "Producto creado", data: newProduct });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  updateProduct(request, response) {
    try {
      const productId = request.params.id;
      const {
        title,
        img,
        status,
        brand,
        rating,
        color,
        details,
        description,
        stock,
        freeshipping,
        dues,
      } = request.body;

      if (!productId) {
        return response
          .status(400)
          .json({ error: "Se requiere un ID de producto válido." });
      }

      if (
        !title &&
        !img &&
        !status &&
        !brand &&
        !rating &&
        !color &&
        !details &&
        !description &&
        !stock &&
        freeshipping == null &&
        !dues
      ) {
        return response
          .status(400)
          .json({ error: "Se requiere al menos un campo para actualizar." });
      }

      const products = JSON.parse(fs.readFileSync(databasePath));
      const index = products.findIndex((p) => p._id === productId);

      if (index === -1) {
        return response.sendStatus(404);
      }

      const updatedProduct = { ...products[index], ...request.body };
      products[index] = updatedProduct;
      fs.writeFileSync(databasePath, JSON.stringify(products));

      response
        .status(200)
        .json({ message: "Producto actualizado", data: updatedProduct });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  deleteProduct(request, response) {
    try {
      const productId = request.params.id;

      if (!productId) {
        return response
          .status(400)
          .json({ error: "Se requiere un ID de producto válido." });
      }

      const products = JSON.parse(fs.readFileSync(databasePath));
      const filteredProducts = products.filter((p) => p._id !== productId);

      if (filteredProducts.length === products.length) {
        return response.sendStatus(404);
      }

      fs.writeFileSync(databasePath, JSON.stringify(filteredProducts));

      response.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

export default new ProductController();
