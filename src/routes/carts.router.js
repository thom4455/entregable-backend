import { Router } from "express";
import CartManager from "../fileManager/cartManager.js";

const router = Router();
const cartManager = new CartManager("../data/carts.json");

//POST raíz / - Crear un carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET /:cid - Obtener los productos del carrito
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST /:cid/product/:pid - Agregar producto a carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = await cartManager.addProductToCart(cartId, productId);

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
