import * as base58check from "base58check";

export interface Encoder {
    EncodeData(arr: number[]): string;
    DecodeData(str: string): number[];
}

class HexEncoder implements Encoder {
    public EncodeData(arr: number[]): string {
        return arr.map(function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    public DecodeData(str: string): number[] {
        var result = [];
        var index: number = 0;
        for (index = 0; index < str.length - 1; index += 2) {

            result.push(parseInt(str.substring(index, index + 2), 16));
        }
        return result;
    }
}

class Base58Encoder implements Encoder {
    public EncodeData(arr: number[]): string {
        return base58check.encode(Encoders.Hex.EncodeData(arr), '');
    }

    public DecodeData(str: string): number[] {
        
        var result = base58check.decode(str, 'hex');
        return Encoders.Hex.DecodeData(result.prefix + result.data);
    }
}

export class Encoders {
    public static Hex: Encoder = new HexEncoder();
    public static Base58Check: Encoder = new Base58Encoder();
}