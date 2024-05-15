import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cartFilePath = path.join(__dirname, "../database/carritos.json");

let globalCartId;

function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}

class CartController {
  constructor() {
    if (!fs.existsSync(path.dirname(cartFilePath))) {
      fs.mkdirSync(path.dirname(cartFilePath), { recursive: true });
    }

    if (!fs.existsSync(cartFilePath)) {
      fs.writeFileSync(cartFilePath, JSON.stringify([]));
    }
  }

  getAllCarts = (req, res) => {
    try {
      const cartsData = JSON.parse(fs.readFileSync(cartFilePath));
      let carts = cartsData || [];

      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const skip = (page - 1) * limit;

      const paginatedCarts = carts.slice(skip, skip + limit);

      const totalItems = carts.length;
      const meta = {
        totalItems: totalItems,
        itemCount: paginatedCarts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };

      const response = {
        data: paginatedCarts,
        meta: meta,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getUserCart = (req, res) => {
    try {
      const cartId = globalCartId;
      if (!cartId) {
        return res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }
      const cartsData = JSON.parse(fs.readFileSync(cartFilePath));
      const cart = cartsData.find((cart) => cart._id === cartId);
      if (!cart) {
        return res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    try {
      let cartsData = JSON.parse(fs.readFileSync(cartFilePath));
      const cartId = globalCartId;
      if (!cartId) {
        const newCartId = generateCartId();
        globalCartId = newCartId;
        console.log({ globalCartId, productId, quantity });
        cartsData.push({
          _id: newCartId,
          items: [{ product: productId, quantity: quantity }],
        });
      }

      if (cartId) {
        const existingCartIndex = cartsData.findIndex(
          (cart) => cart._id === cartId
        );

        if (existingCartIndex !== -1) {
          const existingItemIndex = cartsData[
            existingCartIndex
          ].items.findIndex((item) => item.product === productId);

          if (existingItemIndex !== -1) {
            cartsData[existingCartIndex].items[existingItemIndex].quantity +=
              quantity;
          } else {
            if (
              cartsData[existingCartIndex].items.some(
                (item) => item.product === productId
              )
            ) {
              res
                .status(400)
                .json({ message: "El producto ya existe en el carrito" });
              return;
            }

            cartsData[existingCartIndex].items.push({
              product: productId,
              quantity: quantity,
            });
          }
        }
      }

      fs.writeFileSync(cartFilePath, JSON.stringify(cartsData));
      res.status(201).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      res.status(500).json({ message: "Error al agregar al carrito" });
    }
  };

  removeFromCart = (req, res) => {
    const { productId } = req.body;
    try {
      let cartsData = JSON.parse(fs.readFileSync(cartFilePath));
      const cartId = globalCartId;
      const existingCartIndex = cartsData.findIndex(
        (cart) => cart._id === cartId
      );
      if (existingCartIndex !== -1) {
        const existingItemIndex = cartsData[existingCartIndex].items.findIndex(
          (item) => item.product === productId
        );
        if (existingItemIndex !== -1) {
          cartsData[existingCartIndex].items.splice(existingItemIndex, 1);
          fs.writeFileSync(cartFilePath, JSON.stringify(cartsData));
          res.status(200).json({ message: "Producto eliminado del carrito" });
        } else {
          res
            .status(404)
            .json({ message: "El producto no está en el carrito" });
        }
      } else {
        res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      res.status(500).json({ message: "Error al eliminar del carrito" });
    }
  };

  editCartItemQuantity = (req, res) => {
    const { productId, quantity } = req.body;
    try {
      let cartsData = JSON.parse(fs.readFileSync(cartFilePath));
      const cartId = globalCartId;
      const existingCartIndex = cartsData.findIndex(
        (cart) => cart._id === cartId
      );
      if (existingCartIndex !== -1) {
        const existingItemIndex = cartsData[existingCartIndex].items.findIndex(
          (item) => item.product === productId
        );
        if (existingItemIndex !== -1) {
          cartsData[existingCartIndex].items[existingItemIndex].quantity =
            quantity;
          fs.writeFileSync(cartFilePath, JSON.stringify(cartsData));
          res.status(200).json({
            message: "Cantidad de producto en el carrito actualizada",
          });
        } else {
          res
            .status(404)
            .json({ message: "El producto no está en el carrito" });
        }
      } else {
        res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }
    } catch (error) {
      console.error(
        "Error al editar la cantidad del producto en el carrito:",
        error
      );
      res.status(500).json({
        message: "Error al editar la cantidad del producto en el carrito",
      });
    }
  };
}

export default new CartController();
