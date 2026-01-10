const { Comment, User, Incident, Attachment } = require('../models');
const { sendEmail } = require('../services/emailService');

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
        const incident = await Incident.findByPk(incidentId, {
            include: [
                { model: User, as: 'reporter', attributes: ['email', 'name'] },
                { model: User, as: 'assignee', attributes: ['email', 'name'] }
            ]
        });
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
                { model: User, as: 'author', attributes: ['id', 'name', 'role', 'email'] },
                { model: Attachment, as: 'attachments' }
            ]
        });

        // NOTIFICATIONS
        const isClient = fullComment.author.role === 'client';
        const notificationSubject = `[Comentario] ${incident.ticket_code} - Nuevo mensaje`;
        const notificationLink = `https://smartincident.cbtechpty.com/incidents/${incident.id}`;

        if (isClient) {
            // Client commented -> Notify Assignee (if any)
            if (incident.assignee && incident.assignee.email) {
                await sendEmail({
                    to: incident.assignee.email,
                    subject: notificationSubject,
                    text: `El cliente comentó en el ticket ${incident.ticket_code}:\n"${content}"`,
                    html: `<p>El cliente ha comentado en el ticket <strong>${incident.ticket_code}</strong>:</p><blockquote>${content}</blockquote><p><a href="${notificationLink}">Ver Comentario</a></p>`
                });
            } else {
                // If no assignee, maybe notify Superadmin? (Optional, kept simple for now)
            }
        } else {
            // Agent/Admin commented -> Notify Reporter (Client)
            if (incident.reporter && incident.reporter.email && incident.reporter.id !== userId) {
                await sendEmail({
                    to: incident.reporter.email,
                    subject: notificationSubject,
                    text: `Hay un nuevo comentario en tu ticket ${incident.ticket_code}:\n"${content}"`,
                    html: `<p>Hay una respuesta en tu ticket <strong>${incident.ticket_code}</strong>:</p><blockquote>${content}</blockquote><p><a href="${notificationLink}">Ver Ticket</a></p>`
                });
            }
        }

        res.status(201).json(fullComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
