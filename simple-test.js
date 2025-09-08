const axios = require('axios');

async function basicTest() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:3000');
    console.log('✅ Server is responding:', response.data);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
  }
}

basicTest();
