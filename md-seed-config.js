import mongoose from 'mongoose';

// Seeders
import Permissions from './seeders/permissions.seeder';
import Roles from './seeders/roles.seeder';
import Users from './seeders/users.seeder';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/raspberry_monitor';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  Permissions,
  Roles,
  Users
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
