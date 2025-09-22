/**
 * Decrypt a list of encrypted handles using the provided FHE instance and signature.
 *
 * @param fheInstance - The FHE instance used for decryption.
 * @param handles - Array of handle objects containing the encrypted handle and associated contract address.
 * @param sig - Signature and user authorization data required for decryption:
 *   @param sig.privateKey - User's private key for FHE decryption.
 *   @param sig.publicKey - User's public key.
 *   @param sig.signature - User's cryptographic signature.
 *   @param sig.contractAddresses - Allowed contract addresses.
 *   @param sig.userAddress - User's wallet address.
 *   @param sig.startTimestamp - Start time for the session validity.
 *   @param sig.durationDays - Duration of session validity in days.
 *
 * @returns A record mapping decrypted handle identifiers to their plaintext values.
 *
 * @throws Will log an error if any handle cannot be decrypted.
 */
export async function decryptHandles(
  fheInstance: any,
  handles: { handle: string; contractAddress: `0x${string}` }[],
  sig: {
    privateKey: string;
    publicKey: string;
    signature: string;
    contractAddresses: string[];
    userAddress: string;
    startTimestamp: number;
    durationDays: number;
  }
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const item of handles) {
    try {
      const decrypted = await fheInstance.userDecrypt(
        [item],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      Object.assign(results, decrypted);
    } catch (error) {
      console.error(`Failed to decrypt handle ${item.handle}`, error);
    }
  }

  return results;
}
