import { Encoders } from "./Encoders";
import { Utils } from "./Utils";
import * as elliptic from "elliptic";
import * as crypto from "crypto";

var secp256r1: any = new elliptic.ec('p256');
export class U2FPubKey {
    private pubKey: any;
    public constructor(hex: string);
    public constructor(pubKey: any) {
        if (typeof pubKey == 'string')
            this.pubKey = secp256r1.keyFromPublic(pubKey, 'hex').getPublic();
        else
            this.pubKey = pubKey;
    }

    public toString(): string {
        return this.pubKey.encode('hex');
    }
}

export class U2FKey {

    static initialize() {
        secp256r1 = new elliptic.ec('p256');
    }

    private privKey: any;
    public constructor(hex?: string) {
        if (hex == null) {
            this.privKey = secp256r1.genKeyPair();
        }
        else {
            this.privKey = secp256r1.keyFromPrivate(hex, 'hex');
        }
    }

    private _pubKey: U2FPubKey
    get pubKey(): U2FPubKey {
        if (this._pubKey == null)
            this._pubKey = new U2FPubKey(this.privKey.getPublic());
        return this._pubKey;
    }

    public Sign(data: string): string {
        var hash = Encoders.Hex.EncodeData(Utils.BufferToNumbers(crypto.createHash('sha256').update(new Buffer(data, 'hex')).digest()));
        var sig = secp256r1.sign(hash, this.toString(), "hex");
        return sig.toDER("hex");
    }

    public toString(): string {
        var str: string = this.privKey.priv.toString('hex');
        //Left Pad        
        while (str.length < 32 * 2)
            str = "0" + str;
        return str;
    }
}

