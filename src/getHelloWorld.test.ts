import getHelloWorld from "./getHelloWorld";

test('Is hello world', () => {
   expect(getHelloWorld()).toBe('Hello World');
});