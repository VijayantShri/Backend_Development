/**
 * Testing async code
 */

function fetchData (callback) {
    setTimeout(() => {
        callback("Vijayant")
    }, 2000);
}

/**
test("testing this call back function", () => {
    function callback(data) {
        expect(data).toBe("Vijayant");
    }
    fetchData(callback)
});
*/

test("testing this call back function", (done) => {
    try {
        function callback(data) {
            expect(data).toBe("Rahul");
            done(); // Until this line is called... test will wait.
        }
    } catch (except) {
        done(err);
    }
    fetchData(callback)
});

/**
 * 1. Fetchback expects a callback function
 * 2. Callback function should have 1 argument
 * 3. If we execute this function by passing callback fn after 2 seconds, call back function will be called
 * with the argument Vijayant
 */