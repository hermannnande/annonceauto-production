// Test d'inscription
const testRegister = async () => {
  const userData = {
    nom: "Test",
    prenom: "Utilisateur",
    email: `test${Date.now()}@example.com`,
    telephone: "+2250707070707",
    ville: "Abidjan",
    password: "test123456"
  };

  console.log('📝 Test inscription avec:', userData);

  try {
    const response = await fetch('https://annonceauto-production-production.up.railway.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    console.log('✅ Statut:', response.status);
    console.log('📦 Réponse:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ INSCRIPTION RÉUSSIE !');
      console.log('🎫 Token:', data.token);
      console.log('👤 Utilisateur:', data.user);
    } else {
      console.log('❌ ERREUR:', data.error || data.message);
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error.message);
  }
};

testRegister();




