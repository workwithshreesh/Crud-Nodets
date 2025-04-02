# Product Management API

This project is a **Node.js + TypeScript + Express + TypeORM** based **CRUD API** for managing products, including image uploads. The API is deployed on **Render**.

## 🚀 Live API Base URL
```
https://crud-nodets.onrender.com/api
```

## 📌 Features
- CRUD operations for products
- Image upload using **Multer**
- Database connection with **TypeORM**
- Supports **MySQL / PostgreSQL**

---

## 🛠️ Installation Guide

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repository-url.git
cd your-repository-name
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file in the project root and configure:
```env
PORT=3000
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USERNAME=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

### 4️⃣ Run Database Migrations
```sh
npm run typeorm migration:run
```

### 5️⃣ Start the Server
```sh
npm run dev
```
Server runs on `http://localhost:3000`.

---

## 📝 API Endpoints

### ➤ Create a Product
```http
POST /api/products
```
**Body:** (Multipart Form Data)
```json
{
  "sku": "PROD123",
  "name": "Test Product",
  "price": 100,
  "images": [file]
}
```

### ➤ Get All Products
```http
GET /api/products
```

### ➤ Get Product by ID
```http
GET /api/products/:id
```

### ➤ Update Product
```http
PUT /api/products/:id
```

### ➤ Delete Product
```http
DELETE /api/products/:id
```

---

## 🖼️ Handling Image Uploads
Uploaded images are stored in the `/uploads` directory. **Render does not persist local files**, so consider using **Cloudinary** or **S3**.

---

## 🔧 Deployment on Render
- Push your code to **GitHub**
- Create a **new Render Web Service**
- Link to your **GitHub repository**
- Add **environment variables** in Render dashboard
- Deploy and test your API!

---

## 📜 License
This project is licensed under **MIT**.

---

## 📝 Author
Developed by **Shreesh Tiwari** 🚀