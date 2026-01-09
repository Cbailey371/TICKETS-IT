const { Comment, User, Incident, Attachment } = require('../models');

exports.getCommentsByIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const comments = await Comment.findAll({
            where: { incident_id: incidentId },
            include: [
                { model: User, as: 'author', attributes: ['id', 'name', 'role', 'email'] },
                { model: Attachment, as: 'attachments' }
            ],
            order: [['createdAt', 'ASC']]
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // From authMiddleware

        // Verify incident exists
        const incident = await Incident.findByPk(incidentId);
        if (!incident) return res.status(404).json({ error: 'Incident not found' });

        const comment = await Comment.create({
            content,
            incident_id: incidentId,
            user_id: userId
        });

        if (req.file) {
            await Attachment.create({
                file_path: req.file.path,
                original_name: req.file.originalname,
                comment_id: comment.id,
                incident_id: incidentId // Optional: link to incident as well for easier retrieval
            });
        }

        // Fetch again to include author and attachment info
        const fullComment = await Comment.findByPk(comment.id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'name', 'role'] },
                { model: Attachment, as: 'attachments' }
            ]
        });

        res.status(201).json(fullComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
