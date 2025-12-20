import bcrypt from 'bcryptjs';

async function createAdmin() {
  const password = 'Nande19912012.';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  console.log('=== SUPER ADMIN CREATION ===');
  console.log('Email: hermannnande@gmail.com');
  console.log('Password hash:', hashedPassword);
  console.log('');
  console.log('=== SQL TO EXECUTE ON RAILWAY ===');
  console.log(`
INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified)
VALUES (
  'hermannnande@gmail.com',
  '${hashedPassword}',
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
  credits = 1000;
`);
}

createAdmin().catch(console.error);
