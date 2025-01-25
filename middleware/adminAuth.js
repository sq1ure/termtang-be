export const authenticateAdmin = (req, res, next) => {
    // Assuming the role information is stored in the JWT token
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied. Admins only.' });
    }
    next();
};
