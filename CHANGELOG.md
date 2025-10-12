# Changelog

All notable changes to Aztec Dark Market will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- Limit order support
- Stop-loss orders
- Order matching engine
- Frontend interface
- Multi-asset trading pairs
- Portfolio management dashboard

---

## [0.1.0] - 2025-10-11

### Added - Initial Release

**Smart Contracts:**
- ✅ Private Order Book contract with encrypted order storage
- ✅ Private Escrow contract for atomic swaps
- ✅ Private Token contract with UTXO-based privacy
- ✅ Authorization system for contract interactions
- ✅ Public volume statistics (aggregated, no details)

**Features:**
- ✅ Place private orders (invisible to other traders)
- ✅ Cancel orders (only owner can cancel)
- ✅ Lock assets in escrow for trading
- ✅ Atomic swap execution between counterparties
- ✅ Private token transfers
- ✅ Balance privacy (encrypted notes)

**Development Tools:**
- ✅ Deployment script for automated contract deployment
- ✅ Interaction script with usage examples
- ✅ Comprehensive test suite
- ✅ Environment configuration template

**Documentation:**
- ✅ README.md with project overview
- ✅ SETUP.md with installation and setup guide
- ✅ ARCHITECTURE.md with system design details
- ✅ CONTRIBUTING.md with contribution guidelines
- ✅ SECURITY.md with security policy
- ✅ LICENSE (MIT)

**Infrastructure:**
- ✅ Project structure with organized folders
- ✅ Nargo.toml configuration for Noir compilation
- ✅ Package.json with npm scripts
- ✅ Git repository initialized
- ✅ .gitignore for build artifacts

### Privacy Features
- 🔒 Order details completely private
- 🔒 Token balances hidden from public
- 🔒 Trade prices and amounts confidential
- 🔒 Counterparty identities protected
- 🔒 No front-running possible
- 🔒 No MEV extraction

### Technical Details
- **Language:** Noir (Aztec's ZK language)
- **Network:** Aztec (ZK-Rollup on Ethereum)
- **Proving System:** UltraPlonk
- **Version:** Aztec packages v0.50.0

### Known Limitations
- ⚠️ Alpha stage - not production ready
- ⚠️ Testnet only deployment
- ⚠️ No formal security audit yet
- ⚠️ Limited order types (buy/sell only)
- ⚠️ No automatic order matching
- ⚠️ Manual note management required

### Security
- 🔐 All sensitive data encrypted
- 🔐 Zero-knowledge proofs for correctness
- 🔐 Nullifiers prevent double-spending
- 🔐 Escrow prevents asset loss
- 🔐 Authorization checks on all operations

---

## Version History

### [0.1.0] - 2025-10-11
**"Genesis Release"** - Initial public release of Aztec Dark Market with core privacy trading features.

---

## Upcoming Releases

### [0.2.0] - Planned Q4 2025
**"Advanced Trading"**

**Planned Features:**
- Limit orders with price triggers
- Stop-loss order support
- Market order execution
- Partial order fills
- Order book per trading pair
- Improved note consolidation

**Improvements:**
- Better proof generation performance
- Reduced transaction costs
- Enhanced error handling
- More comprehensive tests

### [0.3.0] - Planned Q1 2026
**"Institutional Features"**

**Planned Features:**
- Private credit scoring system
- Undercollateralized lending
- Private derivatives (options, futures)
- Portfolio privacy tools
- Dark pool with time-locked transparency
- Compliance reporting module

**Infrastructure:**
- Security audit completion
- Bug bounty program launch
- Mainnet deployment preparation

### [0.4.0] - Planned Q2 2026
**"Governance & DAO"**

**Planned Features:**
- Private governance voting
- Stealth DAO functionality
- Anonymous proposals
- Vote weight privacy
- Token holder governance

### [1.0.0] - Planned Q3 2026
**"Production Release"**

**Major Milestone:**
- Full security audit
- Formal verification
- Mainnet launch
- Production-ready contracts
- Complete documentation
- User interface
- API for integrations

---

## Change Categories

This changelog uses the following categories:

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements or fixes

---

## How to Update This File

When making changes:

1. Add entry under `[Unreleased]` section
2. Use appropriate category (Added, Changed, etc.)
3. Describe changes clearly and concisely
4. Reference GitHub issues/PRs if applicable
5. Move to versioned section on release

**Example:**
```markdown
## [Unreleased]

### Added
- New limit order feature (#123)
- Order expiry notifications

### Fixed
- Order cancellation bug (#124)
```

---

## Git Tags

Release tags follow semantic versioning:

```bash
# List all releases
git tag

# Checkout specific version
git checkout v0.1.0

# View changes between versions
git diff v0.1.0 v0.2.0
```

---

## Release Notes

Detailed release notes for each version are available on the [GitHub Releases](https://github.com/rudazy/Aztec-/releases) page.

---

## Migration Guides

### Upgrading from Future Versions

Migration guides will be provided when breaking changes are introduced.

---

## Deprecation Policy

**Notice Period:** 2 major versions

When features are deprecated:
1. Marked as deprecated in documentation
2. Warning added to function/contract
3. Alternative provided
4. Removed after 2 major versions

---

## Support

**Current Version Support:**
- v0.1.x - Active development and bug fixes

**Older Versions:**
- No versions prior to v0.1.0

---

**Last Updated:** October 11, 2025  
**Current Version:** 0.1.0  
**Next Release:** 0.2.0 (Planned Q4 2025)

---

[Unreleased]: https://github.com/rudazy/Aztec-/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rudazy/Aztec-/releases/tag/v0.1.0