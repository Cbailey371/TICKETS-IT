const { sendEmail } = require('../services/emailService');

exports.sendTestEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email destination required' });

        const success = await sendEmail({
            to: email,
            subject: 'Prueba de Configuración SMTP - Tickets SaaS',
            text: 'Si estás leyendo esto, la configuración de correo funciona correctamente.',
            html: '<h3 style="color: #2563eb;">Prueba Exitosa</h3><p>El servidor de correo está configurado correctamente en Tickets SaaS.</p>'
        });

        if (success) {
            res.json({ message: 'Correo de prueba enviado correctamente' });
        } else {
            res.status(500).json({ error: 'Fallo al enviar el correo. Revisa los logs del servidor.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getConfig = async (req, res) => {
    try {
        let config = await NotificationConfig.findOne();
        if (!config) {
            // Return empty structure if not found
            return res.json({
                smtp_host: '',
                smtp_port: 587,
                smtp_user: '',
                smtp_pass: '',
                sender_email: '',
                is_active: true
            });
        }
        // Exclude sensitive data if needed, but superadmin needs to see it to edit (except maybe verify without showing pass?) -> simpler to show for now or mask
        // return res.json(config);

        // For security, usually we don't send back the password, just placeholder
        const { smtp_pass, ...rest } = config.toJSON();
        res.json({ ...rest, smtp_pass: '' }); // Send empty pass to indicate "unchanged" unless user types new one
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const { smtp_host, smtp_port, smtp_user, smtp_pass, sender_email, is_active } = req.body;

        let config = await NotificationConfig.findOne();

        const dataToUpdate = {
            smtp_host,
            smtp_port,
            smtp_user,
            sender_email,
            is_active
        };

        if (smtp_pass && smtp_pass.trim() !== '') {
            dataToUpdate.smtp_pass = smtp_pass;
        }

        if (config) {
            await config.update(dataToUpdate);
        } else {
            // Create if first time, make sure pass is there
            if (!smtp_pass) return res.status(400).json({ error: 'Password required for first setup' });
            dataToUpdate.smtp_pass = smtp_pass;
            config = await NotificationConfig.create(dataToUpdate);
        }

        res.json({ message: 'Configuration updated', config: { ...config.toJSON(), smtp_pass: '******' } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
