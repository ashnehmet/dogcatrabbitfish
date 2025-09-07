// Sample test to verify Jest setup
describe('Jest Setup', () => {
  test('should run basic test', () => {
    expect(true).toBe(true);
  });

  test('should have access to test utils', () => {
    expect(global.testUtils).toBeDefined();
    expect(global.testUtils.mockEleventyData).toBeInstanceOf(Function);
  });

  test('should mock console methods', () => {
    console.log('test');
    expect(console.log).toHaveBeenCalledWith('test');
  });
});