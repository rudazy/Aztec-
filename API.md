# API Documentation

Complete reference for interacting with Aztec Dark Market smart contracts.

---

## Table of Contents

1. [Overview](#overview)
2. [Contract Addresses](#contract-addresses)
3. [Private Token Contract](#private-token-contract)
4. [Private Escrow Contract](#private-escrow-contract)
5. [Private Order Book Contract](#private-order-book-contract)
6. [Integration Examples](#integration-examples)
7. [Error Codes](#error-codes)

---

## Overview

### Getting Started

To interact with Aztec Dark Market contracts:

```javascript
const { Contract, Fr, createPXEClient } = require('@aztec/aztec.js');

// Connect to PXE
const pxe = createPXEClient('http://localhost:8080');

// Load contract
const contract = await Contract.at(contractAddress, artifact, wallet);

// Call functions
await contract.methods.functionName(params).send().wait();
```

### Privacy Model

**Private Functions:**
- Execute in PXE (client-side)
- Generate zero-knowledge proofs
- Data encrypted to user's public key
- Only proof submitted on-chain

**Public Functions:**
- Execute on Aztec Network
- Visible to all participants
- Used for aggregated statistics

---

## Contract Addresses

After deployment, contract addresses are stored in `deployment-info.json`:

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

## Private Token Contract

Privacy-preserving fungible token implementation.

### Functions

#### constructor

Initializes the token contract.

```javascript
constructor(
  admin: AztecAddress,
  name: Field,
  symbol: Field,
  decimals: u8,
  initial_supply: Field
)
```

**Parameters:**
- `admin` - Administrator address
- `name` - Token name (encoded as Field)
- `symbol` - Token symbol (encoded as Field)
- `decimals` - Number of decimals (typically 18)
- `initial_supply` - Initial token supply in base units

**Access:** Private  
**Returns:** None

**Example:**
```javascript
const tokenName = Fr.fromString('DarkToken');
const tokenSymbol = Fr.fromString('DARK');
const decimals = 18;
const initialSupply = Fr.fromString('1000000000000000000000000');

const token = await Contract.deploy(
  wallet,
  PrivateTokenArtifact,
  [wallet.getAddress(), tokenName, tokenSymbol, decimals, initialSupply]
).send().deployed();
```

---

#### transfer

Transfer tokens privately to another address.

```javascript
transfer(to: AztecAddress, amount: Field): void
```

**Parameters:**
- `to` - Recipient address
- `amount` - Amount to transfer (in base units)

**Access:** Private  
**Visibility:** Only sender and recipient know

**Example:**
```javascript
const recipient = AztecAddress.fromString('0x...');
const amount = Fr.fromString('1000000000000000000'); // 1 token

await token.methods.transfer(recipient, amount).send().wait();
```

**Privacy:** Transfer details are private. Only sender and recipient can see the amount.

---

#### approve

Approve another address to spend tokens on your behalf.

```javascript
approve(spender: AztecAddress, amount: Field): void
```

**Parameters:**
- `spender` - Address authorized to spend
- `amount` - Maximum amount approved

**Access:** Private  
**Use Case:** Required before locking assets in escrow

**Example:**
```javascript
const escrowAddress = AztecAddress.fromString('0x...');
const approvalAmount = Fr.fromString('1000000000000000000');

await token.methods.approve(escrowAddress, approvalAmount).send().wait();
```

---

#### transfer_from

Transfer tokens from one address to another (requires approval).

```javascript
transfer_from(from: AztecAddress, to: AztecAddress, amount: Field): void
```

**Parameters:**
- `from` - Source address
- `to` - Destination address
- `amount` - Amount to transfer

**Access:** Private  
**Requires:** Prior approval from `from` address

**Example:**
```javascript
await token.methods
  .transfer_from(fromAddress, toAddress, amount)
  .send()
  .wait();
```

---

#### mint

Create new tokens (admin only).

```javascript
mint(to: AztecAddress, amount: Field): void
```

**Parameters:**
- `to` - Recipient of new tokens
- `amount` - Amount to mint

**Access:** Private  
**Authorization:** Admin only

**Example:**
```javascript
const mintAmount = Fr.fromString('1000000000000000000');
await token.methods.mint(recipient, mintAmount).send().wait();
```

---

#### burn

Destroy tokens from your balance.

```javascript
burn(amount: Field): void
```

**Parameters:**
- `amount` - Amount to burn

**Access:** Private

**Example:**
```javascript
const burnAmount = Fr.fromString('1000000000000000000');
await token.methods.burn(burnAmount).send().wait();
```

---

#### balance_of

View token balance (unconstrained).

```javascript
balance_of(owner: AztecAddress): Field
```

**Parameters:**
- `owner` - Address to query

**Access:** Unconstrained (view function)  
**Returns:** Balance placeholder (actual implementation would sum notes)

**Example:**
```javascript
const balance = await token.methods.balance_of(userAddress).view();
console.log(`Balance: ${balance}`);
```

---

#### get_total_supply

Get total token supply.

```javascript
get_total_supply(): Field
```

**Access:** Unconstrained (public view)  
**Returns:** Total supply

**Example:**
```javascript
const totalSupply = await token.methods.get_total_supply().view();
```

---

## Private Escrow Contract

Manages asset locking and atomic swaps.

### Functions

#### constructor

Initialize escrow contract.

```javascript
constructor(admin: AztecAddress)
```

**Parameters:**
- `admin` - Administrator address

**Access:** Private

---

#### authorize_contract

Authorize a contract to execute swaps (admin only).

```javascript
authorize_contract(contract_address: AztecAddress): void
```

**Parameters:**
- `contract_address` - Contract to authorize

**Access:** Public  
**Authorization:** Admin only

**Example:**
```javascript
await escrow.methods
  .authorize_contract(orderBookAddress)
  .send()
  .wait();
```

---

#### lock_assets

Lock assets in escrow for trading.

```javascript
lock_assets(
  token: AztecAddress,
  amount: Field,
  order_hash: Field,
  expiry: Field
): void
```

**Parameters:**
- `token` - Token contract address
- `amount` - Amount to lock
- `order_hash` - Associated order identifier
- `expiry` - Expiration timestamp

**Access:** Private  
**Requires:** Token approval

**Example:**
```javascript
const orderHash = Fr.fromString('12345');
const expiry = Fr.fromString(String(Date.now() + 86400000)); // 24h

await escrow.methods
  .lock_assets(tokenAddress, amount, orderHash, expiry)
  .send()
  .wait();
```

---

#### release_to

Release escrowed assets to recipient.

```javascript
release_to(escrow_hash: Field, recipient: AztecAddress): void
```

**Parameters:**
- `escrow_hash` - Escrow note identifier
- `recipient` - Address to receive assets

**Access:** Private  
**Authorization:** Only escrow owner

**Example:**
```javascript
await escrow.methods
  .release_to(escrowHash, recipientAddress)
  .send()
  .wait();
```

---

#### cancel_and_return

Cancel escrow and return assets to owner.

```javascript
cancel_and_return(escrow_hash: Field): void
```

**Parameters:**
- `escrow_hash` - Escrow note identifier

**Access:** Private  
**Requirements:** Escrow must be expired

**Example:**
```javascript
await escrow.methods.cancel_and_return(escrowHash).send().wait();
```

---

#### atomic_swap

Execute atomic swap between two parties (authorized contracts only).

```javascript
atomic_swap(
  escrow_a_hash: Field,
  escrow_b_hash: Field,
  party_a: AztecAddress,
  party_b: AztecAddress
): void
```

**Parameters:**
- `escrow_a_hash` - First escrow identifier
- `escrow_b_hash` - Second escrow identifier
- `party_a` - First party address
- `party_b` - Second party address

**Access:** Private  
**Authorization:** Authorized contracts only

---

## Private Order Book Contract

Manages private order creation and matching.

### Functions

#### constructor

Initialize order book contract.

```javascript
constructor(admin: AztecAddress)
```

**Parameters:**
- `admin` - Administrator address

**Access:** Private

---

#### place_order

Create a new private order.

```javascript
place_order(
  asset_in: AztecAddress,
  asset_out: AztecAddress,
  amount_in: Field,
  amount_out: Field,
  price: Field,
  expiry: Field,
  order_type: Field
): void
```

**Parameters:**
- `asset_in` - Token being sold
- `asset_out` - Token being bought
- `amount_in` - Amount selling
- `amount_out` - Amount buying
- `price` - Order price
- `expiry` - Expiration timestamp (milliseconds)
- `order_type` - 0 = buy, 1 = sell

**Access:** Private  
**Privacy:** Order details only visible to creator

**Example:**
```javascript
const order = {
  assetIn: tokenAddress,
  assetOut: tokenAddress,
  amountIn: Fr.fromString('1000000000000000000'),
  amountOut: Fr.fromString('2000000000000000000'),
  price: Fr.fromString('2'),
  expiry: Fr.fromString(String(Date.now() + 86400000)),
  orderType: Fr.fromString('0') // Buy order
};

await orderbook.methods
  .place_order(
    order.assetIn,
    order.assetOut,
    order.amountIn,
    order.amountOut,
    order.price,
    order.expiry,
    order.orderType
  )
  .send()
  .wait();
```

---

#### match_order

Match and execute an order with a counterparty.

```javascript
match_order(order_hash: Field, counter_party: AztecAddress): void
```

**Parameters:**
- `order_hash` - Order identifier to match
- `counter_party` - Address of counterparty

**Access:** Private  
**Requirements:** Valid order, not expired

**Example:**
```javascript
const orderHash = Fr.fromString('12345');
const counterparty = AztecAddress.fromString('0x...');

await orderbook.methods
  .match_order(orderHash, counterparty)
  .send()
  .wait();
```

---

#### cancel_order

Cancel a private order.

```javascript
cancel_order(order_hash: Field): void
```

**Parameters:**
- `order_hash` - Order identifier to cancel

**Access:** Private  
**Authorization:** Only order owner

**Example:**
```javascript
await orderbook.methods.cancel_order(orderHash).send().wait();
```

---

#### get_total_volume

Get total trading volume (public statistic).

```javascript
get_total_volume(): Field
```

**Access:** Unconstrained (public view)  
**Returns:** Aggregated trading volume

**Privacy:** Only volume visible, no trade details

**Example:**
```javascript
const volume = await orderbook.methods.get_total_volume().view();
console.log(`Total Volume: ${volume}`);
```

---

## Integration Examples

### Complete Trading Flow

```javascript
const { Contract, Fr, createPXEClient, waitForPXE } = require('@aztec/aztec.js');

async function executeTrade() {
  // 1. Connect to PXE
  const pxe = createPXEClient('http://localhost:8080');
  await waitForPXE(pxe);
  
  // 2. Load contracts
  const token = await Contract.at(tokenAddress, TokenArtifact, wallet);
  const escrow = await Contract.at(escrowAddress, EscrowArtifact, wallet);
  const orderbook = await Contract.at(orderbookAddress, OrderbookArtifact, wallet);
  
  // 3. Approve escrow to spend tokens
  const amount = Fr.fromString('1000000000000000000');
  await token.methods.approve(escrow.address, amount).send().wait();
  
  // 4. Lock assets in escrow
  const orderHash = Fr.fromString('12345');
  const expiry = Fr.fromString(String(Date.now() + 86400000));
  await escrow.methods
    .lock_assets(token.address, amount, orderHash, expiry)
    .send()
    .wait();
  
  // 5. Place order
  await orderbook.methods
    .place_order(
      token.address,    // asset_in
      token.address,    // asset_out
      amount,           // amount_in
      amount,           // amount_out
      Fr.fromString('1'), // price
      expiry,           // expiry
      Fr.fromString('0') // order_type (buy)
    )
    .send()
    .wait();
  
  console.log('✅ Order placed successfully!');
}
```

---

## Error Codes

### Common Errors

| Error | Description | Solution |
|-------|-------------|----------|
| "Order expired" | Order expiry time has passed | Create new order with future expiry |
| "Not your order" | Attempting to modify another user's order | Only cancel your own orders |
| "Not admin" | Unauthorized admin function call | Use admin wallet |
| "Insufficient supply" | Trying to burn more than total supply | Check supply before burning |
| "Amount must be positive" | Invalid amount parameter | Use positive values |

### Debug Tips

**Enable Verbose Logging:**
```javascript
const pxe = createPXEClient('http://localhost:8080', { debug: true });
```

**Check Transaction Status:**
```javascript
const txHash = await contract.methods.place_order(...).send();
const receipt = await txHash.wait();
console.log('Status:', receipt.status);
```

---

## Rate Limits

**PXE Rate Limits:**
- Testnet: 100 requests/minute
- Local: Unlimited

**Proof Generation:**
- Average: 2-5 seconds per transaction
- Depends on client hardware

---

## Support

**Resources:**
- Documentation: Check SETUP.md and ARCHITECTURE.md
- Examples: See scripts/interact.js
- Issues: https://github.com/rudazy/Aztec-/issues

---

**Last Updated:** October 11, 2025  
**API Version:** 0.1.0  
**Aztec SDK:** v0.50.0