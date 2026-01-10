require('dotenv').config();
const { sequelize, User } = require('./src/models');
const { Op } = require('sequelize');

async function debugUsers() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        console.log('\n--- ALL USERS ---');
        const users = await User.findAll();
        users.forEach(u => {
            console.log(`ID: ${u.id} | Name: ${u.name} | Email: "${u.email}" | Role: "${u.role}"`);
        });

        console.log('\n--- TESTING QUERY ---');
        const admins = await User.findAll({
            where: {
                role: { [Op.or]: ['superadmin', 'Superadmin', 'SuperAdmin'] }
            }
        });
        console.log(`Query found ${admins.length} superadmins.`);
        admins.forEach(a => {
            console.log(` - Found: ${a.email} (${a.role})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugUsers();
