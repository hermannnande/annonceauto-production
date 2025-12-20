import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedAdmin() {
  console.log('Creating super admin...');
  
  const query = `
    INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified)
    VALUES (
      'hermannnande@gmail.com',
      '$2a$10$XLMUFLdE30tgVbhmoejpxONmWybZTU/T25cAkLSK8oQEYViawy8Cm',
      'nande',
      'hermann',
      '+2250778030075',
      'admin',
      1000,
      true
    )
    ON CONFLICT (email) DO UPDATE SET
      password = EXCLUDED.password,
      role = 'admin',
      verified = true,
      credits = 1000
    RETURNING id, email, nom, prenom, role;
  `;
  
  try {
    const result = await pool.query(query);
    console.log('Super Admin created/updated:', result.rows[0]);
  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await pool.end();
  }
}

seedAdmin();
