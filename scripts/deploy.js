import 'dotenv/config';

// Deployment Script for Aztec Dark Market - Fixed for v3.0.0-devnet.4
// File: scripts/deploy.js

import { createSafeJsonRpcClient } from '@aztec/foundation/json-rpc/client';
import { Contract } from '@aztec/aztec.js/contracts';
import { Fr } from '@aztec/aztec.js/fields';
import { loadConfig, getPXEUrl, isDevnet } from '../src/utils/config.js';
import { setupWallet } from '../src/utils/setup_wallet.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contract artifacts (generated after compilation)
let PrivateTokenArtifact, PrivateEscrowArtifact, PrivateOrderBookArtifact;
try {
    PrivateTokenArtifact = JSON.parse(fs.readFileSync(path.join(__dirname, '../target/private_token-Token.json'), 'utf8'));
    PrivateEscrowArtifact = JSON.parse(fs.readFileSync(path.join(__dirname, '../target/private_escrow-PrivateEscrow.json'), 'utf8'));
    PrivateOrderBookArtifact = JSON.parse(fs.readFileSync(path.join(__dirname, '../target/private_orderbook-PrivateOrderBook.json'), 'utf8'));
} catch (error) {
    console.error('❌ Contract artifacts not found!');
    console.error('   Run "npm run compile" first to compile the contracts.');
    console.error('   Error:', error.message);
    process.exit(1);
}

async function main() {
    console.log('🚀 Starting Aztec Dark Market Deployment...\n');

    // Load environment configuration
    const config = loadConfig();
    const PXE_URL = getPXEUrl(config);

    console.log(`🌍 Environment: ${config.name}`);
    console.log(`🔗 Connecting to PXE at ${PXE_URL}...`);

    // Create PXE client without schema (v3.0.0-devnet.4)
    const pxe = createSafeJsonRpcClient(PXE_URL, {}, {
        namespaceMethods: false
    });

    console.log('⏳ Connecting to devnet PXE...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Connected to PXE\n');

    // Get deployment wallet
    const deployer = await setupWallet(pxe, config);
    console.log(`💼 Deployer address: ${deployer.getAddress()}\n`);

    // Deploy Private Token Contract
    console.log('📝 Deploying Private Token Contract...');
    const initialSupply = 1000000;

    const privateToken = await Contract.deploy(
        deployer,
        PrivateTokenArtifact,
        [deployer.getAddress(), initialSupply]
    ).send().deployed();

    console.log(`✅ Private Token deployed at: ${privateToken.address}`);
    console.log(`   Initial Supply: ${initialSupply} tokens\n`);

    // Deploy Private Escrow Contract
    console.log('📝 Deploying Private Escrow Contract...');
    const privateEscrow = await Contract.deploy(
        deployer,
        PrivateEscrowArtifact,
        [deployer.getAddress()]
    ).send().deployed();

    console.log(`✅ Private Escrow deployed at: ${privateEscrow.address}\n`);

    // Deploy Private Order Book Contract
    console.log('📝 Deploying Private Order Book Contract...');
    const privateOrderBook = await Contract.deploy(
        deployer,
        PrivateOrderBookArtifact,
        [deployer.getAddress()]
    ).send().deployed();

    console.log(`✅ Private Order Book deployed at: ${privateOrderBook.address}\n`);

    // Summary
    console.log('🎉 Deployment Complete!\n');
    console.log('='.repeat(60));
    console.log('Contract Addresses:');
    console.log('='.repeat(60));
    console.log(`Private Token:      ${privateToken.address}`);
    console.log(`Private Escrow:     ${privateEscrow.address}`);
    console.log(`Private Order Book: ${privateOrderBook.address}`);
    console.log('='.repeat(60));
    console.log('\n📝 Save these addresses for frontend integration!\n');

    // Save deployment info
    const deploymentInfo = {
        environment: config.name,
        network: PXE_URL,
        deployer: deployer.getAddress().toString(),
        timestamp: new Date().toISOString(),
        contracts: {
            privateToken: {
                address: privateToken.address.toString(),
                name: 'DarkToken',
                symbol: 'DARK',
                decimals: 18,
            },
            privateEscrow: {
                address: privateEscrow.address.toString(),
            },
            privateOrderBook: {
                address: privateOrderBook.address.toString(),
            },
        },
    };

    const deploymentFileName = config.environment === 'devnet'
        ? 'deployment-devnet.json'
        : 'deployment-info.json';

    fs.writeFileSync(
        deploymentFileName,
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`💾 Deployment info saved to ${deploymentFileName}\n`);

    if (isDevnet(config)) {
        console.log('🌐 DEVNET DEPLOYMENT SUCCESSFUL!');
        console.log('='.repeat(60));
        console.log('Share these addresses for testing:');
        console.log(`Private Token:      ${privateToken.address}`);
        console.log(`Private Escrow:     ${privateEscrow.address}`);
        console.log(`Private Order Book: ${privateOrderBook.address}`);
        console.log('='.repeat(60));
        console.log('\n🔍 Devnet Explorer: https://devnet.aztec-labs.com/');
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:');
        console.error(error);
        process.exit(1);
    });