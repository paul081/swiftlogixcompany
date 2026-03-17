const { Sequelize } = require('sequelize');

async function createDb() {
    const url = 'postgres://postgres:password@localhost:5432/postgres';
    const s = new Sequelize(url, { logging: false });
    try {
        await s.authenticate();
        await s.query('CREATE DATABASE swiftlogix');
        console.log('Database swiftlogix created.');
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log('Database swiftlogix already exists.');
        } else {
            console.error('Error creating database:', e.message);
        }
    } finally {
        await s.close();
    }
}

createDb();
