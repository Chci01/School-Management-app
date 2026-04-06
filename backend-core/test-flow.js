async function test() {
  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matricule: 'ADM_EXC_01',
        password: 'password123',
        schoolId: '83a28065-476b-4192-a451-f433b4ffec47'
      })
    });
    console.log('Login Status:', res.status);
    const data = await res.json();
    const token = data.access_token;
    console.log('Login Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    const res2 = await fetch('http://localhost:3000/users', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Users Status:', res2.status);
    const data2 = await res2.json();
    console.log('Users Fetched:', data2.length);
  } catch(e) {
    console.log('ERROR:', e.message);
  }
}
test();
