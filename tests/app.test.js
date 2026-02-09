const { add } = require('../src/app');

test('adds two numbers correctly', () => {
  expect(add(2, 3)).toBe(6);
});
