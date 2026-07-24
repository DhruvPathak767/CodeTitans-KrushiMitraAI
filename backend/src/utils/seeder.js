import User, { USER_ROLES } from '../models/User.js';
import logger from '../config/logger.js';

/**
 * Seed Default Super Admin Account if not found
 */
export const seedSuperAdmin = async () => {
  try {
    const adminEmail = 'admin123@gmail.com';
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: USER_ROLES.SUPER_ADMIN }],
    });

    if (!existingAdmin) {
      const superAdmin = new User({
        name: 'Super Admin',
        email: adminEmail,
        phone: '9999999999',
        password: 'Admin@123',
        role: USER_ROLES.SUPER_ADMIN,
        emailVerified: true,
        isActive: true,
      });

      await superAdmin.save();
      logger.info(`Super Admin seeded successfully (${adminEmail})`);
    } else {
      logger.info('Super Admin account already exists');
    }
  } catch (error) {
    logger.error(`Error seeding Super Admin: ${error.message}`);
  }
};
