const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/userModel");

// Connect to MongoDB
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => {
        console.log("DB connection error:", err);
        process.exit(1);
    });

// Create admin user
const createAdmin = async () => {
    try {
        const adminData = {
            firstName: process.argv[2] || "Admin",
            lastName: process.argv[3] || "User",
            email: process.argv[4] || "admin@example.com",
            password: process.argv[5] || "admin123",
            role: 1, // Admin role
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log(`Admin user with email ${adminData.email} already exists!`);
            
            // Update to admin role if not already
            if (existingAdmin.role !== 1) {
                existingAdmin.role = 1;
                await existingAdmin.save();
                console.log(`User ${adminData.email} has been updated to admin role.`);
            }
            
            process.exit(0);
        }

        // Create new admin user
        const admin = await User.create(adminData);
        console.log("Admin user created successfully!");
        console.log("Email:", admin.email);
        console.log("Password:", adminData.password);
        console.log("Role:", admin.role);
        
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
