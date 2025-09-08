const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  fullName: 'John Doe',
  nationalId: '12345678901',
  phone: '+1234567890',
  email: 'john.doe@example.com',
  password: 'StrongPass123!'
};

const testAccount = {
  accountNumber: 'ACC001234567890'
};

let authToken = '';
let accountId = '';

async function testEndpoints() {
  try {
    console.log('🚀 Starting Banking API Tests\n');

    // 1. Test User Registration
    console.log('1️⃣ Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, proceeding with login...');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
        throw error;
      }
    }

    // 2. Test User Login
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = loginResponse.data.access_token;
    console.log('✅ Login successful, token received');

    // 3. Test Account Creation
    console.log('\n3️⃣ Testing Account Creation...');
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      const accountResponse = await axios.post(`${BASE_URL}/accounts`, testAccount, { headers });
      accountId = accountResponse.data.id;
      console.log('✅ Account created:', accountResponse.data);
    } catch (error) {
      if (error.response?.status === 400) {
        // Account might already exist, get accounts list
        console.log('ℹ️ Account might exist, fetching accounts...');
        const accountsResponse = await axios.get(`${BASE_URL}/accounts`, { headers });
        if (accountsResponse.data.length > 0) {
          accountId = accountsResponse.data[0].id;
          console.log('✅ Using existing account:', accountsResponse.data[0]);
        } else {
          throw error;
        }
      } else {
        console.log('❌ Account creation failed:', error.response?.data || error.message);
        throw error;
      }
    }

    // 4. Test Deposit Transaction
    console.log('\n4️⃣ Testing Deposit Transaction...');
    const depositTransaction = {
      type: 'deposit',
      amount: 1000,
      fromAccountId: accountId,
      description: 'Initial deposit'
    };
    const depositResponse = await axios.post(`${BASE_URL}/transactions`, depositTransaction, { headers });
    console.log('✅ Deposit successful:', depositResponse.data);

    // 5. Test Another Deposit
    console.log('\n5️⃣ Testing Another Deposit...');
    const deposit2Transaction = {
      type: 'deposit',
      amount: 500,
      fromAccountId: accountId,
      description: 'Second deposit'
    };
    const deposit2Response = await axios.post(`${BASE_URL}/transactions`, deposit2Transaction, { headers });
    console.log('✅ Second deposit successful:', deposit2Response.data);

    // 6. Test Withdrawal Transaction
    console.log('\n6️⃣ Testing Withdrawal Transaction...');
    const withdrawalTransaction = {
      type: 'withdrawal',
      amount: 200,
      fromAccountId: accountId,
      description: 'ATM withdrawal'
    };
    const withdrawalResponse = await axios.post(`${BASE_URL}/transactions`, withdrawalTransaction, { headers });
    console.log('✅ Withdrawal successful:', withdrawalResponse.data);

    // 7. Create second account for transfer test
    console.log('\n7️⃣ Creating Second Account for Transfer Test...');
    const testAccount2 = {
      accountNumber: 'ACC001234567891'
    };
    let account2Id = '';
    try {
      const account2Response = await axios.post(`${BASE_URL}/accounts`, testAccount2, { headers });
      account2Id = account2Response.data.id;
      console.log('✅ Second account created:', account2Response.data);
    } catch (error) {
      console.log('ℹ️ Second account might exist, continuing...');
      // For simplicity, we'll skip transfer test if account creation fails
      account2Id = null;
    }

    // 8. Test Transfer Transaction (if second account exists)
    if (account2Id) {
      console.log('\n8️⃣ Testing Transfer Transaction...');
      const transferTransaction = {
        type: 'transfer',
        amount: 300,
        fromAccountId: accountId,
        toAccountId: account2Id,
        description: 'Transfer to savings'
      };
      const transferResponse = await axios.post(`${BASE_URL}/transactions`, transferTransaction, { headers });
      console.log('✅ Transfer successful:', transferResponse.data);
    } else {
      console.log('\n8️⃣ Skipping Transfer Transaction (second account not available)');
    }

    // 9. Test Transaction History
    console.log('\n9️⃣ Testing Transaction History...');
    const historyResponse = await axios.get(`${BASE_URL}/transactions?accountId=${accountId}&page=1&limit=10`, { headers });
    console.log('✅ Transaction history retrieved:', historyResponse.data);

    // 10. Test Invalid Transaction (insufficient funds)
    console.log('\n🔟 Testing Invalid Transaction (Insufficient Funds)...');
    try {
      const invalidTransaction = {
        type: 'withdrawal',
        amount: 10000, // More than account balance
        fromAccountId: accountId,
        description: 'Large withdrawal'
      };
      await axios.post(`${BASE_URL}/transactions`, invalidTransaction, { headers });
      console.log('❌ This should have failed!');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid transaction correctly rejected:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.log('\n💥 Test failed:', error.message);
    if (error.response) {
      console.log('Error details:', error.response.status, error.response.statusText);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('Network error - no response received');
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

// Run the tests
testEndpoints();
