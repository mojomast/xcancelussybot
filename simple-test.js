// Simple test for URL conversion functions
// This isolates the core logic without initializing the Discord bot

// Mock site mappings for testing
const siteMappings = new Map([
  ['x.com', 'xcancel.com'],
  ['www.x.com', 'xcancel.com'],
  ['instagram.com', 'imginn.com'],
  ['www.instagram.com', 'imginn.com'],
  ['tiktok.com', 'snaptik.app'],
  ['www.tiktok.com', 'snaptik.app'],
  ['threads.net', 'photomate.online'],
  ['www.threads.net', 'photomate.online']
]);

// Convert URL using site mappings
function convertUrl(url) {
  try {
    const urlObj = new URL(url);
    const targetDomain = siteMappings.get(urlObj.hostname);

    if (targetDomain) {
      urlObj.hostname = targetDomain;
      urlObj.protocol = 'https:'; // Ensure HTTPS
      return urlObj.toString();
    }
    return null;
  } catch (error) {
    console.error(`Error converting URL ${url}: ${error.message}`);
    return null;
  }
}

// Create dynamic regex pattern for all supported domains
function createUrlRegex(domains) {
  const domainPatterns = Array.from(domains.keys())
    .map(domain => domain.replace(/\./g, '\\.'))
    .join('|');
  return new RegExp(`\\bhttps?:\/\/(?:www\\.)?(${domainPatterns})\/([^\\s]+)`, 'gi');
}

const URL_REGEX = createUrlRegex(siteMappings);

// Extract supported links from message
function extractSupportedLinks(content) {
  const links = [];
  let match;

  // Reset regex lastIndex
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(content)) !== null) {
    const originalUrl = match[0];
    const convertedUrl = convertUrl(originalUrl);

    if (convertedUrl) {
      links.push({
        original: originalUrl,
        converted: convertedUrl
      });
    }
  }

  return links;
}

// Test functions
function testConvertUrl() {
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
      input: 'https://instagram.com/example/post123',
      expected: 'https://imginn.com/example/post123',
      description: 'Instagram URL'
    },
    {
      input: 'https://www.tiktok.com/@user/video/1234567890',
      expected: 'https://snaptik.app/@user/video/1234567890',
      description: 'TikTok URL with www'
    },
    {
      input: 'https://threads.net/@user/post123',
      expected: 'https://photomate.online/@user/post123',
      description: 'Threads URL'
    },
    {
      input: 'https://example.com/test',
      expected: null,
      description: 'Non-supported URL (should return null)'
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
      const result = convertUrl(testCase.input);
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

function testExtractSupportedLinks() {
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
      input: 'Instagram post: https://instagram.com/example/post123',
      expectedCount: 1,
      description: 'Single Instagram link'
    },
    {
      input: 'Mixed links: https://x.com/test/123 and https://instagram.com/user/photo and https://example.com/page',
      expectedCount: 2,
      description: 'Mixed supported and unsupported links'
    },
    {
      input: 'Multiple platforms: https://x.com/test/123 https://instagram.com/user/photo https://tiktok.com/@user/video/456',
      expectedCount: 3,
      description: 'Multiple supported platforms'
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
      const result = extractSupportedLinks(testCase.input);
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
  console.log('🚀 Starting Discord Bot Core Functionality Tests...\n');

  const urlTestPassed = testConvertUrl();
  const extractionTestPassed = testExtractSupportedLinks();

  console.log('\n🎯 Overall Test Results:');
  console.log(`   URL Conversion: ${urlTestPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Link Extraction: ${extractionTestPassed ? '✅ PASS' : '❌ FAIL'}`);

  if (urlTestPassed && extractionTestPassed) {
    console.log('\n🎉 All tests passed! The bot core functionality is working correctly.');
    console.log('📝 Note: To fully test the Discord bot, you\'ll need to:');
    console.log('   1. Set up a Discord bot token in .env file');
    console.log('   2. Invite the bot to a Discord server');
    console.log('   3. Run the bot and test with actual supported platform links');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
    return false;
  }
}

// Export functions for testing
module.exports = {
  convertUrl,
  extractSupportedLinks,
  testConvertUrl,
  testExtractSupportedLinks,
  runTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}