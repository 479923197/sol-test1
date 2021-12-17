const koa = require("koa");
const app = new koa();

//api注册
app.use(require("./api/_apis.js").routes());
//监听事件
require("./event/_events.js")();

app.listen(3002, ()=>{
	console.log("server start");
});