const koa = require("koa");
const koaRouter = require("@koa/router");
const Web3 = require("web3");
const NftPlayer = require("../build/contracts/NftHero.json");

const app = new koa();
const router = new koaRouter();

async function listen()
{
	const web3 = await new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('http://127.0.0.1:9545'));
	const nftContract = new web3.eth.Contract(
		NftPlayer.abi,
		NftPlayer.networks[9999].address.toLowerCase(),
	);
	nftContract.events.createCardEvent({}, function(error, event){
		console.log("get event", event);
	});
}

/*
app.use(async ctx => {
	ctx.body = "hello";
});
*/
router.get("/", ctx => {
	ctx.body = "body";
});
router.get("/t2", ctx => {
	ctx.body = "t2 body";
});
app.use(router.routes());

listen();

app.listen(3000, ()=>{
	console.log("server start");
});