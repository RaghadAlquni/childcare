// scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../DB/models/userSchema.js"); // عدّلي المسار إذا لازم

const MONGO_DB = process.env.MONGO_DB;
const ADMIN_ID_NUMBER = process.env.SEED_ADMIN_IDNUMBER || "999999999"; // اختاري قيمة افتراضية آمنة
const ADMIN_FULLNAME = process.env.SEED_ADMIN_NAME || "Super Admin";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD_FROM_ENV = process.env.SEED_ADMIN_PASSWORD || null; // لو حطيتيها في .env
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

if (!MONGO_DB) {
  console.error("MONGO_URI is not set in .env — aborting seed.");
  process.exit(1);
}

async function createAdminIfNotExists() {
  await mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // لو فيه Admin موجود بالفعل (حسب role) نخرج بدون إنشاء
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists in DB. Seed will not create another admin.");
      console.log("Existing admin id:", existingAdmin._id.toString());
      return;
    }

    // لو محددة idNumber سبق إنشاؤه نتحقق أيضاً (ضمان إضافي)
    const existingById = await User.findOne({ idNumber: ADMIN_ID_NUMBER });
    if (existingById) {
      console.log(`A user with idNumber ${ADMIN_ID_NUMBER} already exists (id: ${existingById._id}). Seed aborted.`);
      return;
    }

    // اختر كلمة مرور: إما من .env أو نولّد واحدة عشوائية
    let plainPassword = ADMIN_PASSWORD_FROM_ENV;
    if (!plainPassword) {
      // توليد كلمة مرور قوية مؤقتة (12 حرف، أرقام وحروف)
      plainPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
    }

    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    const newAdmin = new User({
      fullName: ADMIN_FULLNAME,
      idNumber: ADMIN_ID_NUMBER,
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
      shift: null,
    });

    await newAdmin.save();

    console.log("=== Admin seeded successfully ===");
    console.log("Admin ID:", newAdmin._id.toString());
    console.log("Admin idNumber:", ADMIN_ID_NUMBER);
    console.log("Admin email:", ADMIN_EMAIL);
    console.log("");
    console.log("IMPORTANT: this is the generated admin password (showing ONCE):");
    console.log(plainPassword);
    console.log("");
    console.log("Please copy this password and store it securely (e.g., password manager). Then log in and change it immediately.");
    console.log("Seed script will not create another admin while an admin exists.");
  } catch (err) {
    console.error("Error while seeding admin:", err);
  } finally {
    await mongoose.disconnect();
  }
}


// تشغيل السكربت
createAdminIfNotExists().then(() => process.exit(0));