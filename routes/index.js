const initializeRoutes = (app) => {
    app.use('/v1/user', require('./v1/user.routes'));
    app.use('/v1/subadmin', require('./v1/subAdmin.routes'));
    app.use('/v1/admin', require('./v1/admin.routes'));
};

module.exports = initializeRoutes;