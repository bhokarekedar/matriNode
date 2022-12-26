const usersRouter = require('./users.route');
const authRouter = require('./auth.route');

const routes = [
{
    path: "/v1/users",
    router: usersRouter
},
{
    path: "/v1/auth",
    router: authRouter
}
]

module.exports = routes;