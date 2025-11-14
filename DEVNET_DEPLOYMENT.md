# Aztec Dark Market - Devnet Deployment Guide

## Overview

This project now supports deploying to the Aztec Devnet, allowing users to test the dark market contracts on a live network! This guide will walk you through the complete deployment process.

## What's New

- **Environment-based configuration**: Separate configs for sandbox and devnet
- **Devnet deployment scripts**: Deploy with `npm run deploy::devnet`
- **Account management**: Automatic account creation and management for devnet
- **Updated dependencies**: Using Aztec `v3.0.0-devnet.4`

## Prerequisites

### 1. Install Noir/Nargo

The contracts need to be compiled with Nargo (Noir compiler) version compatible with Aztec v3.0.0-devnet.4.

**On Linux/macOS:**
```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
source ~/.bashrc
noirup
```

**On Windows:**
Use WSL (Windows Subsystem for Linux) or download Nargo directly from:
https://github.com/noir-lang/noir/releases

For WSL:
```bash
wsl
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
source ~/.bashrc
noirup
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

For devnet deployment, you need an encryption private key. Generate one or use an existing Aztec-compatible key:

```bash
# .env file
ENV=devnet
ENCRYPTION_PRIVATE_KEY=0x... # Your private key here
```

**⚠️ SECURITY WARNING**: Never commit your `.env` file with real keys!

## Compilation

### Compile Contracts

```bash
npm run compile
```

This will compile all three contracts:
- Private Token Contract
- Private Escrow Contract
- Private Order Book Contract

### Generate TypeScript Bindings

```bash
npm run codegen
```

This creates TypeScript artifacts in `src/artifacts/` for easier contract interaction.

## Deployment

### Deploy to Sandbox (Local)

First, ensure you have a local Aztec sandbox running:

```bash
# In a separate terminal
aztec start --sandbox
```

Then deploy:

```bash
npm run deploy
```

### Deploy to Devnet 🌐

Deploy to the Aztec devnet:

```bash
npm run deploy::devnet
```

This will:
1. Load devnet configuration from `config/devnet.json`
2. Connect to `https://devnet.aztec-labs.com/`
3. Create or use existing account from your private key
4. Deploy all three contracts
5. Configure contract authorizations
6. Save deployment info to `deployment-devnet.json`

**Example Output:**
```
🚀 Starting Aztec Dark Market Deployment...

📋 Loaded configuration: devnet (devnet)
📡 Connecting to PXE at https://devnet.aztec-labs.com/...
✅ Connected to PXE

✅ Using existing account
   Address: 0x...

📝 Deploying Private Token Contract...
✅ Private Token deployed at: 0x...
   Token: DarkToken (DARK)
   Initial Supply: 1,000,000 DARK

📝 Deploying Private Escrow Contract...
✅ Private Escrow deployed at: 0x...

📝 Deploying Private Order Book Contract...
✅ Private Order Book deployed at: 0x...

⚙️  Configuring contracts...
✅ Order Book authorized

🎉 Deployment Complete!

🌐 DEVNET DEPLOYMENT SUCCESSFUL!
============================================================
Share these addresses for testing:
Private Token:      0x...
Private Escrow:     0x...
Private Order Book: 0x...
============================================================

🔗 Devnet Explorer: https://devnet.aztec-labs.com/
```

## Interacting with Deployed Contracts

### On Sandbox

```bash
npm run interact
```

### On Devnet

```bash
npm run interact::devnet
```

This will run demonstration scripts showing:
- Token balance queries
- Private token transfers
- Private order placement
- Escrow locking
- Public statistics viewing

## Configuration Files

### `config/sandbox.json`
```json
{
  "name": "sandbox",
  "environment": "local",
  "network": {
    "nodeUrl": "http://localhost:8080",
    "l1RpcUrl": "http://localhost:8545",
    "l1ChainId": 31337
  },
  "settings": {
    "skipSandbox": false,
    "version": "3.0.0-devnet.4"
  },
  "timeouts": {
    "deployTimeout": 120000,
    "txTimeout": 60000,
    "waitTimeout": 30000
  }
}
```

### `config/devnet.json`
```json
{
  "name": "devnet",
  "environment": "devnet",
  "network": {
    "nodeUrl": "https://devnet.aztec-labs.com/",
    "l1RpcUrl": "https://ethereum-sepolia-rpc.publicnode.com",
    "l1ChainId": 11155111
  },
  "settings": {
    "skipSandbox": true,
    "version": "3.0.0-devnet.4"
  },
  "timeouts": {
    "deployTimeout": 1200000,
    "txTimeout": 180000,
    "waitTimeout": 60000
  }
}
```

## Architecture

### Environment-Based Configuration

The project uses a configuration system that automatically loads the appropriate settings based on the `ENV` environment variable:

- `ENV=sandbox` (default): Local development
- `ENV=devnet`: Devnet deployment

### Utility Functions

#### `src/utils/config.js`
- `loadConfig()`: Load environment-specific configuration
- `getPXEUrl(config)`: Get PXE URL for the environment
- `isDevnet(config)`: Check if running on devnet
- Helper functions for timeouts and settings

#### `src/utils/setup_wallet.js`
- `setupWallet(pxe, config)`: Create wallet for the environment
- `getWallets(pxe, config, count)`: Get multiple wallets for testing

## Troubleshooting

### "aztec-nargo: command not found"

Install Nargo as described in Prerequisites.

### "ENCRYPTION_PRIVATE_KEY not set"

Create a `.env` file with your private key for devnet deployment.

### Compilation Errors

Ensure you're using a Nargo version compatible with Aztec v3.0.0-devnet.4:

```bash
nargo --version
```

### Deployment Timeout

Devnet deployments can take longer. The configuration uses extended timeouts (20 minutes for deployment, 3 minutes for transactions).

## Security Best Practices

1. **Never commit private keys**: `.env` is in `.gitignore`
2. **Use separate keys**: Use different keys for devnet testing vs mainnet
3. **Test first**: Always test on sandbox before devnet
4. **Monitor deployments**: Save deployment addresses from output
5. **Backup deployment files**: Keep `deployment-devnet.json` safe

## Resources

- **Aztec Documentation**: https://docs.aztec.network/
- **Aztec Devnet Explorer**: https://devnet.aztec-labs.com/
- **Noir Documentation**: https://noir-lang.org/
- **Project Repository**: https://github.com/[your-repo]

## Testing on Devnet

After deployment, you can:

1. **Share contract addresses** with testers
2. **Run interaction scripts** to demonstrate functionality
3. **Monitor transactions** on the devnet explorer
4. **Test private trading** with multiple accounts

## Next Steps

1. Deploy contracts to devnet
2. Share addresses with community for testing
3. Gather feedback on privacy features
4. Iterate on contract improvements
5. Prepare for mainnet deployment

## Support

For issues or questions:
- Check the [Aztec Discord](https://discord.gg/aztec)
- Review [Project Documentation](./docs/)
- Open an issue on GitHub

---

**Happy Private Trading! 🔐**
