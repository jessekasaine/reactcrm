const formatError = (error) => {
    return {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
};

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
    formatError,
    asyncHandler
};