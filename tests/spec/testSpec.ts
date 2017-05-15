import { Encoders, U2FKey, U2FPubKey, PostOrderRequest, ApiClient } from "../../lib/gwmtc";
import * as elliptic from "elliptic";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
describe("Global", () => {
    it("Can generate private and public keys", () => {
        for (var i = 0; i < 300; i++) {
            var k1 = new U2FKey();
            expect(k1.toString().length == 32 * 2).toBeTruthy();
            expect(k1.pubKey.toString().length == 65 * 2).toBeTruthy();
            expect(new U2FPubKey(k1.pubKey.toString()).toString()).toEqual(k1.pubKey.toString());
            expect(new U2FKey(k1.toString()).pubKey.toString()).toEqual(k1.pubKey.toString());
        }
    });

    it("Can parse private and public keys", () => {
        var k1 = new U2FKey("a063c148c9de8a77fd47a8504cf88021927672ddbeaf86dea261b6f3e4d781d9");
        var k2 = new U2FPubKey("0453c197a5c988cf408d600777c670819044f61be18f99460283b7cb5725be5c89dd12b75c99f8fff0bad2cdaac122e8b95113ee3f60a776dede5125824ae54e0b");
        expect(k2.toString().length == 65 * 2).toBeTruthy();
        expect(k1.toString().length == 32 * 2).toBeTruthy();
        expect(k1.toString()).toEqual("a063c148c9de8a77fd47a8504cf88021927672ddbeaf86dea261b6f3e4d781d9");
        expect(k2.toString()).toEqual("0453c197a5c988cf408d600777c670819044f61be18f99460283b7cb5725be5c89dd12b75c99f8fff0bad2cdaac122e8b95113ee3f60a776dede5125824ae54e0b");
    });

    it("Can convert hex back and forth", () => {
        expect(Encoders.Hex.EncodeData([0x0, 0x1, 0x15, 0xab])).toEqual("000115ab");
        expect(Encoders.Hex.DecodeData("000115ab")).toEqual([0x0, 0x1, 0x15, 0xab]);

        expect(Encoders.Hex.EncodeData([0x00, 0x08, 0x6e, 0xaa, 0x67, 0x78, 0x95, 0xf9, 0x2d, 0x4a, 0x6c, 0x5e, 0xf7, 0x40, 0xc1, 0x68, 0x93, 0x2b, 0x5e, 0x3f, 0x44])).toEqual("00086eaa677895f92d4a6c5ef740c168932b5e3f44");
    });

    it("Can convert base58 back and forth", () => {
        expect(Encoders.Base58Check.EncodeData([0x00, 0x08, 0x6e, 0xaa, 0x67, 0x78, 0x95, 0xf9, 0x2d, 0x4a, 0x6c, 0x5e, 0xf7, 0x40, 0xc1, 0x68, 0x93, 0x2b, 0x5e, 0x3f, 0x44])).toEqual("1mayif3H2JDC62S4N3rLNtBNRAiUUP99k");
        expect(Encoders.Base58Check.DecodeData("1mayif3H2JDC62S4N3rLNtBNRAiUUP99k")).toEqual([0x00, 0x08, 0x6e, 0xaa, 0x67, 0x78, 0x95, 0xf9, 0x2d, 0x4a, 0x6c, 0x5e, 0xf7, 0x40, 0xc1, 0x68, 0x93, 0x2b, 0x5e, 0x3f, 0x44]);
    });

    it("Can convert base58 back and forth", () => {
        expect(Encoders.Base58Check.EncodeData([0x00, 0x08, 0x6e, 0xaa, 0x67, 0x78, 0x95, 0xf9, 0x2d, 0x4a, 0x6c, 0x5e, 0xf7, 0x40, 0xc1, 0x68, 0x93, 0x2b, 0x5e, 0x3f, 0x44])).toEqual("1mayif3H2JDC62S4N3rLNtBNRAiUUP99k");
        expect(Encoders.Base58Check.DecodeData("1mayif3H2JDC62S4N3rLNtBNRAiUUP99k")).toEqual([0x00, 0x08, 0x6e, 0xaa, 0x67, 0x78, 0x95, 0xf9, 0x2d, 0x4a, 0x6c, 0x5e, 0xf7, 0x40, 0xc1, 0x68, 0x93, 0x2b, 0x5e, 0x3f, 0x44]);
    });

    it("Can Sign request", () => {
        var signer = new U2FKey('26767c0e98fbdc8e1647ab5f83a473abc88096279758aebeb6d3d464963286c8');

        var order: PostOrderRequest = new PostOrderRequest();
        order.baseCurrency = "CHF";
        order.customReference = "order_chf_btc_1492782718";
        order.nonce = 0x163DBE788E9;
        order.destination = 'mh653rQbnj5LF6Hb4eLK1q3SeELCgfabAg';
        order.amount = 0x186A0;
        var data = order.GetDataToSign();
        expect(data).toEqual("7694fdd54949ba51af148c7531e11d2eaeb51371187ef65e1afae20a20ab6e6e01000000017afc4dc640c01519b7fae38b01e14625e6abb8d44f5f532516987fa92d4a66c9");
        var sig = signer.Sign(data);
        expect(sig).toEqual("30450220321281c8c9b8cf8661def0e459767b2ca3e89b1fad796ddcee8ddf55beca3032022100f0f77f63b03070af6d26885945089da461c3dd3edcfbdc99e051a1cfcba6fb47");

        order.nonce = 0;
        order.requesterPubKey = "";
        order.signature = "";
        order.Sign(signer);

        expect(order.nonce).not.toEqual(0);
        expect(order.signature).not.toBeNull();
        expect(order.requesterPubKey).not.toEqual("");
    });

    if (XMLHttpRequest != null) {
        it("Can send request to gateway", async (done) => {
            var api = new ApiClient("https://api.gateway.metaco.com/v1/tbtc", "abcdefg");
            var signer = new U2FKey('26767c0e98fbdc8e1647ab5f83a473abc88096279758aebeb6d3d464963286c8');
            var order: PostOrderRequest = new PostOrderRequest();
            order.baseCurrency = "CHF";
            order.customReference = "order_chf_btc_1492782718";
            order.nonce = 0x163DBE788E9;
            order.destination = 'mh653rQbnj5LF6Hb4eLK1q3SeELCgfabAg';
            order.amount = 0x186A0;
            order.Sign(signer);
            var response = await api.PostOrder(order);
            expect(response.customReference).toEqual("order_chf_btc_1492782718");
            expect(response.orderId).not.toBeNull();

            var info;
            while (true) {
                info = await api.GetOrder(response.orderId);
                if (info.state != "Requested")
                    break;
            }
            expect(info.errorCode).toEqual("invalid-nonce");
            done();
        });
    }
});