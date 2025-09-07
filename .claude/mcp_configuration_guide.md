# MCP Configuration & Integration Guide

## Essential MCP Setup for Claude Code Projects

This guide provides detailed configuration for all MCPs required for high-quality, rapid development within the 6-day sprint methodology.

## Core MCPs Configuration

### 1. Playwright MCP
**Purpose**: Frontend testing, visual regression, accessibility validation

#### Installation & Setup
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "./node_modules/.cache/playwright"
      }
    }
  }
}
```

#### Configuration Files
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile Devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    // Tablets
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Essential Test Patterns
```javascript
// tests/visual-regression.spec.js
import { test, expect } from '@playwright/test';

test('visual regression - homepage', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('homepage.png');
});

// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('accessibility - main navigation', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

### 2. Context7 MCP
**Purpose**: Code analysis, standards checking, performance optimization

#### Installation & Setup
```json
{
  "mcpServers": {
    "context7": {
      "command": "context7-mcp-server",
      "args": ["--project-root", "."],
      "env": {
        "CONTEXT7_CONFIG": "./context7.config.json"
      }
    }
  }
}
```

#### Configuration
```json
// context7.config.json
{
  "rules": {
    "performance": {
      "bundleSizeLimit": "200KB",
      "renderTimeLimit": "100ms",
      "memoryUsageLimit": "50MB",
      "apiResponseLimit": "200ms"
    },
    "codeQuality": {
      "maxComplexity": 10,
      "maxDuplication": 3,
      "minCoverage": 80,
      "maxDebt": "2h"
    },
    "security": {
      "enableVulnerabilityScanning": true,
      "enableDependencyAudit": true,
      "checkSensitiveData": true
    },
    "accessibility": {
      "wcagLevel": "AA",
      "enforceAltText": true,
      "checkColorContrast": true
    }
  },
  "integrations": {
    "eslint": {
      "configPath": ".eslintrc.js"
    },
    "prettier": {
      "configPath": ".prettierrc"
    },
    "typescript": {
      "configPath": "tsconfig.json"
    }
  },
  "reporting": {
    "format": "json",
    "outputPath": "./reports/context7-report.json",
    "includeMetrics": true
  }
}
```

### 3. Performance Monitor MCP
**Purpose**: Real-time performance monitoring and optimization

#### Installation & Setup
```json
{
  "mcpServers": {
    "performance-monitor": {
      "command": "performance-monitor-mcp",
      "args": ["--config", "./performance.config.js"],
      "env": {
        "PERF_LOG_LEVEL": "info"
      }
    }
  }
}
```

#### Configuration
```javascript
// performance.config.js
export default {
  monitoring: {
    interval: 5000, // Check every 5 seconds
    metrics: [
      'core-web-vitals',
      'bundle-size',
      'api-response-times',
      'memory-usage',
      'cpu-usage'
    ]
  },
  thresholds: {
    lcp: 2500, // 2.5 seconds
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    bundleSize: 204800, // 200KB
    apiResponse: 200 // 200ms
  },
  alerts: {
    slack: {
      webhook: process.env.SLACK_WEBHOOK,
      channel: '#performance-alerts'
    },
    email: {
      smtp: process.env.SMTP_CONFIG,
      recipients: ['dev-team@company.com']
    }
  },
  reporting: {
    dashboard: {
      port: 3001,
      enabled: true
    },
    exports: {
      lighthouse: './reports/lighthouse/',
      webpagetest: './reports/webpagetest/',
      customMetrics: './reports/performance/'
    }
  }
};
```

### 4. Mobile Testing MCP (iOS/Android)
**Purpose**: Mobile device testing and validation

#### iOS Simulator MCP Setup
```json
{
  "mcpServers": {
    "ios-simulator": {
      "command": "ios-simulator-mcp",
      "args": ["--xcode-path", "/Applications/Xcode.app"],
      "env": {
        "SIMULATOR_DEVICES": "iPhone 14,iPhone SE,iPad Pro"
      }
    }
  }
}
```

