const { Sequelize } = require('sequelize');

async function probe() {
    const variants = [
        'postgres://postgres:postgres@localhost:5432/postgres',
        'postgres://postgres@localhost:5432/postgres',
        'postgres://postgres:admin@localhost:5432/postgres',
        'postgres://postgres:password@localhost:5432/postgres'
    ];

    for (const url of variants) {
        console.log(`Trying: ${url}`);
        const s = new Sequelize(url, { logging: false, benchmark: false });
        try {
            await s.authenticate();
            console.log(`✅ Success with ${url}`);
            await s.close();
            return;
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
}

probe();
