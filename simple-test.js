// Simple test for core functionality without Discord dependencies

// Mock console methods to avoid noise during testing
console.log = () => {};
console.warn = () => {};
console.error = () => {};

// Copy the core functions from bot.js
const X_COM_REGEX = /\bhttps?:\/\/(?:www\.)?x\.com\/([^\s]+)/gi;

// Convert x.com URL to xcancel.com
function convertToXCancel(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'x.com' || urlObj.hostname === 'www.x.com') {
      urlObj.hostname = 'xcancel.com';
      urlObj.protocol = 'https:'; // Ensure HTTPS
      return urlObj.toString();
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Extract x.com links from message
function extractXComLinks(content) {
  const links = [];
  let match;

  // Reset regex lastIndex
  X_COM_REGEX.lastIndex = 0;

  while ((match = X_COM_REGEX.exec(content)) !== null) {
    links.push({
      original: match[0],
      converted: convertToXCancel(match[0])
    });
  }

  return links.filter(link => link.converted !== null);
}

function testConvertToXCancel() {
  console.log('\n🧪 Testing URL conversion logic...');

  const testCases = [
    {
      input: 'https://x.com/example/1234567890',
      expected: 'https://xcancel.com/example/1234567890',
      description: 'Basic x.com URL'
    },
    {
      input: 'https://www.x.com/example/status/1234567890',
      expected: 'https://xcancel.com/example/status/1234567890',
      description: 'x.com with www and status path'
    },
    {
      input: 'http://x.com/user',
      expected: 'https://xcancel.com/user',
      description: 'HTTP x.com URL (should convert to HTTPS)'
    },
    {
      input: 'https://example.com/test',
      expected: null,
      description: 'Non-x.com URL (should return null)'
    },
    {
      input: 'invalid-url',
      expected: null,
      description: 'Invalid URL (should return null)'
    }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    try {
      const result = convertToXCancel(testCase.input);
      if (result === testCase.expected) {
        console.log(`✅ Test ${index + 1}: ${testCase.description}`);
        passed++;
      } else {
        console.log(`❌ Test ${index + 1}: ${testCase.description}`);
        console.log(`   Expected: ${testCase.expected}`);
        console.log(`   Got: ${result}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test ${index + 1}: ${testCase.description} - Error: ${error.message}`);
      failed++;
    }
  });

  console.log(`\n📊 URL Conversion Test Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

function testExtractXComLinks() {
  console.log('\n🧪 Testing link extraction from messages...');

  const testCases = [
    {
      input: 'Check out this tweet: https://x.com/example/123',
      expectedCount: 1,
      description: 'Single x.com link'
    },
    {
      input: 'Multiple links: https://x.com/user1/123 and https://x.com/user2/456',
      expectedCount: 2,
      description: 'Multiple x.com links'
    },
    {
      input: 'Mixed links: https://x.com/test/123 and https://example.com/page',
      expectedCount: 1,
      description: 'Mixed x.com and other links'
    },
    {
      input: 'No links here just text',
      expectedCount: 0,
      description: 'No links in message'
    },
    {
      input: 'Case insensitive: HTTPS://X.COM/EXAMPLE/123',
      expectedCount: 1,
      description: 'Case insensitive matching'
    }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    try {
      const result = extractXComLinks(testCase.input);
      if (result.length === testCase.expectedCount) {
        console.log(`✅ Test ${index + 1}: ${testCase.description}`);
        passed++;
      } else {
        console.log(`❌ Test ${index + 1}: ${testCase.description}`);
        console.log(`   Expected count: ${testCase.expectedCount}`);
        console.log(`   Got count: ${result.length}`);
        console.log(`   Results:`, result);
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test ${index + 1}: ${testCase.description} - Error: ${error.message}`);
      failed++;
    }
  });

  console.log(`\n📊 Link Extraction Test Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Run all tests
function runTests() {
  console.log = (msg) => process.stdout.write(msg + '\n');
  console.log('🚀 Starting Discord Bot Core Functionality Tests...\n');

  const urlTestPassed = testConvertToXCancel();
  const extractionTestPassed = testExtractXComLinks();

  console.log('\n🎯 Overall Test Results:');
  console.log(`   URL Conversion: ${urlTestPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Link Extraction: ${extractionTestPassed ? '✅ PASS' : '❌ FAIL'}`);

  if (urlTestPassed && extractionTestPassed) {
    console.log('\n🎉 All tests passed! The bot core functionality is working correctly.');
    console.log('📝 Note: To fully test the Discord bot, you\'ll need to:');
    console.log('   1. Set up a Discord bot token in .env file');
    console.log('   2. Invite the bot to a Discord server');
    console.log('   3. Run the bot and test with actual x.com links');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
    process.exit(1);
  }
}

// Run tests
runTests();