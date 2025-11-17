// Wallet Setup Utilities for Aztec Dark Market
// Handles wallet creation for different environments

import { SchnorrAccountContract } from '@aztec/accounts/schnorr';
import { Fr, GrumpkinScalar } from '@aztec/foundation/fields';

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

    console.log('🔑 Creating Schnorr account from private key...');
    
    // Parse the private key as signing key
    const signingKey = GrumpkinScalar.fromString(encryptionPrivateKey);
    
    // Create Schnorr account contract
    const accountContract = new SchnorrAccountContract(signingKey);
    
    // Get the account interface which can interact with PXE
    const completeAddress = await accountContract.getCompleteAddress(pxe);
    const accountInterface = accountContract.getInterface(completeAddress, { chainId: Fr.ZERO, version: Fr.ZERO });
    
    console.log('✅ Wallet ready');
    console.log(`   Address: ${completeAddress.address}`);

    // Return a simple wallet object
    return {
        getAddress: () => completeAddress.address,
        ...accountInterface
    };
}