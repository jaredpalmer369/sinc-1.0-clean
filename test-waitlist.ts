// test-waitlist.ts
const testSignup = async () => {
    const res = await fetch('http://localhost:3000/api/signup-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@sinq.ai',
        source: 'framer-waitlist',
      }),
    });
  
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  };
  
  testSignup().catch(console.error);
  