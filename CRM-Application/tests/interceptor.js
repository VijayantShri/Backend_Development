/**
 * To create a mock req and res object.
 */

module.exports = {
    /**
     * Here we have written the logic of create.
     * mock request and response
     */
    mockRequest: () => {        // Return the mock request.
        const req = {}
        req.body = jest.fn().mockReturnValue(req);
        req.params = jest.fn().mockReturnValue(req);
        return req;
    },
    mockResponse: () => {       // return the mock response.
        const res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        return res;
    }
}