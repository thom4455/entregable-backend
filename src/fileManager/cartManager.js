import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class cartManager {
  constructor(filename) {
    this.filePath = join(__dirname, "../data", filename);
  }

  //Almacenar el carrito en el json
  async createCart() {
    try {
      const carts = await this.getCarts();
      console.log("llego aca?");
      const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: [],
      };
      carts.push(newCart);
      await writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito:", error);
      throw new Error("No se pudo crear el carrito.");
    }
  }

  //obtener un carrito del json
  async getCarts() {
    try {
      const data = await readFile(this.filePath, "utf-8");
      return JSON.parse(data) || [];
    } catch (error) {
      console.log("Error al leer los carritos:", error);
      return [];
    }
  }

  //Obtener un carrito por id del json
  async getCartById(cartId) {
    try {
      const carts = await this.getCarts();
      return carts.find((cart) => cart.id === cartId) || null;
    } catch (error) {
      console.log("Error al obtener el carrito por ID:", error);
      throw new Error("No se pudo obtener el carrito.");
    }
  }

  //Agregar producto al carrito del json
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }

      const existingProduct = cart.products.find(
        (prod) => prod.product === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      await writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.log("Error al agregar el producto al carrito:", error);
      throw new Error("No se pudo agregar el producto al carrito.");
    }
  }
}

export default cartManager;