#### Android Emulator MCP Setup
```json
{
  "mcpServers": {
    "android-emulator": {
      "command": "android-emulator-mcp",
      "args": ["--sdk-path", "$ANDROID_HOME"],
      "env": {
        "EMULATOR_DEVICES": "Pixel_5,Pixel_Tablet,Nexus_One"
      }
    }
  }
}
```

#### Mobile Test Configuration
```javascript
// mobile-test.config.js
export default {
  ios: {
    devices: [
      'iPhone 14 Pro',
      'iPhone SE (3rd generation)',
      'iPad Pro (12.9-inch)',
      'iPad mini (6th generation)'
    ],
    versions: ['16.0', '17.0']
  },
  android: {
    devices: [
      'Pixel 7',
      'Pixel 5',
      'Galaxy S22',
      'Galaxy Tab S8'
    ],
    versions: ['11.0', '12.0', '13.0', '14.0']
  },
  testScenarios: [
    'touch-interactions',
    'gesture-navigation',
    'orientation-changes',
    'keyboard-input',
    'camera-access',
    'offline-functionality'
  ]
};
```

## Framework-Specific MCP Configurations

### Next.js MCP
```json
{
  "mcpServers": {
    "nextjs": {
      "command": "nextjs-mcp-server",
      "args": ["--project", "."],
      "env": {
        "NEXTJS_CONFIG": "./next.config.js"
      }
    }
  }
}
```

### React Native MCP
```json
{
  "mcpServers": {
    "react-native": {
      "command": "react-native-mcp",
      "args": ["--metro-config", "./metro.config.js"],
      "env": {
        "RN_PLATFORM": "both"
      }
    }
  }
}
```

### Vue/Nuxt MCP
```json
{
  "mcpServers": {
    "vue-devtools": {
      "command": "vue-mcp-server",
      "args": ["--config", "./vue.config.js"],
      "env": {
        "VUE_VERSION": "3"
      }
    }
  }
}
```

## Database & API Testing MCPs

### Database MCP Setup
```json
{
  "mcpServers": {
    "database": {
      "command": "database-mcp-server",
      "args": ["--config", "./db.config.json"],
      "env": {
        "DB_MONITOR_QUERIES": "true",
        "DB_ENABLE_EXPLAIN": "true"
      }
    }
  }
}
```

#### Database Configuration
```json
// db.config.json
{
  "monitoring": {
    "slowQueryThreshold": 100,
    "enableQueryExplain": true,
    "trackIndexUsage": true,
    "monitorConnections": true
  },
  "optimization": {
    "suggestIndexes": true,
    "detectN1Queries": true,
    "analyzeJoinPerformance": true
  },
  "testing": {
    "seedData": "./tests/fixtures/",
    "resetBetweenTests": true,
    "transactionalTests": true
  }
}
```

### API Testing MCP
```json
{
  "mcpServers": {
    "api-tester": {
      "command": "api-tester-mcp",
      "args": ["--spec", "./api-spec.yml"],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

## Security & Quality Assurance MCPs

### Security Scanner MCP
```json
{
  "mcpServers": {
    "security-scanner": {
      "command": "security-mcp-server",
      "args": ["--config", "./security.config.js"],
      "env": {
        "SECURITY_LEVEL": "strict"
      }
    }
  }
}
```

#### Security Configuration
```javascript
// security.config.js
export default {
  scans: {
    dependencies: {
      enabled: true,
      autoFix: false,
      severity: ['critical', 'high']
    },
    code: {
      enabled: true,
      rules: [
        'no-eval',
        'no-unsafe-innerHTML',
        'validate-inputs',
        'secure-cookies',
        'csrf-protection'
      ]
    },
    runtime: {
      enabled: true,
      checks: [
        'xss-prevention',
        'sql-injection',
        'auth-bypass',
        'data-exposure'
      ]
    }
  },
  reporting: {
    format: 'json',
    includeRecommendations: true,
    severityFilter: 'medium'
  }
};
```

## Development Server Integration

### Dev Server MCP (Background Process)
```json
{
  "mcpServers": {
    "dev-server": {
      "command": "dev-server-mcp",
      "args": ["--port", "3000", "--background"],
      "env": {
        "NODE_ENV": "development",
        "HOT_RELOAD": "true",
        "AUTO_RESTART": "true"
      }
    }
  }
}
```

#### Dev Server Configuration
```javascript
// dev-server.config.js
export default {
  server: {
    port: 3000,
    host: '0.0.0.0',
    background: true,
    autoRestart: true,
    healthCheck: '/health'
  },
  hotReload: {
    enabled: true,
    watchPaths: ['src/', 'components/', 'pages/'],
    excludePaths: ['node_modules/', '.git/', 'dist/']
  },
  proxy: {
    '/api': 'http://localhost:4000',
    '/uploads': 'http://localhost:5000'
  },
  middleware: [
    'cors',
    'compression',
    'error-handler',
    'request-logger'
  ]
};
```

## MCP Health Monitoring

### Health Check Script
```javascript
// scripts/check-mcps.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const requiredMCPs = [
  'playwright',
  'context7',
  'performance-monitor',
  'ios-simulator',
  'android-emulator',
  'dev-server'
];

