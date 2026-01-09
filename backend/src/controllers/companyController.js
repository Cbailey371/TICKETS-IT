const { Company, User, Incident } = require('../models');

exports.createCompany = async (req, res) => {
    try {
        const { name, address, contact_email, status } = req.body;
        const company = await Company.create({
            name,
            address,
            contact_email,
            status: status || 'active'
        });
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            include: [
                { model: User, as: 'users', attributes: ['id'] },
                { model: Incident, as: 'incidents', attributes: ['id'] }
            ]
        });

        // Format response to include counts
        const formatted = companies.map(c => ({
            id: c.id,
            name: c.name,
            address: c.address,
            contact_email: c.contact_email,
            status: c.status,
            usersCount: c.users.length,
            ticketsCount: c.incidents.length
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });

        await company.update(req.body);
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });

        await company.destroy();
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
