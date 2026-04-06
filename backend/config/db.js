const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
    console.error("FATAL ERROR: DATABASE_URL environment variable is missing!");
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected...');
        
        // Import models here to ensure they register correctly
        require('../models/User');
        require('../models/Shipment');
        require('../models/TrackingHistory');
        require('../models/Warehouse');
        require('../models/Notification');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database Synced');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB, sequelize };
