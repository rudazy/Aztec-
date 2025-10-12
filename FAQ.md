# Frequently Asked Questions (FAQ)

Common questions about Aztec Dark Market - the privacy-preserving institutional trading platform.

---

## Table of Contents

1. [General Questions](#general-questions)
2. [Privacy & Security](#privacy--security)
3. [Technical Questions](#technical-questions)
4. [Trading & Features](#trading--features)
5. [Development & Integration](#development--integration)
6. [Troubleshooting](#troubleshooting)

---

## General Questions

### What is Aztec Dark Market?

Aztec Dark Market is a privacy-first institutional trading platform built on Aztec Network. It enables traders to place orders, execute trades, and manage positions without revealing sensitive information like prices, amounts, or counterparties to the public.

### Why do we need private trading?

Traditional DeFi has a transparency problem:
- **Front-running:** Bots see your orders and trade ahead of you
- **MEV extraction:** Miners/sequencers exploit your transaction info
- **Strategy exposure:** Competitors see your trading patterns
- **Privacy loss:** Everyone knows your positions and balances

Aztec Dark Market solves these problems using zero-knowledge proofs.

### How is this different from other DEXs?

| Feature | Traditional DEX | Aztec Dark Market |
|---------|----------------|-------------------|
| Order visibility | Public | Private |
| Balance privacy | Public | Private |
| Trade details | Public | Private |
| Front-running | Vulnerable | Protected |
| MEV | Exploitable | Eliminated |
| Institutional ready | Limited | Yes |

### Is this production ready?

**No.** Currently at v0.1.0 (alpha stage):
- ✅ Use on testnet
- ❌ Not audited yet
- ❌ Don't use with real funds
- ❌ Not deployed to mainnet

Mainnet launch planned for Q4 2026 after security audits.

### Who is this for?

**Primary users:**
- Institutional traders
- Hedge funds
- Market makers
- High-frequency traders
- DAOs with large treasuries
- Anyone requiring trading privacy

**Also useful for:**
- Retail traders wanting privacy
- DeFi protocols
- Privacy-conscious users

---

## Privacy & Security

### How private is it really?

**What's private:**
- ✅ Your token balance
- ✅ Your order details (price, amount, assets)
- ✅ Who you trade with
- ✅ Trade execution details
- ✅ Your trading history

**What's public:**
- 📊 Total trading volume (aggregated)
- 📊 That a trade occurred (no details)
- 📊 Contract addresses

### How does the privacy work?

We use three layers of privacy:

1. **Encrypted Notes:** All sensitive data stored as encrypted notes only you can decrypt
2. **Zero-Knowledge Proofs:** Prove transactions are valid without revealing details
3. **Private Execution:** Computations happen client-side in your PXE

### Can the government/regulators see my trades?

**Privacy is not anonymity.** The system supports:
- Selective disclosure (reveal info to specific parties)
- Compliance proofs (prove you're following rules without revealing everything)
- Audit trails (with privacy)

Future versions will include regulatory reporting modules.

### What if I lose my private keys?

**Your keys = Your assets.** If you lose your keys:
- ❌ Cannot decrypt your notes
- ❌ Cannot access your balance
- ❌ Cannot cancel orders
- ❌ No recovery possible

**Best practices:**
- Use hardware wallets
- Keep secure backups
- Never share private keys

### Has this been audited?

**Not yet.** Security audit planned for Q3 2026 before mainnet launch.

**Current status:**
- Alpha stage development
- Testnet only
- Community review ongoing
- Bug bounty planned

**Do not use with real funds until audited.**

### What are the main security risks?

**Protected:**
- ✅ On-chain privacy maintained
- ✅ Smart contract authorization checks
- ✅ Atomic swaps prevent theft
- ✅ No front-running possible

**Risks:**
- ⚠️ Client compromise (protect your PXE)
- ⚠️ Key management issues
- ⚠️ Unaudited code (alpha stage)
- ⚠️ Smart contract bugs

---

## Technical Questions

### What is Aztec Network?

Aztec is a privacy-first Layer 2 (L2) rollup on Ethereum. It uses:
- Zero-knowledge proofs (ZK-SNARKs)
- Private smart contracts
- Encrypted state
- Decentralized sequencers

Learn more: https://aztec.network

### What is a PXE?

**PXE (Private Execution Environment)** is your local client that:
- Executes private functions
- Generates zero-knowledge proofs
- Manages your encrypted notes
- Decrypts your data

Think of it as your private blockchain node.

### What language are the contracts written in?

**Noir** - Aztec's zero-knowledge programming language.

It's similar to Rust but designed for:
- Writing ZK circuits
- Private smart contracts
- Proof generation

### How do zero-knowledge proofs work?

**Simple explanation:**
ZK proofs let you prove something is true without revealing why it's true.

**Example:**
- Traditional: "Here's my order: 100 ETH at $2000" (everyone sees)
- ZK proof: "I have a valid order" (no details revealed)

The network verifies the proof without seeing the order details.

### What's the performance like?

**Current metrics (v0.1.0):**
- Proof generation: 2-5 seconds
- Transaction confirmation: 10-30 seconds
- Throughput: 10-20 TPS (orders)

**Target for v1.0:**
- Proof generation: <1 second
- Throughput: 100+ TPS

### Can this scale?

**Yes, with optimizations:**
- Recursive proof aggregation
- Batch processing
- Note consolidation
- Parallel proof generation

Roadmap includes major performance improvements.

---

## Trading & Features

### What order types are supported?

**v0.1.0 (current):**
- Buy orders
- Sell orders

**Coming soon (v0.2.0):**
- Limit orders
- Stop-loss orders
- Market orders
- Partial fills

### How do I place an order?

```javascript
await orderbook.methods.place_order(
  tokenIn,     // Token you're selling
  tokenOut,    // Token you're buying
  amountIn,    // Amount selling
  amountOut,   // Amount buying
  price,       // Order price
  expiry,      // When order expires
  orderType    // 0 = buy, 1 = sell
).send().wait();
```

See API.md for full documentation.

### Can others see my orders?

**No.** Orders are stored as encrypted notes. Only you can decrypt and see your own orders.

### How are orders matched?

**v0.1.0:** Manual matching (you specify counterparty)

**v0.2.0+:** Automated matching engine (coming soon)

### What happens if my order expires?

Expired orders:
- Cannot be matched
- Assets remain in escrow
- You can cancel and retrieve assets

### Can I cancel an order?

**Yes.** Only the order owner can cancel:

```javascript
await orderbook.methods.cancel_order(orderHash).send().wait();
```

This releases your escrowed assets.

### What tokens can I trade?

**v0.1.0:** Any private token implementing our interface

**Coming:** Bridge to public tokens (USDC, ETH, etc.)

### Are there trading fees?

**Currently:** No fees (testnet)

**Future:** Small protocol fees to sustain development

---

## Development & Integration

### How do I get started developing?

1. Read SETUP.md
2. Install dependencies
3. Run local sandbox
4. Deploy contracts
5. Run tests

See CONTRIBUTING.md for details.

### What do I need to integrate?

**Requirements:**
- Node.js 18+
- Aztec.js SDK
- PXE connection
- Contract artifacts

See API.md for integration examples.

### Can I build on top of this?

**Yes!** MIT License allows:
- Commercial use
- Modification
- Distribution
- Private use

Credit appreciated but not required.

### How can I contribute?

**Ways to contribute:**
- Report bugs
- Request features
- Submit pull requests
- Improve documentation
- Test on testnet

See CONTRIBUTING.md for guidelines.

### Is there a bug bounty?

**Coming soon!** Bug bounty program planned for Q1 2026:
- Critical: Up to $10,000
- High: Up to $5,000
- Medium: Up to $2,000
- Low: Up to $500

### Where can I get help?

**Resources:**
- Documentation: Check all .md files
- GitHub Issues: https://github.com/rudazy/Aztec-/issues
- Aztec Discord: https://discord.gg/aztec

---

## Troubleshooting

### "Cannot connect to PXE"

**Solutions:**
1. Ensure Aztec Sandbox is running
2. Check PXE_URL is correct
3. Verify port 8080 is not blocked
4. Restart sandbox: `docker restart <container>`

### "Compilation failed"

**Solutions:**
1. Update Aztec CLI: `npm install -g @aztec/cli@latest`
2. Clear cache: `npm run clean && npm install`
3. Check Nargo.toml versions
4. Verify Noir syntax

### "Transaction failed"

**Common causes:**
1. Insufficient balance
2. Order expired
3. Not authorized
4. Gas limit exceeded

**Debug:**
```javascript
const tx = await contract.methods.function().send();
const receipt = await tx.wait();
console.log('Status:', receipt.status);
```

### "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Orders not appearing

**Check:**
1. Are you using correct wallet?
2. Is PXE synced?
3. Are notes encrypted to your key?
4. Try refreshing PXE state

### Slow proof generation

**Causes:**
- Low-end hardware
- Complex transactions
- Many notes to process

**Solutions:**
- Use faster machine
- Consolidate notes
- Batch operations

---

## Additional Questions

### When is mainnet launch?

**Planned:** Q4 2026

**Milestones before mainnet:**
- Security audits
- Bug bounty program
- Performance optimization
- Formal verification

### How can I stay updated?

**Follow development:**
- GitHub: Star the repo
- Watch for releases
- Read CHANGELOG.md
- Follow roadmap

### Can I use this commercially?

**Yes!** MIT License allows commercial use.

### Is there a token?

**Not yet.** Token launch planned in governance phase (Q2 2026).

### Will there be a frontend?

**Yes!** Web interface planned for v1.0 (Q4 2026).

**Current:** Command-line and SDK integration only.

### How do I report a security issue?

**Do NOT create public issue!**

Email: [security email to be added]
See: SECURITY.md

---

## Didn't Find Your Answer?

**Still have questions?**

1. Check documentation: README.md, ARCHITECTURE.md, API.md
2. Search existing issues: https://github.com/rudazy/Aztec-/issues
3. Open a new issue with the "question" label
4. Join Aztec Discord for community help

---

**Last Updated:** October 11, 2025  
**Version:** 0.1.0  

---

**Thank you for your interest in Aztec Dark Market!** 🚀