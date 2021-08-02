import { Seeder } from 'mongoose-data-seed';
import Permission from '../models/permission';

const data = [
  // User permissions
  { name: 'view.user' },
  { name: 'edit.user' },
  { name: 'delete.user' },
  { name: 'create.user' },

  // Device permissions
  { name: 'view.device' },
  { name: 'edit.device' },
  { name: 'delete.device' },
  { name: 'create.device' },

  // Role permissions
  { name: 'view.role' },
  { name: 'edit.role' },
  { name: 'delete.role' },
  { name: 'create.role' },

  // Lecture permissions
  { name: 'view.lecture' },
  { name: 'edit.lecture' },
  { name: 'delete.lecture' }
];

class PermissionsSeeder extends Seeder {

  async shouldRun() {
    return Permission.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Permission.create(data);
  }
}

export default PermissionsSeeder;
