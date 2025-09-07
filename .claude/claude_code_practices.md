# Claude Code Development Best Practices

## Project Structure and Philosophy

This document establishes best practices for Claude Code projects, ensuring rapid development within 6-day sprints while maintaining high standards for performance, design, and testing.

### Core Principles
1. **Test-Driven Development**: Write tests first, implement second
2. **Agent-Driven Architecture**: Use specialized agents for domain expertise
3. **Performance-First**: Every feature must meet performance benchmarks
4. **Design Excellence**: Modern, delightful UI/UX with micro-interactions
5. **Continuous Validation**: Automated testing at every layer

## Required MCP Integrations

### Essential MCPs for Every Project
- **Playwright MCP**: Frontend testing, visual regression, accessibility
- **Context7 MCP**: Code analysis, standards checking, optimization
- **Puppeteer MCP**: Browser automation, screenshot testing
- **iOS Simulator MCP**: Mobile testing for React Native/PWA
- **Android Emulator MCP**: Cross-platform mobile validation
- **Database MCP**: Query optimization, schema validation
- **Git MCP**: Version control, branch management
- **File System MCP**: Project structure, file operations

### Platform-Specific MCPs
- **Next.js MCP**: For React-based projects
- **Vue DevTools MCP**: For Vue applications
- **React Native MCP**: For mobile applications
- **API Testing MCP**: For backend services

## Agent Integration Strategy

### Core Agents (Always Active)
1. **frontend-developer**: UI implementation, performance optimization
2. **ui-designer**: Design systems, modern aesthetics, micro-interactions
3. **test-writer-fixer**: Comprehensive test coverage, TDD approach
4. **performance-benchmarker**: Speed optimization, bottleneck identification
5. **whimsy-injector**: Delightful user experiences, shareability

### Specialized Agents (On-Demand)
- **api-tester**: Load testing, contract validation
- **security-auditor**: Vulnerability assessment
- **accessibility-checker**: WCAG compliance validation

## Development Workflow

### Day 1-2: Foundation & Planning
1. **Project Setup**
   - [ ] Initialize project structure
   - [ ] Configure all required MCPs
   - [ ] Set up development server (runs in background)
   - [ ] Create initial test suite structure
   - [ ] Establish design system tokens

2. **Planning Phase**
   - [ ] Create detailed feature breakdown
   - [ ] Define performance benchmarks
   - [ ] Establish testing strategy
   - [ ] Plan UI/UX specifications
   - [ ] Set up task tracking system

### Day 3-4: Core Development
1. **Test-First Implementation**
   - [ ] Write failing tests for each feature
   - [ ] Implement minimal code to pass tests
   - [ ] Refactor for performance and maintainability
   - [ ] Add edge case testing

2. **Design Implementation**
   - [ ] Apply modern UI patterns
   - [ ] Add micro-interactions and animations
   - [ ] Ensure responsive design
   - [ ] Validate accessibility compliance

### Day 5-6: Optimization & Validation
1. **Performance Testing**
   - [ ] Run performance benchmarks
   - [ ] Identify and fix bottlenecks
   - [ ] Validate Core Web Vitals
   - [ ] Test under load conditions

2. **Quality Assurance**
   - [ ] Full test suite execution
   - [ ] Cross-browser/device testing
   - [ ] Security vulnerability scan
   - [ ] User experience validation

## Task Management System

### Required Task Lists
Each project must maintain these active task lists:

#### `CURRENT_SPRINT.md`
- Current sprint goals
- Daily progress tracking
- Blockers and dependencies
- Performance metrics

#### `TESTING_STATUS.md`
- Test coverage reports
- Failed tests and fixes
- Edge cases identified
- Testing automation status

#### `DESIGN_CHECKLIST.md`
- UI component status
- Design system compliance
- Accessibility validation
- Visual regression tests

#### `PERFORMANCE_LOG.md`
- Benchmark results
- Optimization implementations
- Performance regressions
- Load testing results

## Quality Standards

### Performance Benchmarks
- **Frontend**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Backend**: API response < 200ms (p95), Database queries < 50ms
- **Mobile**: App startup < 3s, 60fps animations, <100MB memory

### Code Quality Requirements
- **Test Coverage**: Minimum 80% for critical paths
- **Type Safety**: 100% TypeScript coverage
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Zero critical vulnerabilities

### Design Standards
- **Modern Aesthetics**: Gradients, shadows, rounded corners
- **Micro-interactions**: Hover states, loading animations, transitions
- **Responsive Design**: Mobile-first, fluid layouts
- **Performance**: Optimized images, lazy loading, code splitting

## MCP Configuration Templates

### Playwright MCP Setup
```javascript
// playwright.config.js
export default {
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
};
```

### Context7 MCP Integration
```json
{
  "context7": {
    "rules": {
      "performance": {
        "bundleSize": "< 200KB",
        "renderTime": "< 100ms",
        "memoryUsage": "< 50MB"
      },
      "codeQuality": {
        "complexity": "< 10",
        "duplication": "< 3%",
        "coverage": "> 80%"
      }
    }
  }
}
```

## Emergency Protocols

### When Tests Fail
1. **Immediate Actions**
   - [ ] Stop new feature development
   - [ ] Identify root cause using test-writer-fixer agent
   - [ ] Fix failing tests while preserving intent
   - [ ] Verify fix doesn't break other tests

### When Performance Degrades
1. **Response Protocol**
   - [ ] Run performance-benchmarker agent
   - [ ] Identify performance bottlenecks
   - [ ] Implement optimization fixes
   - [ ] Validate improvements with new benchmarks

### When Design Standards Slip
1. **Quality Recovery**
   - [ ] Run whimsy-injector agent audit
   - [ ] Apply ui-designer standards
   - [ ] Validate with visual regression tests
   - [ ] Update design system documentation

## Success Metrics

### Technical Metrics
- **Build Success Rate**: >95%
- **Test Pass Rate**: >98%
- **Performance Score**: >90 (Lighthouse)
- **Security Score**: 0 critical vulnerabilities

### User Experience Metrics
- **Time to First Meaningful Paint**: <2s
- **Error Rate**: <1%
- **User Satisfaction**: >4.5/5 (if applicable)
- **Accessibility Score**: 100% compliance

## Continuous Improvement

### Weekly Reviews
- Analyze performance trends
- Review failed tests and fixes
- Update coding standards based on learnings
- Refine agent usage patterns

### Sprint Retrospectives
- Evaluate 6-day sprint effectiveness
- Identify process improvements
- Update best practices documentation
- Plan next sprint optimizations

---

*Remember: In the attention economy, boring is the only unforgivable sin. Every interaction should spark joy, every feature should perform flawlessly, and every sprint should deliver something users can't help but share.*