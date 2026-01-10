require('dotenv').config();
const { sequelize, User } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Database synced for SaaS!');

        const superadminEmail = 'superadmin@saas.com';
        const existingUser = await User.findOne({ where: { email: superadminEmail } });

        const hashedPassword = await bcrypt.hash('123456', 10);

        if (!existingUser) {
            await User.create({
                name: 'Super Admin',
                email: superadminEmail,
                role: 'superadmin',
                password_hash: hashedPassword
            });
            console.log('Superadmin user created with password "123456"');
        } else {
            // Update password to ensure we can login for testing
            existingUser.password_hash = hashedPassword;
            if (existingUser.role === 'admin') existingUser.role = 'superadmin';
            await existingUser.save();
            console.log('Superadmin updated with new hashed password');
        }
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
