// Deployment Script for Aztec Dark Market
// File: scripts/deploy.js

const { Contract, Fr, createPXEClient, waitForPXE } = require('@aztec/aztec.js');
const { getDeployedTestAccountsWallets } = require('@aztec/accounts/testing');

// Contract artifacts (generated after compilation)
const PrivateTokenArtifact = require('../target/private_token.json');
const PrivateEscrowArtifact = require('../target/private_escrow.json');
const PrivateOrderBookArtifact = require('../target/private_orderbook.json');

async function main() {
    console.log('🚀 Starting Aztec Dark Market Deployment...\n');

    // Connect to PXE (Private Execution Environment)
    const PXE_URL = process.env.PXE_URL || 'http://localhost:8080';
    console.log(`📡 Connecting to PXE at ${PXE_URL}...`);
    
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    console.log('✅ Connected to PXE\n');

    // Get deployment wallet
    const wallets = await getDeployedTestAccountsWallets(pxe);
    const deployer = wallets[0];
    console.log(`👛 Deployer address: ${deployer.getAddress()}\n`);

    // ==========================================
    // 1. Deploy Private Token Contract
    // ==========================================
    console.log('📝 Deploying Private Token Contract...');
    
    const tokenName = Fr.fromString('DarkToken');
    const tokenSymbol = Fr.fromString('DARK');
    const decimals = 18;
    const initialSupply = Fr.fromString('1000000000000000000000000'); // 1M tokens

    const privateToken = await Contract.deploy(
        deployer,
        PrivateTokenArtifact,
        [
            deployer.getAddress(),
            tokenName,
            tokenSymbol,
            decimals,
            initialSupply,
        ]
    ).send().deployed();

    console.log(`✅ Private Token deployed at: ${privateToken.address}`);
    console.log(`   Token: DarkToken (DARK)`);
    console.log(`   Initial Supply: 1,000,000 DARK\n`);

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
    // 4. Configure Contracts
    // ==========================================
    console.log('⚙️  Configuring contracts...');
    
    // Authorize OrderBook contract to use Escrow
    console.log('   Authorizing Order Book to use Escrow...');
    await privateEscrow.methods
        .authorize_contract(privateOrderBook.address)
        .send()
        .wait();
    
    console.log('✅ Order Book authorized\n');

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

    const fs = require('fs');
    fs.writeFileSync(
        'deployment-info.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('💾 Deployment info saved to deployment-info.json\n');
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:');
        console.error(error);
        process.exit(1);
    });