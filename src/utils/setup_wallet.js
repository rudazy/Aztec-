// Wallet Setup Utilities for Aztec Dark Market
// Handles wallet creation for different environments

import { SchnorrAccountContract } from '@aztec/accounts/schnorr';
import { GrumpkinScalar } from '@aztec/foundation/fields';

/**
 * Create or retrieve wallet based on environment
 * @param {object} pxe - PXE client instance
 * @param {object} config - Configuration object
 * @param {string} privateKey - Optional private key (for devnet)
 * @returns {Promise<object>} Wallet instance
 */
export async function setupWallet(pxe, config, privateKey = null) {
    const encryptionPrivateKey = privateKey || process.env.ENCRYPTION_PRIVATE_KEY;

    if (!encryptionPrivateKey) {
        throw new Error(
            'ENCRYPTION_PRIVATE_KEY not set. For devnet deployment, you need to provide a private key.\n' +
            'Set it in .env file or pass as environment variable.'
        );
    }

    console.log('🔑 Creating Schnorr account...');
    
    // Create signing key from the encryption private key
    const signingKey = GrumpkinScalar.fromString(encryptionPrivateKey);
    
    // Create Schnorr account contract instance
    const account = new SchnorrAccountContract(signingKey);
    
    // Get wallet from the account
    const wallet = await account.getWallet(pxe);
    
    console.log('✅ Wallet ready');
    console.log(`   Address: ${wallet.getAddress()}`);

    return wallet;
}