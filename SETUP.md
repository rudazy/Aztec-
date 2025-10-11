# Aztec Dark Market - Setup Guide

Complete guide to set up your development environment and deploy the contracts.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Aztec Sandbox** (Local Development Network)
   - Install Docker Desktop: https://www.docker.com/products/docker-desktop
   - Pull Aztec Sandbox:
     ```bash
     docker pull aztecprotocol/aztec-sandbox
     ```

3. **Aztec CLI Tools**
   - Install globally:
     ```bash
     npm install -g @aztec/cli
     ```

4. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/rudazy/Aztec-.git
cd Aztec-
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- @aztec/aztec.js (SDK for interacting with Aztec)
- @aztec/accounts (Wallet management)
- @aztec/noir-contracts.js (Contract utilities)

### 3. Compile Contracts

Compile all Noir contracts:

```bash
npm run compile
```

This generates:
- `target/` directory with compiled artifacts
- Contract ABIs for deployment
- Proof generation files

**Expected output:**
```
Compiling private_orderbook...
Compiling private_escrow...
Compiling private_token...
✓ All contracts compiled successfully
```

---

## Running Local Development Network

### Start Aztec Sandbox

The Aztec Sandbox is a local development network with PXE (Private Execution Environment).

```bash
docker run -it -p 8080:8080 aztecprotocol/aztec-sandbox
```

**What this does:**
- Starts local Aztec L2 network
- Runs PXE for private transaction execution
- Creates test accounts with funds
- Exposes RPC at http://localhost:8080

**Wait for:**
```
✓ Aztec Sandbox is ready!
✓ PXE listening on port 8080
✓ 3 test accounts created
```

Keep this terminal running!

---

## Deployment

### Deploy to Local Sandbox

In a new terminal:

```bash
npm run deploy:local
```

**Deployment Process:**
1. Connects to local PXE (http://localhost:8080)
2. Deploys Private Token contract
3. Deploys Private Escrow contract
4. Deploys Private Order Book contract
5. Configures contract permissions
6. Saves addresses to `deployment-info.json`

**Expected output:**
```
🚀 Starting Aztec Dark Market Deployment...
📡 Connecting to PXE at http://localhost:8080...
✅ Connected to PXE

👛 Deployer address: 0x1a2b3c4d...

📝 Deploying Private Token Contract...
✅ Private Token deployed at: 0xabc123...
   Token: DarkToken (DARK)
   Initial Supply: 1,000,000 DARK

📝 Deploying Private Escrow Contract...
✅ Private Escrow deployed at: 0xdef456...

📝 Deploying Private Order Book Contract...
✅ Private Order Book deployed at: 0x789xyz...

⚙️  Configuring contracts...
✅ Order Book authorized

🎉 Deployment Complete!
```

### Deploy to Aztec Testnet

**Prerequisites:**
- Testnet account with funds
- Testnet PXE URL

```bash
export PXE_URL=https://api.aztec.network
npm run deploy:testnet
```

---

## Running Tests

Run the test suite:

```bash
npm run test
```

**Tests include:**
- Contract deployment
- Order placement and cancellation
- Privacy guarantees
- Order matching
- Authorization checks

---

## Project Structure

```
aztec-dark-market/
├── src/
│   ├── contracts/
│   │   ├── private_orderbook.nr    # Main trading contract
│   │   ├── private_escrow.nr       # Asset locking
│   │   └── private_token.nr        # Privacy token
│   └── lib/                        # Shared libraries
├── tests/
│   └── test_orderbook.nr           # Test suite
├── scripts/
│   └── deploy.js                   # Deployment script
├── docs/                           # Documentation
├── target/                         # Compiled artifacts (generated)
├── Nargo.toml                      # Noir project config
├── package.json                    # Node dependencies
└── deployment-info.json            # Deployed addresses (generated)
```

---

## Contract Addresses

After deployment, find addresses in `deployment-info.json`:

```json
{
  "contracts": {
    "privateToken": {
      "address": "0x...",
      "name": "DarkToken",
      "symbol": "DARK"
    },
    "privateEscrow": {
      "address": "0x..."
    },
    "privateOrderBook": {
      "address": "0x..."
    }
  }
}
```

---

## Troubleshooting

### Issue: "Cannot connect to PXE"

**Solution:**
- Ensure Aztec Sandbox is running: `docker ps`
- Check port 8080 is not in use
- Restart sandbox: `docker restart <container-id>`

### Issue: "Compilation failed"

**Solution:**
- Update Aztec CLI: `npm install -g @aztec/cli@latest`
- Clear cache: `npm run clean && npm install`
- Check Nargo.toml versions match

### Issue: "Deployment transaction failed"

**Solution:**
- Verify sandbox has test accounts
- Check gas/compute limits
- Review contract constructor parameters

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. **Interact with Contracts**
   - Use Aztec.js to call contract methods
   - Create trading scripts
   - Build frontend interface

2. **Add More Features**
   - Implement matching engine
   - Add order types (limit, market, stop-loss)
   - Create governance module

3. **Security Audit**
   - Review privacy guarantees
   - Test edge cases
   - Formal verification

4. **Production Deployment**
   - Deploy to mainnet
   - Set up monitoring
   - Implement upgradability

---

## Useful Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy locally
npm run deploy:local

# Deploy to testnet
npm run deploy:testnet

# Clean build artifacts
npm run clean

# Check Aztec CLI version
aztec --version

# View sandbox logs
docker logs <container-id> -f
```

---

## Resources

- **Aztec Documentation:** https://docs.aztec.network
- **Noir Language:** https://noir-lang.org
- **Discord Community:** https://discord.gg/aztec
- **GitHub Issues:** https://github.com/rudazy/Aztec-/issues

---

## Support

For questions or issues:
- Open a GitHub issue
- Join Aztec Discord
- Review documentation

Happy building! 🚀