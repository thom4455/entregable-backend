import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import ProductManager from "../fileManager/productManager.js";

const router = Router();
const productManager = new ProductManager(); // Instancia del administrador de productos

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//get products
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

//GET por id
router.get(
  "/:pid",
  param("pid")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo."),
  handleValidationErrors,
  async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await productManager.getProductById(Number(pid));
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.log("Error al obtener producto:", error);
      res.status(500).json({ error: "Error al obtener producto" });
    }
  }
);

//POST crear producto
router.post(
  "/",
  [
    body("title")
      .isString()
      .notEmpty()
      .withMessage("El título es obligatorio y debe ser una cadena."),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("La descripción es obligatoria y debe ser una cadena."),
    body("code")
      .isString()
      .notEmpty()
      .withMessage("El código es obligatorio y debe ser una cadena."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser un número mayor a 0."),
    body("status")
      .isBoolean()
      .withMessage("El estado debe ser un valor booleano."),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero no negativo."),
    body("category")
      .isString()
      .notEmpty()
      .withMessage("La categoría es obligatoria y debe ser una cadena."),
    body("thumbnails")
      .isArray()
      .withMessage("Las miniaturas deben ser un array de cadenas.")
      .custom((thumbnails) => {
        if (thumbnails.some((thumbnail) => typeof thumbnail !== "string")) {
          throw new Error("Cada miniatura debe ser una cadena.");
        }
        return true;
      }),
  ],
  handleValidationErrors,
  async (req, res) => {
    const productData = req.body;
    try {
      const newProduct = await productManager.createProduct(productData);
      res.status(201).json({
        message: "Producto creado exitosamente.",
        product: newProduct,
      });
    } catch (error) {
      console.log("Error al crear producto:", error);
      res.status(500).json({ error: "Error al crear producto" });
    }
  }
);
//PUT Actualizar producto
router.put(
  "/:pid",
  [
    param("pid")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo."),
    body("id")
      .not()
      .exists()
      .withMessage("No se permite actualizar el campo 'id'."),
    body("title")
      .optional()
      .isString()
      .withMessage("El título debe ser una cadena."),
    body("description")
      .optional()
      .isString()
      .withMessage("La descripción debe ser una cadena."),
    body("code")
      .optional()
      .isString()
      .withMessage("El código debe ser una cadena."),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser un número mayor a 0."),
    body("status")
      .optional()
      .isBoolean()
      .withMessage("El estado debe ser un valor booleano."),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero no negativo."),
    body("category")
      .optional()
      .isString()
      .withMessage("La categoría debe ser una cadena."),
    body("thumbnails")
      .optional()
      .isArray()
      .withMessage("Las miniaturas deben ser un array de cadenas.")
      .custom((thumbnails) => {
        if (thumbnails.some((thumbnail) => typeof thumbnail !== "string")) {
          throw new Error("Cada miniatura debe ser una cadena.");
        }
        return true;
      }),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    try {
      const updatedProduct = await productManager.updateProduct(
        Number(pid),
        updatedData
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res
        .status(200)
        .json({ message: "Producto actualizado.", product: updatedProduct });
    } catch (error) {
      console.log("Error al actualizar producto:", error);
      res.status(500).json({ error: "Error al actualizar producto" });
    }
  }
);

//DELETE Eliminar producto
router.delete(
  "/:pid",
  param("pid")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo."),
  handleValidationErrors,
  async (req, res) => {
    const { pid } = req.params;
    try {
      const deleted = await productManager.deleteProduct(Number(pid));
      if (!deleted) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).json({ message: "Producto eliminado exitosamente." });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ error: "Error al eliminar producto" });
    }
  }
);
export default router;
