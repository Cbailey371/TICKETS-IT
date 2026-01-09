const { TicketType, Company } = require('../models');
const { Op } = require('sequelize');

exports.createTicketType = async (req, res) => {
    try {
        const { name, sla_response, sla_resolution, is_global, companies } = req.body;
        const { role, company_id } = req.user;

        let typeData = {
            name,
            sla_response,
            sla_resolution,
            is_global: is_global || false
        };

        // RBAC Enforcement
        if (role === 'company_admin') {
            typeData.is_global = false; // Forced false
        } else if (role !== 'superadmin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const ticketType = await TicketType.create(typeData);

        // Association Logic
        if (role === 'company_admin') {
            // Auto-assign to own company
            await ticketType.setCompanies([company_id]);
        } else if (role === 'superadmin') {
            // If not global and companies provided
            if (!typeData.is_global && companies && companies.length > 0) {
                await ticketType.setCompanies(companies);
            }
        }

        res.status(201).json(ticketType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTicketTypes = async (req, res) => {
    try {
        const { role, company_id } = req.user;

        let whereClause = {};

        if (role === 'company_admin' || role === 'client' || role === 'agent') {
            // Fetch Global OR Assigned to Company
            // This requires a complex query with include filtering or OR condition
            // Easier approach: Get all that are global OR associated with company_id

            // To do this efficiently with Sequelize matching the Association structure:
            // TicketType <-- CompanyTicketType --> Company

            const types = await TicketType.findAll({
                include: [{
                    model: Company,
                    attributes: ['id'],
                    through: { attributes: [] }
                }]
            });

            // Filter in JS for simplicity or construct complex Op.or
            // Logic: Keep if is_global OR companies list includes my company_id
            const filtered = types.filter(t => {
                if (t.is_global) return true;
                return t.Companies.some(c => c.id === company_id);
            });
            return res.json(filtered);
        }

        // Superadmin gets all
        const types = await TicketType.findAll({
            include: [{
                model: Company,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });
        res.json(types);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTicketType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sla_response, sla_resolution, is_global, companies } = req.body;
        const { role, company_id } = req.user;

        const ticketType = await TicketType.findByPk(id, { include: [Company] });
        if (!ticketType) return res.status(404).json({ error: 'Ticket Type not found' });

        // RBAC Check for Update
        if (role === 'company_admin') {
            // Cannot edit global types
            if (ticketType.is_global) return res.status(403).json({ error: 'No puede editar tipos globales' });
            // Cannot edit types belonging to other companies (should filter via fetch, but double check)
            const belongsToCompany = ticketType.Companies.some(c => c.id === company_id);
            if (!belongsToCompany) return res.status(403).json({ error: 'No tiene permiso sobre este tipo' });
        }

        let updateData = { name, sla_response, sla_resolution };
        if (role === 'superadmin') {
            updateData.is_global = is_global;
        }

        await ticketType.update(updateData);

        // Update associations (Superadmin only for now, or Company Admin implicitly keeps it)
        if (role === 'superadmin' && companies !== undefined) {
            await ticketType.setCompanies(companies);
        }

        res.json(ticketType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTicketType = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, company_id } = req.user;

        const ticketType = await TicketType.findByPk(id, { include: [Company] });
        if (!ticketType) return res.status(404).json({ error: 'Ticket Type not found' });

        // RBAC
        if (role === 'company_admin') {
            if (ticketType.is_global) return res.status(403).json({ error: 'No puede eliminar tipos globales' });
            const belongsToCompany = ticketType.Companies.some(c => c.id === company_id);
            if (!belongsToCompany) return res.status(403).json({ error: 'No tiene permiso sobre este tipo' });
        }

        await ticketType.destroy();
        res.json({ message: 'Ticket Type deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
