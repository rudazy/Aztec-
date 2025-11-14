// Wallet Setup Utilities for Aztec Dark Market
// Handles wallet creation for different environments

import { SchnorrAccountContract } from '@aztec/accounts/schnorr';
import { GrumpkinScalar } from '@aztec/foundation/fields';
import { AccountManager } from '@aztec/aztec.js/wallet';

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
    
    // Create signing key
    const signingKey = GrumpkinScalar.fromString(encryptionPrivateKey);
    
    // Create account contract
    const accountContract = new SchnorrAccountContract(signingKey);
    
    // Create account manager
    const accountManager = new AccountManager(pxe, accountContract);
    
    // Get or deploy account
    const wallet = await accountManager.getWallet();
    
    console.log('✅ Wallet ready');
    console.log(`   Address: ${wallet.getAddress()}`);

    return wallet;
}