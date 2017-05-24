import { U2FKey } from "./U2FKey";
import { Encoders } from "./Encoders";
import { Utils } from "./Utils";
import * as crypto from 'crypto';

export class PostOrderRequest {
    public baseCurrency: string;
    public customReference: string;
    public requesterPubKey: string;
    public destination: string;
    public amount: number;
    public nonce: number = 0;
    public signature: string;

    public Sign(key: U2FKey) {
        if (this.nonce == 0) {
            //Approximate now in gateway time
            var now = new Date();
            var nowSec = Math.round(now.getTime() / 1000);
            this.nonce = (nowSec * Math.pow(2, 10)) + now.getUTCMilliseconds();
        }
        this.requesterPubKey = key.pubKey.toString();
        this.signature = key.Sign(this.GetDataToSign());
    }

    public GetDataToSign(): string {
        //Decode base58
        var addrBytes = Encoders.Base58Check.DecodeData(this.destination);
        var isP2SH = addrBytes[0] == 5 || addrBytes[0] == 196;
        var isP2PKH = addrBytes[0] == 0 || addrBytes[0] == 111;

        if((!isP2PKH && !isP2SH) || addrBytes.length != 21)
            throw "Invalid-Format";
        //Skip first byte
        addrBytes = addrBytes.slice(1, 21);

        var dataStr =
            //(nonce in big endian, 8 bytes)
            Encoders.Hex.EncodeData(Utils.ToBytes(this.nonce, false)) +
            //(amount in little endian, 8 bytes)
            Encoders.Hex.EncodeData(Utils.ToBytes(this.amount, true)) +
            (isP2SH ? "17a914" : "1976a914") +
            Encoders.Hex.EncodeData(addrBytes) +
            (isP2SH ? "87" : "88ac");
        var hash = crypto.createHash("sha256").update(new Buffer(dataStr, 'hex')).digest();
        var hashNumbers = Utils.BufferToNumbers(hash);

        dataStr = "7694fdd54949ba51af148c7531e11d2eaeb51371187ef65e1afae20a20ab6e6e0100000001" +
            Encoders.Hex.EncodeData(hashNumbers);
        return dataStr;
    }
}