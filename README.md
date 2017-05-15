# Metaco Gateway Javascript Client

This project show a javascript client for the Metaco Gateway API for Bitcoin.
The REST API is documented on [apiary](http://docs.gateway20.apiary.io/#).

# How to use

Include [gwmtc.js](https://aois.blob.core.windows.net/public/gwmtc.js) in your page, you can then access gwmtc.


```
var api = new gwmtc.ApiClient("https://api.gateway.metaco.com/v1/tbtc", "abcdefg");
var signer = new gwmtc.U2FKey('26767c0e98fbdc8e1647ab5f83a473abc88096279758aebeb6d3d464963286c8');
var order = new gwmtc.PostOrderRequest();
order.baseCurrency = "CHF";
order.customReference = "order_chf_btc_1492782718";
order.nonce = 0x163DBE788E9;
order.destination = 'mh653rQbnj5LF6Hb4eLK1q3SeELCgfabAg';
order.amount = 0x186A0;
order.Sign(signer);
var response = await api.PostOrder(order);

while (true) {
    info = await api.GetOrder(response.orderId);
    if (info.state != "Requested")
        break;
}
```
`ApiClient` functions returns promise. If you do not have access to async/await, use `done(callback)` as specified by [promisejs](https://www.promisejs.org/).

# How to Build?

```
git clone https://github.com/MetacoSA/Metaco.Gateway.JS
cd Metaco.Gateway.JS
npm install
```

You can then build with

```
npm run build_browser
```

It will produce `dist/gwmtc.js`.

You can build for NodeJS with

```
npm run build
```

You can debug the jasmine tests with Visual Studio Code by pressing F5.
