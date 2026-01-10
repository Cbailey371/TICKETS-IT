const { User, Company } = require('../models');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, company_id } = req.body;
        const requestorRole = req.user.role;

        // Security Check: Company Admin can only create users for their own company
        if (requestorRole === 'company_admin' && parseInt(company_id) !== req.user.company_id) {
            return res.status(403).json({ error: 'No autorizado para crear usuarios en otra empresa' });
        }

        // Validation: Clients and Company Admins MUST belong to a company
        if (['client', 'company_admin'].includes(role) && !company_id) {
            return res.status(400).json({ error: 'El usuario debe pertenecer a una empresa.' });
        }

        // Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password_hash: hashedPassword, // Fixed: match model field name
            role,
            company_id: company_id || null // Superadmins/Agents might differ
        });

        // Exclude password from response
        const { password_hash: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { role, company_id } = req.user;
        let whereClause = {};

        if (role === 'company_admin') {
            whereClause.company_id = company_id;
        }
        // Superadmin sees all (no whereClause needed by default)

        const users = await User.findAll({
            where: whereClause,
            include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
            attributes: { exclude: ['password_hash', 'reset_token'] }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, company_id, password } = req.body;
        const requestorRole = req.user.role;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Security Check
        if (requestorRole === 'company_admin') {
            if (user.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'No autorizado' });
            }
            // Prevent changing company_id to another company
            if (company_id && parseInt(company_id) !== req.user.company_id) {
                return res.status(403).json({ error: 'No puede cambiar usuarios a otra empresa' });
            }
        }

        let updateData = { name, email, role, company_id };
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);

        const { password_hash: _, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requestorRole = req.user.role;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Security Check
        if (requestorRole === 'company_admin' && user.company_id !== req.user.company_id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await user.destroy();
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