async function checkMCPHealth() {
  console.log('🔍 Checking MCP health...\n');
  
  for (const mcp of requiredMCPs) {
    try {
      await execAsync(`claude-code mcp status ${mcp}`);
      console.log(`✅ ${mcp}: Healthy`);
    } catch (error) {
      console.log(`❌ ${mcp}: Failed - ${error.message}`);
    }
  }
  
  console.log('\n🚀 MCP health check complete!');
}

checkMCPHealth();
```

### Auto-Setup Script
```bash
#!/bin/bash
# scripts/setup-mcps.sh

echo "🚀 Setting up MCPs for Claude Code..."

# Install required MCP servers
npm install -g @anthropic-ai/mcp-server-playwright
npm install -g context7-mcp-server
npm install -g performance-monitor-mcp
npm install -g ios-simulator-mcp
npm install -g android-emulator-mcp

# Setup configuration files
cp templates/playwright.config.js ./
cp templates/context7.config.json ./
cp templates/performance.config.js ./

# Install dependencies
npm install @playwright/test axe-playwright
npx playwright install

# Start dev server in background
npm run dev &
DEV_PID=$!
echo $DEV_PID > .dev-server.pid

echo "✅ MCP setup complete!"
echo "📊 Health check in 10 seconds..."
sleep 10
node scripts/check-mcps.js
```

## Integration Validation

### MCP Integration Test
```javascript
// tests/mcp-integration.test.js
import { test, expect } from '@playwright/test';

test('MCP integration validation', async ({ page }) => {
  // Test Playwright MCP
  await page.goto('/');
  await expect(page).toHaveTitle(/.*App.*/);
  
  // Test performance monitoring
  const performanceMetrics = await page.evaluate(() => {
    return performance.getEntriesByType('navigation')[0];
  });
  expect(performanceMetrics.loadEventEnd).toBeLessThan(3000);
  
  // Test responsive design
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone
  await expect(page.locator('.mobile-nav')).toBeVisible();
  
  // Test accessibility
  const axeResults = await page.evaluate(() => {
    return window.axe?.run() || { violations: [] };
  });
  expect(axeResults.violations).toHaveLength(0);
});
```

## Troubleshooting Guide

### Common Issues & Solutions

1. **MCP Connection Failed**
   ```bash
   # Check MCP status
   claude-code mcp status
   
   # Restart specific MCP
   claude-code mcp restart playwright
   ```

2. **Playwright Browser Installation**
   ```bash
   # Install all browsers
   npx playwright install
   
   # Install specific browser
   npx playwright install chromium
   ```

3. **Performance Monitor Not Starting**
   ```bash
   # Check port availability
   netstat -an | grep 3001
   
   # Kill process on port
   lsof -ti:3001 | xargs kill -9
   ```

4. **Mobile Simulator Issues**
   ```bash
   # iOS Simulator
   xcrun simctl list devices
   
   # Android Emulator
   $ANDROID_HOME/emulator/emulator -list-avds
   ```

---

*This configuration ensures all MCPs work harmoniously to provide comprehensive testing, monitoring, and development capabilities for rapid, high-quality software delivery.*