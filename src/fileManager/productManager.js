import fs from "fs/promises";

class ProductManager {
  constructor() {
    this.filePath = "../data/products.json";
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
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));

      console.log("Producto creado exitosamente.");
      return newProduct;
    } catch (error) {
      console.error("Error al crear un producto:", error.message);
      throw error;
    }
  }

  //Obtener productos del json
  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data) || [];
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else {
        console.error("Error al leer products:", error);
        throw error;
      }
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

    products.splice(index, 1); // Elimina el producto del array
    await this.saveProducts(products);
    return true;
  }
}
export default ProductManager;
