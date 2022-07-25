/**
 * Write any test
 */

test('First test block', () => {
    // Write the logic to be tested.
    console.log("Hello Students");
});

function add(a, b) {
    return a + b;
}

test('Testing the output of add function', () => {
    expect(add(3, 4)).toBe(7);
});

test("testing two objects", () => {
    const obj = {
        name: "Vijayant",
        age: 23
    };

    expect(obj).toEqual({
        name: "Vijayant",
        age: 23
    });
});

test("testing null", () => {
    let n = null;
    let a = undefined;
    let b = 7;

    expect(n).toBeNull();
    expect(a).toBeUndefined();
    expect(b).toBeDefined();

    /**
     * toBeGreaterThan()
     * toBeLessThan()
     * toBeLessThanOrEqual()
     * toBeGreaterThanOrEqual()
     */
});