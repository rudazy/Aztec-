# Security Policy

## Overview

The security of Aztec Dark Market is a top priority. This document outlines our security practices, how to report vulnerabilities, and what to expect from the security process.

---

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

**Note:** This project is currently in active development. Security updates will be released as soon as possible after vulnerability discovery.

---

## Security Considerations

### Smart Contract Security

Our contracts implement several security measures:

**Privacy Protection:**
- All sensitive data stored as encrypted notes
- Zero-knowledge proofs ensure correctness without revealing data
- Only authorized parties can decrypt their own information

**Authorization Controls:**
- Ownership checks on all sensitive operations
- Only authorized contracts can trigger asset movements
- Admin privileges limited to configuration only

**Asset Protection:**
- Escrow system prevents unauthorized transfers
- Atomic swaps eliminate partial execution risks
- Expiry mechanisms prevent permanent asset locks
- Nullifiers prevent double-spending

**Common Vulnerabilities Addressed:**
- ✅ Reentrancy attacks (not applicable in Aztec's execution model)
- ✅ Integer overflow/underflow (Field arithmetic is safe)
- ✅ Front-running (orders are private)
- ✅ MEV extraction (prices hidden until execution)
- ✅ Access control (enforced at contract level)

---

## Known Limitations

### Current Version Limitations

**Alpha Stage Warning:**
This project is in early development (v0.1.x). The following limitations exist:

1. **Not Production Ready**
   - Contracts have not been formally audited
   - Use only on testnets
   - Do not use with real funds

2. **Privacy Assumptions**
   - Client-side PXE must be trusted
   - Key management is user's responsibility
   - Side-channel attacks on client possible

3. **Incomplete Features**
   - Note consolidation not implemented
   - Advanced order types in development
   - Governance mechanisms not yet deployed

### Security Assumptions

**Trusted Components:**
- User's local PXE (Private Execution Environment)
- User's private key security
- Aztec Network sequencer decentralization
- Ethereum L1 finality

**Threat Model:**
- Protected: On-chain privacy, MEV, front-running
- Not Protected: Client compromise, key theft, social engineering

---

## Reporting a Vulnerability

### DO NOT Report Security Issues Publicly

**Never** create public GitHub issues for security vulnerabilities. Public disclosure before a fix is available puts all users at risk.

### How to Report

**Preferred Method: Private Security Advisory**

1. Go to the [Security tab](https://github.com/rudazy/Aztec-/security) on GitHub
2. Click "Report a vulnerability"
3. Fill out the security advisory form
4. Submit privately

**Alternative Method: Email**

If you cannot use GitHub Security Advisories:

- **Email:** [Create a secure email for your project]
- **Subject:** "SECURITY: [Brief Description]"
- **Encryption:** PGP key available on request

### What to Include

Please provide:

1. **Vulnerability Type**
   - Contract vulnerability
   - Privacy leak
   - Authentication bypass
   - Other (describe)

2. **Affected Components**
   - Which contracts are affected
   - Which functions are vulnerable
   - Version numbers

3. **Reproduction Steps**
   - Clear steps to reproduce
   - Sample code if applicable
   - Transaction hashes (on testnet)

4. **Impact Assessment**
   - What can an attacker do?
   - What data/assets are at risk?
   - Estimated severity (Critical/High/Medium/Low)

5. **Suggested Fix (Optional)**
   - Proposed solution
   - Patch if available

### Example Report

```
Subject: SECURITY: Order cancellation authorization bypass

Component: PrivateOrderBook contract
Version: 0.1.0
Severity: HIGH

Description:
The cancel_order function does not properly verify ownership
when called through a delegatecall pattern.

Reproduction:
1. User A creates an order
2. User B calls cancel_order with User A's order hash
3. Order is cancelled despite User B not being the owner

Impact:
Malicious users can cancel other users' orders, causing
denial of service and disrupting trading.

Suggested Fix:
Add explicit msg_sender() check before nullifying order.
See attached patch.
```

---

## Response Timeline

### Our Commitment

We take all security reports seriously and will respond promptly:

| Timeline | Action |
|----------|--------|
| 24 hours | Initial acknowledgment of report |
| 48 hours | Preliminary assessment of severity |
| 7 days | Detailed investigation and fix development |
| 14 days | Security patch released (for critical issues) |
| 30 days | Public disclosure (coordinated with reporter) |

**Critical vulnerabilities** (asset loss, privacy breach) will be prioritized and patched within 7 days.

### What to Expect

1. **Acknowledgment**
   - We'll confirm receipt of your report
   - Assign a tracking ID

2. **Assessment**
   - Verify the vulnerability
   - Assess severity and impact
   - Determine affected versions

3. **Fix Development**
   - Develop and test patch
   - Create security advisory
   - Prepare upgrade path

4. **Disclosure**
   - Coordinate timing with reporter
   - Release security patch
   - Publish security advisory
   - Credit reporter (if desired)

---

## Security Best Practices for Users

### For Developers Integrating Our Contracts

**Do's:**
- ✅ Always use the latest version
- ✅ Test on sandbox/testnet first
- ✅ Implement proper key management
- ✅ Validate all user inputs
- ✅ Monitor contract events
- ✅ Keep PXE updated

**Don'ts:**
- ❌ Don't store private keys in code
- ❌ Don't deploy to mainnet without audit
- ❌ Don't trust user-provided addresses without verification
- ❌ Don't disable security checks "temporarily"
- ❌ Don't expose PXE endpoints publicly

### For Traders Using the Platform

**Protect Your Keys:**
- Use hardware wallets when available
- Never share your private keys
- Use strong passwords
- Enable 2FA where applicable

**Verify Contracts:**
- Always verify contract addresses
- Check deployment info matches official sources
- Be cautious of phishing attempts

**Safe Trading:**
- Start with small amounts on testnet
- Verify order details before submission
- Keep software updated
- Monitor your balances regularly

---

## Security Audits

### Current Status

**Audit Status:** Not yet audited

We are actively seeking security audits from:
- Blockchain security firms
- Academic researchers
- Independent security researchers

### Planned Audits

**Roadmap:**
- Q4 2025: Internal security review
- Q1 2026: External audit (planned)
- Q2 2026: Formal verification (planned)

### Bug Bounty Program

**Status:** Coming soon

We plan to launch a bug bounty program offering rewards for:
- Critical vulnerabilities: Up to $10,000
- High severity: Up to $5,000
- Medium severity: Up to $2,000
- Low severity: Up to $500

Details will be announced when the program launches.

---

## Security Updates

### How We Communicate Security Issues

**Security Advisories:**
- Published on GitHub Security Advisories
- Emailed to registered users
- Announced on Discord/Twitter
- Documented in release notes

**Update Process:**
1. Security patch released
2. Advisory published with details
3. Users notified to upgrade
4. Grace period for upgrades
5. Full disclosure after patch adoption

### Staying Informed

Subscribe to security updates:
- Watch this repository for security advisories
- Join our Discord security channel
- Follow on Twitter for announcements
- Enable GitHub notifications

---

## Responsible Disclosure Policy

### Our Commitment to Researchers

We are committed to working with security researchers:

**We Promise:**
- Acknowledge your contribution
- Keep you informed of progress
- Credit you in security advisories (if desired)
- Never take legal action for good faith research
- Consider you for bug bounty rewards

**We Ask:**
- Report issues privately first
- Give us time to fix before public disclosure
- Don't exploit vulnerabilities
- Don't access others' data
- Don't perform DoS attacks

### Hall of Fame

Security researchers who responsibly disclose vulnerabilities will be listed here:

*No vulnerabilities have been reported yet.*

---

## Security Resources

### External Resources

**Aztec Security:**
- [Aztec Security Best Practices](https://docs.aztec.network/security)
- [Noir Security Guidelines](https://noir-lang.org/security)

**General Smart Contract Security:**
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [SWC Registry](https://swcregistry.io/)

**Zero-Knowledge Security:**
- [ZK Security Resources](https://www.zkpsecurity.xyz/)

### Our Security Tools

- Static analysis: TBD
- Fuzzing: TBD
- Formal verification: Planned

---

## Contact

**Security Team Email:** [ludarep1@dmail.ai]  
**Response Time:** Within 24 hours

For non-security issues, please use:
- GitHub Issues
- Discord community
- General support email

---

## Legal

**Safe Harbor:**
We consider security research conducted in accordance with this policy to be:
- Authorized concerning any applicable anti-hacking laws
- Exempt from DMCA claims
- Lawful and in good faith

**No Legal Action:**
We will not pursue legal action against researchers who:
- Follow this security policy
- Report issues in good faith
- Don't cause harm or access user data

---

**Last Updated:** October 2025  
**Version:** 1.0

Thank you for helping keep Aztec Dark Market secure! 🔒