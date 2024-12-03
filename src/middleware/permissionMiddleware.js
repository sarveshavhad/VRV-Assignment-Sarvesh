// src/middleware/permissionMiddleware.js

const checkPermission = (permission) => {
    return (req, res, next) => {
        // Ensure the user has permissions and check if the required permission is present
        if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
            return res.status(403).json({ message: "Access Denied: You do not have the required permission" });
        }
        next(); // User has the permission, proceed to the next middleware or route handler
    };
};

module.exports = checkPermission;
