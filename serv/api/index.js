const mysqldb = require("../lib/mysqldb.js");

module.exports = {
    '/' : (ctx) => {
        ctx.body = "this is index";
    },
    '/welcome' : async (ctx) => {
        const [data] = await mysqldb.execute("select linkurl from app_info", null);
        ctx.body = JSON.stringify(data);
    },
}