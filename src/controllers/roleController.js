const Role = require("../models/roleModel");

const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const newRole = new Role({ name, permissions });
        await newRole.save();
        res.status(201).json({ message: "Role created", role: newRole });
    } catch (err) {
        res.status(500).json({ message: "Failed to create role", error: err.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const role = await Role.findOneAndUpdate({ name }, { permissions }, { new: true });
        if (!role) return res.status(404).json({ message: "Role not found" });

        res.status(200).json({ message: "Role updated", role });
    } catch (err) {
        res.status(500).json({ message: "Failed to update role", error: err.message });
    }
};

module.exports = { createRole, updateRole };
