const sequelize = require('../config/database');
const User = require('./User');
const Incident = require('./Incident');
const Comment = require('./Comment');
const Attachment = require('./Attachment');
const NotificationConfig = require('./NotificationConfig');
const Company = require('./Company');
const TicketType = require('./TicketType');
const AgentCompany = require('./AgentCompany');

const db = {
    sequelize,
    Sequelize: sequelize.constructor,
    User,
    Incident,
    Comment,
    Attachment,
    NotificationConfig,
    Company,
    TicketType,
    AgentCompany
};

// Associations

// --- SaaS Relations ---

// User - Company (Admin/Client belongs to ONE company)
User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });

// Agent - Company (Many to Many for Agents supporting multiple companies)
User.belongsToMany(Company, { through: AgentCompany, as: 'supportedCompanies', foreignKey: 'agent_id' });
Company.belongsToMany(User, { through: AgentCompany, as: 'agents', foreignKey: 'company_id' });

// TicketType - Company (Many to Many: Type can be used by multiple companies)
// For simplicity we use a join table implicitly or explicitly if extra fields needed
const CompanyTicketType = sequelize.define('CompanyTicketType', {}, { timestamps: false });
TicketType.belongsToMany(Company, { through: CompanyTicketType });
Company.belongsToMany(TicketType, { through: CompanyTicketType });

// Incident - Company
Incident.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Incident, { foreignKey: 'company_id', as: 'incidents' });

// Incident - TicketType
Incident.belongsTo(TicketType, { foreignKey: 'type_id', as: 'type' });

// --- Existing Flow ---

// User - Incident
User.hasMany(Incident, { foreignKey: 'reporter_id', as: 'reportedIncidents' });
User.hasMany(Incident, { foreignKey: 'assignee_id', as: 'assignedIncidents' });
Incident.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });
Incident.belongsTo(User, { foreignKey: 'assignee_id', as: 'assignee' });

// Incident - Comments
Incident.hasMany(Comment, { foreignKey: 'incident_id' });
Comment.belongsTo(Incident, { foreignKey: 'incident_id' });

// User - Comments
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Incident - Attachments
Incident.hasMany(Attachment, { foreignKey: 'incident_id' });
Attachment.belongsTo(Incident, { foreignKey: 'incident_id' });

// Comment - Attachments
Comment.hasMany(Attachment, { foreignKey: 'comment_id', as: 'attachments' });
Attachment.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });

module.exports = db;
