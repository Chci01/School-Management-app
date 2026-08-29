async function fixProdUser() {
  try {
    const randomId = Math.floor(Math.random() * 10000);
    const email = `admin_${randomId}@itc.com`;
    console.log(`Testing Registration & Login on RENDER for ${email}...`);
    
    console.log('--- 1. REGISTER ---');
    const resReg = await fetch('https://school-management-app-6pkq.onrender.com/registration/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolName: `ITC FINAL TEST ${randomId}`,
        email: email,
        password: 'itc123456789'
      })
    });
    const textReg = await resReg.text();
    console.log(`[Status: ${resReg.status}] Response: ${textReg}`);

    console.log('\n--- 2. LOGIN ---');
    const resAuth = await fetch('https://school-management-app-6pkq.onrender.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matricule: email,
        password: 'itc123456789',
        schoolId: null
      })
    });
    const textAuth = await resAuth.text();
    console.log(`[Status: ${resAuth.status}] Response: ${textAuth}`);
  } catch (err) {
    console.error('Test Failed Exception:', err);
  }
}

fixProdUser();
