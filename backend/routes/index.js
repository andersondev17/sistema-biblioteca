// routes/index.js
const { authenticate } = require("../middlewares/auth.middleware");

const API_PREFIX = "/api/v1";

const routeConfig = [
    { path: "/auth", handler: require("./auth.routes.js") },
    { path: "/users", handler: require("./user.routes.js"), protected: true },
    { path: "/authors", handler: require("./author.routes.js")},
    { path: "/books", handler: require("./book.routes.js") },
    { path: "/reports", handler: require("./report.routes.js"), protected: true }
];

exports.setupRoutes = (app) => {
    routeConfig.forEach(({ path, handler, protected }) => {
        const middleware = protected ? [authenticate] : [];
        app.use(`${API_PREFIX}${path}`, ...middleware, handler);
    });
};