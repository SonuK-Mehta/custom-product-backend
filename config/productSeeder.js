import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import { faker } from "@faker-js/faker";
import connectDB from "./db.js";

dotenv.config();

const seedProducts = async () => {
  try {
    // Check if products already exist
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      const fakeProducts = Array.from({ length: 50 }).map(() => {
        const productName = faker.commerce.productName();
        return {
          name: productName,
          description: faker.lorem.paragraph(),
          price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
          images: [
            faker.image.urlLoremFlickr({
              width: 500,
              height: 500,
              category: "product",
            }),
            faker.image.urlLoremFlickr({
              width: 500,
              height: 500,
              category: productName.toLowerCase(),
            }),
          ],
          category: faker.commerce.department(),
          stockQuantity: faker.number.int({ min: 0, max: 1000 }),
          customizable: faker.datatype.boolean({ probability: 0.3 }), // 30% chance of being customizable
        };
      });

      await Product.insertMany(fakeProducts);
      console.log(`🌱 Successfully seeded ${fakeProducts.length} products`);
    } else {
      console.log("⏩ Database already has products. Skipping seeding.");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

(async () => {
  try {
    await connectDB();
    await seedProducts();
    console.log("🏁 Seeding process completed");
    process.exit(0);
  } catch (err) {
    console.error("💥 Fatal seeding error:", err);
    process.exit(1);
  }
})();
