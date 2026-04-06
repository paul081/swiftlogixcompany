const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./config/db');
const User = require('./models/User');
const Shipment = require('./models/Shipment');
const TrackingHistory = require('./models/TrackingHistory');
const Warehouse = require('./models/Warehouse');

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL...');

        // Sync and Clear existing data
        await sequelize.sync({ force: true });
        console.log('Database Synced (Force: True - Cleared existing data).');

        // Create Admin User
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@swiftlogix.com',
            password: 'admin123',
            role: 'admin',
            phone: '+1234567890',
            address: 'Main Command Center, Silicon Valley, CA'
        });
        console.log(`Admin user created with ID: ${admin.id}`);

        // Create Regular User
        const user = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'user',
            phone: '+0987654321',
            address: '456 Innovation Blvd, New York, USA'
        });
        console.log(`Regular user created with ID: ${user.id}`);

        // Create Sample Warehouse
        const warehouse = await Warehouse.create({
            name: 'SF Distribution Center',
            country: 'USA',
            city: 'San Francisco',
            address: '100 Logistics Way'
        });
        console.log('Sample warehouse created.');

        // Create Sample Shipments
        const shipments = [
            {
                trackingNumber: 'SLX7890ABC12',
                senderName: 'John Doe',
                senderAddress: '123 Tech St, San Francisco, USA',
                receiverName: 'Jane Smith',
                receiverEmail: 'jane@example.com',
                receiverAddress: '456 Innovation Blvd, New York, USA',
                shipmentStatus: 'Transit',
                currentLocation: 'Chicago Hub',
                packageWeight: '2.5kg',
                packageType: 'Electronics Box',
                createdBy: admin.id
            },
            {
                trackingNumber: 'SLX12345DEF67',
                senderName: 'Global Tech Corp',
                senderAddress: '789 Industry Way, London, UK',
                receiverName: 'Alice Wong',
                receiverEmail: 'alice@example.com',
                receiverAddress: '101 Horizon Ave, Tokyo, Japan',
                shipmentStatus: 'Delivered',
                currentLocation: 'Tokyo Branch',
                packageWeight: '1.2kg',
                packageType: 'Document Folder',
                createdBy: admin.id
            }
        ];

        for (const s of shipments) {
            const ship = await Shipment.create(s);
            
            // Create initial history for each
            await TrackingHistory.create({
                trackingNumber: ship.trackingNumber,
                location: 'Origin Warehouse',
                status: 'Pending',
                description: 'Shipment created and logged by admin',
                updatedBy: admin.id
            });

            if (ship.shipmentStatus === 'Delivered') {
                await TrackingHistory.create({
                    trackingNumber: ship.trackingNumber,
                    location: ship.currentLocation,
                    status: 'Delivered',
                    description: 'Handed over to recipient',
                    updatedBy: admin.id
                });
            }
        }
        
        console.log('Sample shipments and tracking history created.');
        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
