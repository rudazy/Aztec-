// Wallet Setup Utilities for Aztec Dark Market
// Handles wallet creation for different environments

import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { Fr, deriveSigningKey } from '@aztec/aztec.js';
import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing';

/**
 * Create or retrieve wallet based on environment
 * @param {object} pxe - PXE client instance
 * @param {object} config - Configuration object
 * @param {string} privateKey - Optional private key (for devnet)
 * @returns {Promise<object>} Wallet instance
 */
export async function setupWallet(pxe, config, privateKey = null) {
    if (config.environment === 'local') {
        // For local sandbox, use test accounts
        const wallets = await getDeployedTestAccountsWallets(pxe);
        return wallets[0];
    } else {
        // For devnet, create Schnorr account from private key or environment variable
        const encryptionPrivateKey = privateKey || process.env.ENCRYPTION_PRIVATE_KEY;

        if (!encryptionPrivateKey) {
            throw new Error(
                'ENCRYPTION_PRIVATE_KEY not set. For devnet deployment, you need to provide a private key.\n' +
                'Set it in .env file or pass as environment variable.'
            );
        }

        const signingKey = deriveSigningKey(Fr.fromString(encryptionPrivateKey));
        const account = await getSchnorrAccount(
            pxe,
            Fr.fromString(encryptionPrivateKey),
            signingKey
        );

        // Check if account is already deployed
        const accountAddress = account.getAddress();
        const isDeployed = await pxe.isAccountStateSynchronized(accountAddress);

        if (!isDeployed) {
            console.log('📝 Deploying new account to devnet...');
            console.log(`   Address: ${accountAddress}`);
            await account.deploy().wait();
            console.log('✅ Account deployed successfully');
        } else {
            console.log('✅ Using existing account');
            console.log(`   Address: ${accountAddress}`);
        }

        return account.getWallet();
    }
}

/**
 * Get multiple wallets for testing
 * @param {object} pxe - PXE client instance
 * @param {object} config - Configuration object
 * @param {number} count - Number of wallets to retrieve
 * @returns {Promise<Array>} Array of wallet instances
 */
export async function getWallets(pxe, config, count = 3) {
    if (config.environment === 'local') {
        const wallets = await getDeployedTestAccountsWallets(pxe);
        return wallets.slice(0, count);
    } else {
        // For devnet, would need multiple private keys
        // For now, just return the main wallet
        const wallet = await setupWallet(pxe, config);
        return [wallet];
    }
}
