import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../models/Products";
import { ProductImage } from "../models/ProductImage";
import { plainToClass } from "class-transformer";

class ProductController {

  //  created controller to add the product
  static async createProduct(req: Request, res: Response) {
    try {
      const { sku, name, price } = req.body;

      if (!sku || !name || !price) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check for duplicate SKU
      const existingProduct = await AppDataSource.manager.findOne(Product, {
        where: { sku },
      });
      if (existingProduct) {
        return res.status(409).json({ error: "SKU already exists" });
      }

      const product = new Product();
      product.sku = sku;
      product.name = name;
      product.price = parseFloat(price);

      // Handle image uploads
      const files = req.files as Express.Multer.File[];

      // check and remove prefix no need to handle in angular and assign filename to image.product
      if (files && files.length > 0) {
        product.images = files.map((file) => {
          const image = new ProductImage();
          image.image_url = file.filename; // No `uploads\\` prefix 
          image.product = product;
          return image;
        });
      }

      // to save 
      await AppDataSource.manager.save(product);

      // Convert to plain object to avoid circular reference
      const plainProduct = plainToClass(Product, product);
      res.status(201).json({
        message: "Product created successfully",
        product: plainProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Error creating product" });
    }
  }

  //  Get all products
  static async getProducts(req: Request, res: Response) {
    try {
      const products = await AppDataSource.manager.find(Product, {
        relations: ["images"],
      });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  }

  //  get controller to retrive the product based on id
  static async getProductById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {

        // find product from db
      const product = await AppDataSource.manager.findOne(Product, {
        where: { id },
        relations: ["images"],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching product" });
    }
  }

  //  update controller to update the product
  static async updateProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { sku, name, price } = req.body;
  
    try {
      const product = await AppDataSource.manager.findOne(Product, {
        where: { id },
        relations: ["images"],
      });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Update only provided fields
      if (sku) product.sku = sku;
      if (name) product.name = name;
      if (price) product.price = parseFloat(price);
  
      // Handle image updates
      const files = req.files as Express.Multer.File[];
  
      if (files && files.length > 0) {
        // Remove old images
        await AppDataSource.manager.remove(ProductImage, product.images);
  
        // Add new images
        product.images = files.map((file) => {
          const image = new ProductImage();
          image.image_url = file.filename; // No `uploads\\` prefix
          image.product = product;
          return image;
        });
      }
  
      await AppDataSource.manager.save(product);
  
      const plainProduct = plainToClass(Product, product);
      res.status(200).json({
        message: "Product updated successfully",
        product: plainProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
  }
  

  //  delete controller to delete the product
  static async deleteProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    try {
      const product = await AppDataSource.manager.findOne(Product, {
        where: { id },
        relations: ["images"],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await AppDataSource.manager.remove(ProductImage, product.images);
      await AppDataSource.manager.remove(product);

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting product" });
    }
  }
}

export default ProductController;