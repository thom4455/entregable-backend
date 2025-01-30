import * as fs from "fs";
import { writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
  constructor(filename) {
    this.path = join(__dirname, "../data", filename);
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      } else {
        console.log("Archivo no encontrado");
        return [];
      }
    } catch (error) {
      console.log("Error al leer productos:", error);
      return [];
    }
  }

  //Almacenar el producto en el json
  async createProduct(data) {
    try {
      const products = await this.getProducts();
      const newProduct = this.createProductTemplate(data);
      newProduct.id =
        products.length > 0 ? products[products.length - 1].id + 1 : 1;

      if (products.some((p) => p.code === newProduct.code)) {
        throw new Error("El código del producto ya existe.");
      }

      products.push(newProduct);

      await writeFile(this.path, JSON.stringify(products, null, 2));

      console.log("Producto creado exitosamente.");
      return newProduct;
    } catch (error) {
      console.error("Error al crear un producto:", error.message);
      throw error;
    }
  }

  //Obtener producto por id del json
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((product) => product.id === id) || null;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      throw new Error("No se pudo obtener el producto.");
    }
  }
  createProductTemplate({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  }) {
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Todos los campos obligatorios deben estar completos.");
    }

    return {
      id: null,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
  }

  async saveProducts(products) {
    try {
      await writeFile(this.path, JSON.stringify(products, null, 2));
      console.log("Productos guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
      throw new Error("No se pudo guardar la lista de productos.");
    }
  }

  //Actualizar producto en el json
  async updateProduct(id, updatedData) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) return null;

    delete updatedData.id;
    products[index] = { ...products[index], ...updatedData };
    await this.saveProducts(products);

    return products[index];
  }

  //Eliminar producto del json
  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    await this.saveProducts(products);
    return true;
  }
}
export default ProductManager;
