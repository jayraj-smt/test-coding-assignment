import sequelize from './sequelize';
import '../models/User';
import '../models/Generation';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection established');

    await sequelize.sync({ alter: true });
    // eslint-disable-next-line no-console
    console.log('Database migration completed');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

migrate();
