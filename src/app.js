import express from "express";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartsRouter);
app.use("/api/products", productRouter);

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
