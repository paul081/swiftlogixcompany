require('dotenv').config();
const { sequelize } = require('./config/db');
const Shipment = require('./models/Shipment');

const list = async () => {
  try {
    await sequelize.authenticate();
    const shipments = await Shipment.findAll();
    console.log('Valid Tracking Numbers and Statuses:');
    shipments.forEach(s => {
      console.log(`- ${s.trackingNumber} (${s.shipmentStatus})`);
    });
  } catch (e) {
    console.error(e);
  }
  process.exit();
};

list();
