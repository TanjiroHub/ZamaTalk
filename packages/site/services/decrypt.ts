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
        handles,
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

/**
 * Decrypt a single encrypted handle using the provided FHE instance and signature.
 *
 * This function wraps the FHE decryption for a single handle. It takes the encrypted handle
 * along with its associated contract address, calls `fheInstance.userDecrypt`, and returns
 * the plaintext string if decryption succeeds.
 *
 * @param {any} fheInstance - The FHE instance used for decryption.
 * @param {{ handle: string; contractAddress: `0x${string}` }} encryptedHandle - 
 *        The object containing the encrypted handle and the contract address.
 * @param {Object} sig - Signature and user authorization data required for decryption.
 * @param {string} sig.privateKey - User's private key for FHE decryption.
 * @param {string} sig.publicKey - User's public key.
 * @param {string} sig.signature - User's cryptographic signature.
 * @param {string[]} sig.contractAddresses - Allowed contract addresses for decryption.
 * @param {string} sig.userAddress - User's wallet address.
 * @param {number} sig.startTimestamp - Start time for session validity (Unix timestamp).
 * @param {number} sig.durationDays - Duration of session validity in days.
 *
 * @returns {Promise<string | null>} The decrypted plaintext string, or null if decryption fails.
 *
 * @throws Will log an error if the handle cannot be decrypted.
 */
export async function decryptHandle(
  fheInstance: any,
  encryptedHandle: { handle: string; contractAddress: `0x${string}` },
  sig: {
    privateKey: string;
    publicKey: string;
    signature: string;
    contractAddresses: string[];
    userAddress: string;
    startTimestamp: number;
    durationDays: number;
  }
): Promise<string | null> {
  try {
    const decrypted = await fheInstance.userDecrypt(
      [encryptedHandle],
      sig.privateKey,
      sig.publicKey,
      sig.signature,
      sig.contractAddresses,
      sig.userAddress,
      sig.startTimestamp,
      sig.durationDays
    );

    const firstKey = Object.keys(decrypted)[0];
    return firstKey ? decrypted[firstKey] : null;
  } catch (error) {
    console.error(`Failed to decrypt handle ${encryptedHandle.handle}`, error);
    return null;
  }
}
