const usersRouter = require('./users.route');
const authRouter = require('./auth.route');

const routes = [
{
    path: "/v1/users",
    router: usersRouter
},
{
    path: "/auth",
    router: authRouter
}
]

module.exports = routes;