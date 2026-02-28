# VINSMOKE’S VAULT: Mission Control Setup

## 1. Smart Contract Deployment
1. Open [Remix IDE](https://remix.ethereum.org/).
2. Paste the contents of `contracts/VinsmokesVault.sol`.
3. Compile with Solidity `0.8.20`.
4. Deploy to **BNB Smart Chain** (Mainnet or Testnet).
5. Copy the deployed contract address.

## 2. Environment Configuration
Create/Update your `.env` file in the root directory:
```env
# Contract Address from Remix
VITE_VAULT_ADDRESS="0xYOUR_DEPLOYED_ADDRESS"

# RPC URL for BNB Chain
BNB_RPC_URL="https://bsc-dataseed.binance.org/"

# Firebase Configuration
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_PROJECT_ID="..."
# ... other firebase vars
```

## 3. Firebase Deployment
1. Install Firebase CLI: `npm install -g firebase-tools`.
2. Login: `firebase login`.
3. Initialize: `firebase init` (select Functions and Firestore).
4. Deploy: `firebase deploy --only functions,firestore`.

## 4. Verification
1. **Frontend**: The "Live TVL" should now fetch data directly from your contract via Viem.
2. **Sentinel**: Check Firebase logs (`firebase functions:log`) to see the Price Sentinel scanning AsterDEX and PancakeSwap.
3. **Mission Control**: When the Sentinel detects a >1% profit gap, a glowing "Arbitrage Detected" alert will appear on your dashboard.
4. **Strike**: Click "Execute Strike" to trigger the `executeArb` transaction. Once confirmed, a celebratory toast will appear and TVL will update.

---
**VIBE CHECK**: The UI is optimized for "Stealth Mode" with neon green accents and real-time data streams. Good luck at the hackathon!
