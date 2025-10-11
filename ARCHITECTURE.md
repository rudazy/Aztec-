# Aztec Dark Market - Architecture Documentation

Complete technical architecture and design documentation for the privacy-preserving institutional trading platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Privacy Model](#privacy-model)
4. [Contract Architecture](#contract-architecture)
5. [Data Flow](#data-flow)
6. [Security Considerations](#security-considerations)
7. [Scalability](#scalability)
8. [Future Enhancements](#future-enhancements)

---

## Overview

### Vision

Aztec Dark Market is a privacy-first institutional trading platform built on Aztec Network. It enables:

- **Front-running resistant trading** - Orders are invisible until matched
- **MEV-proof execution** - No value extraction from trade information
- **Institutional-grade privacy** - Trade secrets remain confidential
- **Regulatory compliance** - Selective disclosure capabilities
- **Atomic settlement** - No counterparty risk

### Key Innovation

Unlike traditional DEXs where every order, balance, and trade is public, Aztec Dark Market leverages **programmable privacy** to create a truly private trading environment while maintaining verifiability and decentralization.

---

## Core Components

### 1. Private Order Book Contract

**Purpose:** Manages the creation, matching, and cancellation of trading orders.

**Key Features:**
- Orders stored as encrypted notes (only trader can decrypt)
- Order matching happens privately between parties
- Public chain only sees aggregated statistics
- Support for multiple order types (buy/sell)

**Privacy Guarantees:**
- Order details (price, amount, asset) are private
- Only the trader who created an order can view it
- Matched orders reveal details only to counterparties
- Public observers see only that trades occurred, not details

**State Storage:**
```
orders: Map<Address, PrivateSet<OrderNote>>
- Maps each trader to their private order notes
- Only accessible by the order owner

total_volume: PublicImmutable<Field>
- Aggregated trading volume (no details)
- Used for platform statistics
```

### 2. Private Escrow Contract

**Purpose:** Holds assets during trading to ensure atomic swaps and prevent double-spending.

**Key Features:**
- Locks assets when orders are placed
- Releases assets atomically during trade execution
- Returns assets if orders expire or are cancelled
- Authorization system for trusted contracts

**Security Model:**
- Assets locked in private notes
- Only owner can initiate release
- Atomic swap prevents partial execution
- Expiry mechanism prevents permanent locks

**State Storage:**
```
escrows: Map<Address, PrivateSet<EscrowNote>>
- Private escrow notes per user
- Links to corresponding orders

authorized_contracts: Map<Address, bool>
- Whitelist of contracts that can trigger swaps
- Prevents unauthorized asset movement
```

### 3. Private Token Contract

**Purpose:** Privacy-preserving fungible token implementation.

**Key Features:**
- Private balances (UTXO-based)
- Private transfers
- Approval mechanism for escrow
- Minting and burning capabilities

**Privacy Model:**
- Balances stored as encrypted notes
- Transfers create new notes for recipients
- Only sender and recipient know transfer details
- Total supply is public for transparency

**State Storage:**
```
balances: Map<Address, PrivateSet<TokenNote>>
- UTXO-style token notes
- Each note has owner and amount

total_supply: PublicImmutable<Field>
- Transparent total supply
- Updated on mint/burn
```

---

## Privacy Model

### Three-Layer Privacy Architecture

#### Layer 1: Note-Based Privacy
- All sensitive data stored as encrypted notes
- Notes encrypted to user's public key
- Only user can decrypt their own notes
- Nullifiers prevent double-spending

#### Layer 2: Private Execution
- Order placement executes in PXE (Private Execution Environment)
- Client-side proof generation
- Only proof submitted to network, not raw data
- Zero-knowledge proofs ensure correctness

#### Layer 3: Selective Disclosure
- Users can selectively reveal information
- Compliance proofs without full disclosure
- Audit trails with privacy preservation
- Future: Regulatory reporting module

### What is Private vs Public

**Private (Encrypted Notes):**
- Individual token balances
- Order details (price, amount, assets)
- Escrowed asset amounts
- Trade counterparties
- Individual trade amounts and prices

**Public (On-Chain State):**
- Contract addresses
- Total token supply
- Aggregated trading volume
- That a trade occurred (not details)
- Contract authorization status

### Privacy Guarantees

✅ **Orders are invisible** - No one can front-run your trades  
✅ **Balances are hidden** - Competitors can't see your positions  
✅ **Trades are confidential** - Only you and counterparty know details  
✅ **No MEV extraction** - Miners/sequencers can't exploit trade info  
✅ **Regulatory compliance** - Can prove compliance without revealing all data  

---

## Contract Architecture

### Interaction Flow

```
User Wallet
    |
    v
Private Execution Environment (PXE)
    |
    |--- Private Token Contract
    |       - Check balance (private)
    |       - Transfer tokens (private)
    |
    |--- Private Escrow Contract
    |       - Lock assets (private)
    |       - View escrows (private)
    |
    |--- Private Order Book Contract
    |       - Place order (private)
    |       - Match order (private)
    |       - Cancel order (private)
    |
    v
Aztec Network (L2)
    |
    v
Ethereum (L1 Settlement)
```

### Contract Relationships

```
PrivateToken
    ^
    |
    | (transfer_from)
    |
PrivateEscrow <---(authorized)--- PrivateOrderBook
    |                                    |
    | (lock_assets)                     | (place_order)
    | (atomic_swap)                     | (match_order)
    |                                    |
    v                                    v
User's Private Notes              Encrypted Order Notes
```

### Function Call Patterns

**Placing an Order:**
1. User calls `PrivateToken.approve(escrow, amount)`
2. User calls `PrivateEscrow.lock_assets(token, amount, order_hash, expiry)`
3. User calls `PrivateOrderBook.place_order(...details)`
4. Order stored as encrypted note, only user can view

**Matching an Order:**
1. Counterparty calls `PrivateOrderBook.match_order(order_hash, their_address)`
2. OrderBook verifies order validity
3. OrderBook calls `PrivateEscrow.atomic_swap(escrow_a, escrow_b, party_a, party_b)`
4. Escrow transfers assets simultaneously
5. Both parties receive encrypted notifications

**Cancelling an Order:**
1. User calls `PrivateOrderBook.cancel_order(order_hash)`
2. OrderBook verifies ownership
3. OrderBook nullifies order note
4. User calls `PrivateEscrow.cancel_and_return(escrow_hash)`
5. Assets returned to user

---

## Data Flow

### Order Lifecycle

```
1. ORDER CREATION
   User → PXE → Private Token (approve)
   User → PXE → Private Escrow (lock)
   User → PXE → Private OrderBook (place_order)
   
   Result: Encrypted OrderNote created
           Assets locked in EscrowNote
           Only user can see order

2. ORDER DISCOVERY (Off-Chain)
   - Matching engine monitors encrypted logs
   - Users can publish order hashes (not details)
   - Private negotiation channels
   - ZK proofs of order compatibility

3. ORDER MATCHING
   Counterparty → PXE → Private OrderBook (match_order)
   OrderBook → Private Escrow (atomic_swap)
   
   Result: Both EscrowNotes nullified
           Assets transferred
           Only participants know details

4. ORDER SETTLEMENT
   - Public event: "Trade occurred"
   - Volume stats updated (aggregated)
   - Private notifications to both parties
   - No price/amount disclosed publicly
```

### Note Lifecycle

```
NOTE CREATION
- Generated during private function execution
- Encrypted to recipient's public key
- Stored in private state tree
- Commitment added to note tree

NOTE CONSUMPTION
- User proves ownership via nullifier secret
- Nullifier computed and published
- Note marked as consumed
- Cannot be double-spent

NOTE STORAGE
- Notes stored in encrypted logs
- PXE indexes and decrypts user's notes
- Merkle tree commitments on-chain
- Efficient lookup and verification
```

---

## Security Considerations

### Threat Model

**Protected Against:**
- ✅ Front-running attacks
- ✅ MEV extraction
- ✅ Privacy leaks through transaction ordering
- ✅ Balance disclosure attacks
- ✅ Double-spending
- ✅ Unauthorized asset movement

**Potential Risks:**
- ⚠️ PXE compromise (user's local environment)
- ⚠️ Key management issues
- ⚠️ Side-channel attacks on client
- ⚠️ Malicious sequencers (mitigated by decentralization)

### Security Features

**Cryptographic Guarantees:**
- Zero-knowledge proofs ensure correctness
- Pedersen commitments hide values
- Nullifiers prevent double-spending
- Encrypted logs protect data in transit

**Authorization Controls:**
- Only order owner can cancel orders
- Only authorized contracts can trigger swaps
- Admin controls limited to configuration
- No admin access to user funds

**Atomic Execution:**
- Swaps execute atomically or not at all
- No partial executions possible
- Escrow prevents asset loss
- Expiry mechanism for recovery

---

## Scalability

### Current Limitations

- **Note Management:** Users accumulate notes over time
- **Proof Generation:** Client-side proving takes time
- **Storage:** Encrypted logs grow with activity
- **Matching:** No on-chain matching engine yet

### Optimization Strategies

**Note Consolidation:**
```
Problem: Many small notes are inefficient
Solution: Periodic note merging
- Combine multiple notes into one
- Reduces proof generation time
- Improves privacy (resets note graph)
```

**Batched Operations:**
```
Problem: Each operation generates proofs
Solution: Batch multiple operations
- Submit multiple orders at once
- Aggregate cancellations
- Reduce transaction overhead
```

**Off-Chain Matching:**
```
Problem: On-chain matching is expensive
Solution: Off-chain order discovery
- Matching engine monitors encrypted events
- Users agree to match off-chain
- Submit match proof on-chain
- Reduces on-chain computation
```

### Performance Metrics

**Expected Throughput:**
- Order placement: ~10-20 TPS (proof generation bottleneck)
- Order matching: ~5-10 TPS (dual-party coordination)
- Token transfers: ~50-100 TPS (optimized proofs)

**Latency:**
- Proof generation: 2-5 seconds (client hardware dependent)
- Transaction confirmation: 10-30 seconds (network dependent)
- Order matching: 30-60 seconds (discovery + execution)

---

## Future Enhancements

### Phase 1: Core Features (Current)
- ✅ Private order book
- ✅ Private escrow
- ✅ Private token
- ✅ Basic order types (buy/sell)

### Phase 2: Advanced Trading
- 🔄 Limit orders
- 🔄 Stop-loss orders
- 🔄 Market orders
- 🔄 Partial fills
- 🔄 Order books per trading pair

### Phase 3: Institutional Features
- 📋 Private credit scoring
- 📋 Undercollateralized lending
- 📋 Private derivatives (options, futures)
- 📋 Portfolio privacy
- 📋 Dark pools with time-locked transparency

### Phase 4: Governance & DAO
- 📋 Private governance voting
- 📋 Stealth DAOs
- 📋 Anonymous proposals
- 📋 Vote weight privacy
- 📋 Selective disclosure for compliance

### Phase 5: Cross-Chain
- 📋 Bridge to other L2s
- 📋 Cross-chain order books
- 📋 Private cross-chain swaps
- 📋 Universal liquidity pools

### Phase 6: Compliance & Regulatory
- 📋 ZK compliance proofs
- 📋 Selective audit trails
- 📋 Regulatory reporting module
- 📋 KYC/AML integration (privacy-preserving)
- 📋 Tax reporting tools

---

## Technical Stack

**Smart Contracts:**
- Language: Noir (Aztec's ZK language)
- Proving System: UltraPlonk
- Network: Aztec (ZK-Rollup on Ethereum)

**Development Tools:**
- Aztec.js SDK
- Noir compiler (Nargo)
- PXE (Private Execution Environment)
- Aztec Sandbox (local testnet)

**Infrastructure:**
- Client-side proof generation
- Encrypted note storage
- Decentralized sequencers
- Ethereum L1 settlement

---

## Comparison with Traditional DEXs

| Feature | Traditional DEX | Aztec Dark Market |
|---------|----------------|-------------------|
| Order Privacy | ❌ Public | ✅ Private |
| Balance Privacy | ❌ Public | ✅ Private |
| Front-running | ⚠️ Vulnerable | ✅ Protected |
| MEV Extraction | ⚠️ Significant | ✅ Eliminated |
| Trade Details | ❌ Public | ✅ Private |
| Institutional Ready | ⚠️ Limited | ✅ Yes |
| Regulatory Compliance | ⚠️ Difficult | ✅ Possible (ZK proofs) |
| Atomic Settlement | ✅ Yes | ✅ Yes |
| Decentralization | ✅ Yes | ✅ Yes |

---

## Conclusion

Aztec Dark Market represents a paradigm shift in decentralized trading - bringing institutional-grade privacy to DeFi while maintaining the core benefits of blockchain technology: verifiability, decentralization, and trustlessness.

By leveraging Aztec's programmable privacy, we enable use cases that were previously impossible on public blockchains, opening DeFi to institutional capital and sophisticated trading strategies that require confidentiality.

---

## Additional Resources

- **Aztec Documentation:** https://docs.aztec.network
- **Noir Language Guide:** https://noir-lang.org/docs
- **ZK-SNARK Explainer:** https://z.cash/technology/zksnarks
- **Privacy in DeFi Paper:** [Academic references]

---

**Last Updated:** October 2025  
**Version:** 0.1.0  
**Status:** Active Development