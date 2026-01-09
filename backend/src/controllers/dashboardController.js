const { Incident, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardMetrics = async (req, res) => {
    try {
        let whereClause = {};

        if (req.user.role === 'company_admin') {
            whereClause.company_id = req.user.company_id;
        } else if (req.user.role === 'client') {
            whereClause.reporter_id = req.user.id;
        }
        // Superadmin sees all (empty whereClause)
        // Agent logic can be added later

        const totalOpen = await Incident.count({
            where: {
                ...whereClause,
                status: { [Op.not]: 'closed' }
            }
        });

        const totalResolved = await Incident.count({
            where: {
                ...whereClause,
                status: { [Op.or]: ['resolved', 'closed'] }
            }
        });

        // Mocking average resolution time for now as we don't have enough data
        const averageResolutionTime = "2h 30m";

        // Recent
        const recentIncidents = await Incident.findAll({
            where: whereClause,
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: ['reporter', 'assignee', 'company']
        });

        res.json({
            metrics: {
                open: totalOpen,
                resolved: totalResolved,
                avgResolutionTime: averageResolutionTime,
            },
            recentIncidents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
