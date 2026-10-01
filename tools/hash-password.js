/* Uso:  node tools/hash-password.js "tu contraseña"
   Imprime los valores para las variables de entorno de Netlify. */
const crypto=require('crypto'),p=process.argv[2];
if(!p||p.length<10){console.error('Escribe una contraseña de al menos 10 caracteres:  node tools/hash-password.js "mi contraseña larga"');process.exit(1)}
const salt=crypto.randomBytes(16).toString('hex');
console.log('ADMIN_PASS_HASH=scrypt$'+salt+'$'+crypto.scryptSync(p,salt,32).toString('hex'));
console.log('SESSION_SECRET='+crypto.randomBytes(32).toString('hex'));
console.log('ADMIN_USER=<el usuario que quieras>');
