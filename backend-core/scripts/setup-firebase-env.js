const fs = require('fs');
const path = require('path');

const keyPath = process.argv[2];

if (!keyPath) {
  console.error('Usage: node setup-firebase-env.js <chemin-vers-le-fichier-json>');
  process.exit(1);
}

try {
  const absoluteKeyPath = path.resolve(keyPath);
  const keyContent = fs.readFileSync(absoluteKeyPath, 'utf8');
  
  // Vérifier si c'est un JSON valide
  JSON.parse(keyContent);
  
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Supprimer l'ancienne variable FIREBASE_SERVICE_ACCOUNT si elle existe
  envContent = envContent.replace(/^FIREBASE_SERVICE_ACCOUNT=.*[\r\n]*/gm, '');
  
  // Ajouter la nouvelle variable (minify le JSON pour qu'il tienne sur une ligne)
  const minifiedKey = JSON.stringify(JSON.parse(keyContent));
  envContent += `\nFIREBASE_SERVICE_ACCOUNT='${minifiedKey}'\n`;
  
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log('✅ FIREBASE_SERVICE_ACCOUNT a été ajouté au fichier .env avec succès !');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
