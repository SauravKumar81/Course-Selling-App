const jwt = require('jsonwebtoken');
const { AdminModel } = require('../db/db');
require('dotenv').config();

const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.adminToken;
    
    if (!token) {
        return res.status(401).json({ message: "Admin authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        const admin = await AdminModel.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: "Invalid admin token" });
        }
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = {
    authenticateAdmin
};