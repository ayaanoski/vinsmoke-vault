import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { createPublicClient, http, parseUnits, formatUnits } from "viem";
import { bsc } from "viem/chains";

admin.initializeApp();
const db = admin.firestore();

// Mock ABIs for Quoter and Oracle
const QUOTER_ABI = [{ "inputs": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint24", "name": "fee", "type": "uint24" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }], "name": "quoteExactInputSingle", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }];
const ORACLE_ABI = [{ "inputs": [], "name": "latestAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }];

export const priceSentinel = onSchedule("every 1 minutes", async (event) => {
  const client = createPublicClient({
    chain: bsc,
    transport: http(process.env.BNB_RPC_URL),
  });

  const VAULT_ASSET = "0x..."; // e.g. WBNB
  const ARB_TOKEN = "0x...";  // e.g. CAKE
  const QUOTER_ADDRESS = "0x..."; // PancakeSwap V3 Quoter
  const ASTER_ORACLE = "0x...";

  try {
    // 1. Fetch Prices
    const asterPriceRaw = await client.readContract({
      address: ASTER_ORACLE as `0x${string}`,
      abi: ORACLE_ABI,
      functionName: 'latestAnswer',
    } as any) as bigint;

    const amountIn = parseUnits("10", 18); // Check with 10 units
    const pancakeOutput = await client.readContract({
      address: QUOTER_ADDRESS as `0x${string}`,
      abi: QUOTER_ABI,
      functionName: 'quoteExactInputSingle',
      args: [VAULT_ASSET, ARB_TOKEN, 3000, amountIn, 0],
    } as any) as bigint;

    // 2. Gas Calculation
    const gasPrice = await client.getGasPrice();
    const estimatedGas = 300000n; // Estimate for executeArb
    const gasCost = gasPrice * estimatedGas;

    // 3. Profit Logic
    // Simplified: comparing pancake output vs aster "fair value"
    const profit = pancakeOutput - amountIn - gasCost;
    const profitMargin = (Number(profit) / Number(amountIn)) * 100;

    if (profit > 0 && profitMargin > 1.0) {
      await db.collection("vault").doc("status").set({
        ready_for_strike: true,
        opportunity: {
          tokenOut: ARB_TOKEN,
          minOutput: formatUnits(pancakeOutput, 18),
          profit: formatUnits(profit, 18),
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        }
      });
      console.log(`[Sentinel] Opportunity detected! Margin: ${profitMargin}%`);
    } else {
      await db.collection("vault").doc("status").update({ ready_for_strike: false });
    }
  } catch (error) {
    console.error("[Sentinel] Error:", error);
  }
});
