// Configuration Management for Aztec Dark Market
// Handles environment-specific settings for sandbox and devnet

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load configuration based on environment
 * @param {string} env - Environment name (sandbox or devnet)
 * @returns {object} Configuration object
 */
export function loadConfig(env = null) {
    // Determine environment from ENV variable or default to sandbox
    const environment = env || process.env.ENV || 'sandbox';

    const configPath = path.join(__dirname, '..', '..', 'config', `${environment}.json`);

    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    console.log(`📋 Loaded configuration: ${config.name} (${config.environment})`);

    return config;
}

/**
 * Get PXE (Private Execution Environment) URL from config
 * @param {object} config - Configuration object
 * @returns {string} PXE URL
 */
export function getPXEUrl(config) {
    return config.network.nodeUrl;
}

/**
 * Get L1 RPC URL from config
 * @param {object} config - Configuration object
 * @returns {string} L1 RPC URL
 */
export function getL1RpcUrl(config) {
    return config.network.l1RpcUrl;
}

/**
 * Get deployment timeout from config
 * @param {object} config - Configuration object
 * @returns {number} Timeout in milliseconds
 */
export function getDeployTimeout(config) {
    return config.timeouts.deployTimeout;
}

/**
 * Get transaction timeout from config
 * @param {object} config - Configuration object
 * @returns {number} Timeout in milliseconds
 */
export function getTxTimeout(config) {
    return config.timeouts.txTimeout;
}

/**
 * Get wait timeout from config
 * @param {object} config - Configuration object
 * @returns {number} Timeout in milliseconds
 */
export function getWaitTimeout(config) {
    return config.timeouts.waitTimeout;
}

/**
 * Check if running on devnet
 * @param {object} config - Configuration object
 * @returns {boolean} True if devnet
 */
export function isDevnet(config) {
    return config.environment === 'devnet';
}

/**
 * Check if running locally
 * @param {object} config - Configuration object
 * @returns {boolean} True if local
 */
export function isLocal(config) {
    return config.environment === 'local';
}
