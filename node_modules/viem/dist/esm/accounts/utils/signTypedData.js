import { hashTypedData, } from '../../utils/signature/hashTypedData.js';
import { sign } from './sign.js';
import { signatureToHex } from './signatureToHex.js';
/**
 * @description Signs typed data and calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @returns The signature.
 */
export async function signTypedData({ privateKey, ...typedData }) {
    const signature = await sign({
        hash: hashTypedData(typedData),
        privateKey,
    });
    return signatureToHex(signature);
}
//# sourceMappingURL=signTypedData.js.map