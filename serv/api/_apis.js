const koaRouter = require("@koa/router");
const router = new koaRouter();

function register(_module) {
    for (let _path in _module) {
        router.get(_path, _module[_path]);
    }
}

register(require("./index.js"));

module.exports = router;