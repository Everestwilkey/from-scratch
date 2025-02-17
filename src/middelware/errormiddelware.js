// errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on our end. Please try again later.';

    res.status(statusCode).render('partials/error', {
        statusCode,
        title: 'An Error Occurred',
        message,
        stylesheets: ['error']
    });
};