# 🛍️ E-Commerce Customization Platform API

This is the backend API for a full-stack e-commerce web application that allows users to browse customizable products, manage their shopping cart, and place orders. Built with Node.js, Express, and MongoDB.

---

## 🚀 Project Features

- User authentication with JWT (sign up / login / protected routes)
- Password hashing with bcrypt
- Product listing with categories
- Shopping cart management (add/update/remove)
- Order placement with status tracking
- MongoDB schema relationships with Mongoose
- Middleware-based route protection
- Modular and scalable project structure

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Other Tools:** dotenv, CORS, validator, nodemon

---

## 📁 Folder Structure

```
/backend
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middlewares/
  ├── config/
  ├── utils/
  ├── .env
  └── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of `backend` and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 🔐 API Authentication

Use the `Authorization` header with a Bearer token for all protected routes:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📬 API Endpoints

### 🧑 Auth

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/auth/signup` | Register new user        |
| POST   | `/api/auth/login`  | Login user and get token |

---

### 📦 Products

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/products`     | List all products      |
| GET    | `/api/products/:id` | Get single product     |
| POST   | `/api/products`     | Add product (admin)    |
| PUT    | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

---

### 🛒 Cart

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | `/api/cart`            | Get user's cart         |
| POST   | `/api/cart`            | Add item to cart        |
| PUT    | `/api/cart/:productId` | Update quantity in cart |
| DELETE | `/api/cart/:productId` | Remove item from cart   |

---

### 📦 Orders

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | `/api/orders`       | Place new order             |
| GET    | `/api/orders`       | Get user's orders           |
| GET    | `/api/admin/orders` | Get all orders (admin)      |
| PATCH  | `/api/orders/:id`   | Update order status (admin) |

---

## 🧪 Testing

Use tools like [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test API endpoints locally.

---

## 🌐 Deployment

- Hosted on: Render
- MongoDB via: MongoDB Atlas
- Add production `MONGO_URI`, `JWT_SECRET` in environment settings

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Author

Made by [Your Name](https://github.com/yourusername) – Full Stack Developer.
