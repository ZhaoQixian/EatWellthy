// backend/test-email.js

const { sendVerificationEmail } = require('./utils/emailUtil');

async function testEmails() {
    try {
        console.log('Starting email tests...');
        
        // Test with your personal email (replace with your actual email)
        console.log('Testing personal email...');
        const personalResult = await sendVerificationEmail(
            'zqx2467027771@gmail.com',  // Replace with your personal email
            'test-token-123'
        );
        console.log('Personal email result:', personalResult);

        // Test with NTU email
        console.log('\nTesting NTU email...');
        const ntuResult = await sendVerificationEmail(
            'qzhao010@e.ntu.edu.sg',
            'test-token-456'
        );
        console.log('NTU email result:', ntuResult);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the tests
testEmails();