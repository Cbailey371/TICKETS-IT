const { sequelize, User, Company, AgentCompany } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seedDemo() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Ensure schema is up to date

        console.log('Seeding Demo Data...');

        // 1. Create Company
        const company = await Company.create({
            name: 'TechSolutions Inc.',
            status: 'active',
            address: '123 Tech Blvd, Silicon Valley',
            contact_email: 'contact@techsolutions.com'
        });
        console.log('Company created:', company.name);

        const passwordHash = await bcrypt.hash('123456', 10);

        // 2. Create Company Admin
        await User.create({
            name: 'Admin Empresa',
            email: 'admin@techsolutions.com',
            role: 'company_admin',
            password_hash: passwordHash,
            company_id: company.id
        });
        console.log('Company Admin created: admin@techsolutions.com');

        // 3. Create Client
        await User.create({
            name: 'Cliente User',
            email: 'client@techsolutions.com',
            role: 'client',
            password_hash: passwordHash,
            company_id: company.id
        });
        console.log('Client created: client@techsolutions.com');

        // 4. Create Agent (Global or Linked)
        // Let's create an agent that supports this company
        const agent = await User.create({
            name: 'Agente Soporte',
            email: 'agent@techsolutions.com',
            role: 'agent',
            password_hash: passwordHash,
            // Agent might not be directly in the company in User table if they are external, 
            // but if they are internal, they might be.
            // Based on plan: "Agent: company_id is NULL (use AgentCompany)". 
            // Let's keep company_id null for pure multi-tenant agent.
        });

        // Link Agent to Company
        await AgentCompany.create({
            agent_id: agent.id,
            company_id: company.id
        });

        console.log('Agent created: agent@techsolutions.com');

        process.exit(0);
    } catch (error) {
        console.error('Demo Seed failed:', error);
        process.exit(1);
    }
}

seedDemo();
