// Wallet Setup Utilities for Aztec Dark Market
// Handles wallet creation for different environments

import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { Fr, deriveSigningKey } from '@aztec/aztec.js';

/**
 * Create or retrieve wallet based on environment
 * @param {object} pxe - PXE client instance
 * @param {object} config - Configuration object
 * @param {string} privateKey - Optional private key (for devnet)
 * @returns {Promise<object>} Wallet instance
 */
export async function setupWallet(pxe, config, privateKey = null) {
    // For devnet, create Schnorr account from private key or environment variable
    const encryptionPrivateKey = privateKey || process.env.ENCRYPTION_PRIVATE_KEY;

    if (!encryptionPrivateKey) {
        throw new Error(
            'ENCRYPTION_PRIVATE_KEY not set. For devnet deployment, you need to provide a private key.\n' +
            'Set it in .env file or pass as environment variable.'
        );
    }

    const signingKey = deriveSigningKey(Fr.fromString(encryptionPrivateKey));
    const account = getSchnorrAccount(
        pxe,
        Fr.fromString(encryptionPrivateKey),
        signingKey
    );

    // Deploy account if needed
    await account.register();

    const wallet = await account.getWallet();
    console.log('✅ Wallet ready');
    console.log(`   Address: ${wallet.getAddress()}`);

    return wallet;
}
