
export class Utils {
    public static verifuint(value: number, max: number) {
        if (typeof value !== 'number') throw new Error('cannot write a non-number as a number')
        if (value < 0) throw new Error('specified a negative value for writing an unsigned value')
        if (value > max) throw new Error('RangeError: value out of range')
        if (Math.floor(value) !== value) throw new Error('value has a fractional component')
    }
    public static ToBytes(value: number, littleEndian: boolean): number[] {
        Utils.verifuint(value, 0x001fffffffffffff);
        if (littleEndian) {
            return [
            value & 0xFF,
            (value >> 8) & 0xFF,
            (value >> 16) & 0xFF,
            (value >> 24) & 0xFF,
            (value / Math.pow(2, 32)) & 0xFF,
            (value / Math.pow(2, 40)) & 0xFF,
            (value / Math.pow(2, 48)) & 0xFF,
            (value / Math.pow(2, 56)) & 0xFF];
        }
        else {
            return [
                (value / Math.pow(2, 56)) & 0xFF,
                (value / Math.pow(2, 48)) & 0xFF,
                (value / Math.pow(2, 40)) & 0xFF,
                (value / Math.pow(2, 32)) & 0xFF,
                (value >> 24) & 0xFF,
                (value >> 16) & 0xFF,
                (value >> 8) & 0xFF,
                value & 0xFF
            ];
        }
    }

    public static BufferToNumbers(buffer: Buffer): number[] {
        var ab : number[] = [];
        for (var i = 0; i < buffer.length; ++i) {
            ab[i] = buffer[i];
        }
        return ab;
    }
}