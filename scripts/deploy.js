// Deployment Script for Aztec Dark Market
// File: scripts/deploy.js

import { Contract, Fr, createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { loadConfig, getPXEUrl, isDevnet } from '../src/utils/config.js';
import { setupWallet } from '../src/utils/setup_wallet.js';
import fs from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

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
    console.log(`📡 Connecting to PXE at ${PXE_URL}...`);

    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    console.log('✅ Connected to PXE\n');

    // Get deployment wallet (handles both sandbox and devnet)
    const deployer = await setupWallet(pxe, config);
    console.log(`👛 Deployer address: ${deployer.getAddress()}\n`);

    // ==========================================
    // 1. Deploy Private Token Contract
    // ==========================================
    console.log('📝 Deploying Private Token Contract...');

    const initialSupply = 1000000; // 1M tokens

    const privateToken = await Contract.deploy(
        deployer,
        PrivateTokenArtifact,
        [
            deployer.getAddress(),
            initialSupply,
        ]
    ).send().deployed();

    console.log(`✅ Private Token deployed at: ${privateToken.address}`);
    console.log(`   Token: DarkToken`);
    console.log(`   Initial Supply: ${initialSupply} tokens\n`);

    // ==========================================
    // 2. Deploy Private Escrow Contract
    // ==========================================
    console.log('📝 Deploying Private Escrow Contract...');
    
    const privateEscrow = await Contract.deploy(
        deployer,
        PrivateEscrowArtifact,
        [deployer.getAddress()]
    ).send().deployed();

    console.log(`✅ Private Escrow deployed at: ${privateEscrow.address}\n`);

    // ==========================================
    // 3. Deploy Private Order Book Contract
    // ==========================================
    console.log('📝 Deploying Private Order Book Contract...');
    
    const privateOrderBook = await Contract.deploy(
        deployer,
        PrivateOrderBookArtifact,
        [deployer.getAddress()]
    ).send().deployed();

    console.log(`✅ Private Order Book deployed at: ${privateOrderBook.address}\n`);

    // ==========================================
    // 4. Configuration (simplified for initial deployment)
    // ==========================================
    console.log('⚙️  Contracts deployed and ready\n');

    // ==========================================
    // 5. Summary
    // ==========================================
    console.log('🎉 Deployment Complete!\n');
    console.log('='.repeat(60));
    console.log('Contract Addresses:');
    console.log('='.repeat(60));
    console.log(`Private Token:      ${privateToken.address}`);
    console.log(`Private Escrow:     ${privateEscrow.address}`);
    console.log(`Private Order Book: ${privateOrderBook.address}`);
    console.log('='.repeat(60));
    console.log('\n📋 Save these addresses for frontend integration!\n');

    // Save deployment info to file
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

    // Save to environment-specific file
    const deploymentFileName = config.environment === 'devnet'
        ? 'deployment-devnet.json'
        : 'deployment-info.json';

    fs.writeFileSync(
        deploymentFileName,
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`💾 Deployment info saved to ${deploymentFileName}\n`);

    // If devnet, also display important information
    if (isDevnet(config)) {
        console.log('🌐 DEVNET DEPLOYMENT SUCCESSFUL!');
        console.log('='.repeat(60));
        console.log('Share these addresses for testing:');
        console.log(`Private Token:      ${privateToken.address}`);
        console.log(`Private Escrow:     ${privateEscrow.address}`);
        console.log(`Private Order Book: ${privateOrderBook.address}`);
        console.log('='.repeat(60));
        console.log('\n🔗 Devnet Explorer: https://devnet.aztec-labs.com/');
    }
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:');
        console.error(error);
        process.exit(1);
    });