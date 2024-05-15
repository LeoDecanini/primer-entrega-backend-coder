import express from "express";
import ProductController from "../controllers/products.js";
import CartController from "../controllers/carts.js";

const router = express.Router();

/* products */

router.get("/api/products", ProductController.getAllProducts); /* /api/products?page=1 */
router.get("/api/products/:id", ProductController.getProduct);
router.post("/api/products", ProductController.createProduct);
router.put("/api/products/:id", ProductController.updateProduct);
router.delete("/api/products/:id", ProductController.deleteProduct);

/* carts */

router.get("/api/carts", CartController.getAllCarts); /* /api/carts?page=1 */
router.get("/api/carts/:userId", CartController.getUserCart);
router.post("/api/carts", CartController.addToCart);
router.put("/api/carts", CartController.removeFromCart);
router.put("/api/carts", CartController.editCartItemQuantity);

export default router;