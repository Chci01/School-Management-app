async function testFlowLocal() {
  try {
    console.log('Sending REGISTER...');
    const resReg = await fetch('http://localhost:3000/registration/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolName: 'Local School 3',
        email: 'local_admin_3@itc.com',
        password: 'itc123456789'
      })
    });
    const textReg = await resReg.text();
    console.log('Register Res:', resReg.status, textReg);

    console.log('Sending LOGIN...');
    const resAuth = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matricule: 'local_admin_3@itc.com',
        password: 'itc123456789',
        schoolId: null
      })
    });
    const text = await resAuth.text();
    console.log('Login Res status:', resAuth.status, text);
  } catch (err) {
    console.error('Failed:', err);
  }
}

testFlowLocal();
