import React, { useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useBalance, useReadContract, useWatchContractEvent, useWriteContract } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseUnits, formatUnits, getAddress } from 'viem';
import { config } from './wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { VAULT_ABI, VAULT_ADDRESS, ERC20_ABI, WBNB_ADDRESS, WBNB_ABI } from './contractConfig';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, collection, query, orderBy, limit, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';

// Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Pages
import DashboardView from './pages/Dashboard/DashboardView';
import VaultView from './pages/Vault/VaultView';
import HistoryView from './pages/History/HistoryView';
import SentinelView from './pages/Sentinel/SentinelView';

// Firebase Config (Using environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIza...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vinsmoke-vault.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vinsmoke-vault",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vinsmoke-vault.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "...",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const queryClient = new QueryClient();

// --- Demo Simulator Hook ---
// This simulates the Price Sentinel bot during the demo by writing to Firestore
// so that the UI can react in real-time via the existing onSnapshot listeners.
function useDemoSimulator(db: any) {
  useEffect(() => {
    // Only run simulator if we are in "demo" mode or desired
    const interval = setInterval(async () => {
      try {
        const gap = 0.5 + Math.random() * 2;
        const potentialProfit = (gap * 0.05).toFixed(4);

        // 1. Update Vault Status
        const statusRef = doc(db, "vault", "status");
        await setDoc(statusRef, {
          ready_for_strike: gap > 1.2,
          networkLoad: 10 + Math.floor(Math.random() * 5),
          activePairs: 12 + Math.floor(Math.random() * 3),
          nextScan: 15,
          status: "ACTIVE",
          opportunity: gap > 1.2 ? {
            tokenOut: "0x0E09Fa171825718718064039aaE1ce24B2447276", // CAKE
            minOutput: (10 + Math.random()).toFixed(4),
            profit: potentialProfit,
            amountToArb: "1000000000000000000", // 1 BNB
            timestamp: serverTimestamp()
          } : null
        }, { merge: true });

        // 2. Add Chart Point
        const bnbPrice = 600 + Math.random() * 10;
        const vaultValue = 1200 + Math.random() * 5;
        await addDoc(collection(db, "chart_data"), {
          timestamp: serverTimestamp(),
          market: bnbPrice,
          vault: vaultValue
        });

      } catch (e) {
        console.error("Simulator error:", e);
      }
    }, 15000); // Pulse every 15 seconds

    return () => clearInterval(interval);
  }, [db]);
}

// --- Main Dashboard Component ---

function Dashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { writeContractAsync } = useWriteContract();

  // Balances for the user
  const { data: nativeBalance, refetch: refetchNative } = useBalance({ address });
  const { data: wbnbBalance, refetch: refetchWbnb } = useReadContract({
    address: WBNB_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  });

  // Start the background simulator for the demo
  useDemoSimulator(db);

  const [vaultStatus, setVaultStatus] = useState<any>(null);
  const [sentinelConfig, setSentinelConfig] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartRange, setChartRange] = useState('1D');
  const [notifications, setNotifications] = useState<string[]>([]);

  // Real-time Contract Data
  const { data: totalAssets, refetch: refetchAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
    query: {
      enabled: !!VAULT_ADDRESS && VAULT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10000
    }
  });

  const { data: userShares, refetch: refetchShares } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'userShares',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  });

  // Aggressive Real-Time Monitoring for Demo
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      refetchNative?.();
      refetchWbnb?.();
      refetchShares?.();
      refetchAssets?.();
    }, 4000); // 4s heart-beat for UI freshnes
    return () => clearInterval(interval);
  }, [isConnected]);

  // Listen for Strike Events (Blockchain)
  useWatchContractEvent({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    eventName: 'StrikeExecuted',
    onLogs() {
      addNotification("Arbitrage Strike Detected on Blockchain!");
      refetchAssets();
      refetchShares();
    },
  });

  // Firebase Listeners (Real-time DB)
  useEffect(() => {
    const unsubStatus = onSnapshot(doc(db, "vault", "status"), (doc) => {
      setVaultStatus(doc.data());
    });

    const unsubConfig = onSnapshot(doc(db, "vault", "config"), (doc) => {
      setSentinelConfig(doc.data());
    });

    const q = query(collection(db, "executions"), orderBy("timestamp", "desc"), limit(50));
    const unsubHistory = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qChart = query(
      collection(db, "chart_data"),
      orderBy("timestamp", "desc"),
      limit(chartRange === '1D' ? 20 : chartRange === '1W' ? 50 : 100)
    );
    const unsubChart = onSnapshot(qChart, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Unique by minute to prevent clutter, then sort
      const sorted = docs.sort((a: any, b: any) => (a.timestamp?.toMillis() || 0) - (b.timestamp?.toMillis() || 0));

      const formatted = sorted.map((d: any) => {
        const date = d.timestamp?.toDate();
        let timeStr = '';
        if (date) {
          if (chartRange === '1D') {
            timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          }
        }
        return {
          time: timeStr || '--:--',
          vault: d.vault || 0,
          market: d.market || 0
        };
      });
      setChartData(formatted);
    });

    return () => {
      unsubStatus();
      unsubConfig();
      unsubHistory();
      unsubChart();
    };
  }, [chartRange]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 5));
    setTimeout(() => setNotifications(prev => prev.filter(m => m !== msg)), 5000);
  };

  const handleSaveConfig = async (newConfig: any) => {
    try {
      await setDoc(doc(db, "vault", "config"), newConfig);
      addNotification("Sentinel configuration updated.");
    } catch (err) {
      addNotification("Failed to update configuration.");
    }
  };

  const handleWrap = async (amount: string) => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      addNotification(`Wrapping ${amount} BNB...`);
      const hash = await writeContractAsync({
        address: WBNB_ADDRESS,
        abi: WBNB_ABI,
        functionName: 'deposit',
        value: parseUnits(amount, 18),
      } as any);

      addNotification("Waiting for Block Confirmation...");
      await waitForTransactionReceipt(config, { hash });
      addNotification("BNB Wrapped Successfully!");
      refetchNative();
      refetchWbnb();
    } catch (err: any) {
      console.error("Wrap Error Details:", err);
      console.dir(err);
      const errorMsg = err.shortMessage || err.message || "Wrap failed.";
      addNotification(`Error: ${errorMsg.slice(0, 50)}...`);
    }
  };

  const { data: vaultUnderlyingAsset } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'asset',
  });

  const handleDeposit = async (amount: string) => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      const parsedAmount = parseUnits(amount, 18);
      const assetAddress = (vaultUnderlyingAsset as `0x${string}`) || WBNB_ADDRESS;

      // 1. Approve
      addNotification("Step 1/2: Approving Assets...");
      const approveHash = await writeContractAsync({
        address: assetAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [VAULT_ADDRESS, parsedAmount],
      } as any);

      addNotification("Waiting for Approval Confirmation...");
      await waitForTransactionReceipt(config, { hash: approveHash });

      // 2. Deposit
      addNotification("Step 2/2: Confirming Deposit...");
      const depositHash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [parsedAmount],
      } as any);

      addNotification("Waiting for Block Confirmation...");
      const receipt = await waitForTransactionReceipt(config, { hash: depositHash });

      if (receipt.status === 'success') {
        // 3. Log to Firebase only after success
        await addDoc(collection(db, "executions"), {
          txHash: depositHash,
          type: "DEPOSIT",
          profit: "0",
          message: `Deposited ${amount} BNB`,
          timestamp: serverTimestamp()
        });

        addNotification(`Success! ${amount} BNB Anchored.`);

        // Update Chart with new baseline
        await addDoc(collection(db, "chart_data"), {
          value: Number(formatUnits(totalAssets as bigint || 0n, 18)) + Number(amount),
          timestamp: serverTimestamp()
        });

        // Full Refetch for Real-Time UI
        refetchNative();
        refetchAssets();
        refetchWbnb();
        refetchShares();
      } else {
        addNotification("Transaction failed on-chain.");
      }
    } catch (err: any) {
      console.error("Deposit Error Details:", err);
      console.dir(err);
      const errorMsg = err.shortMessage || err.message || "Deposit failed.";
      addNotification(`Error: ${errorMsg.slice(0, 50)}...`);
    }
  };

  const handleWithdraw = async (shares: string) => {
    if (!shares || isNaN(Number(shares))) return;
    try {
      addNotification("Initiating Withdrawal...");
      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'withdraw',
        args: [parseUnits(shares, 18)],
      } as any);

      addNotification("Waiting for Block Confirmation...");
      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt.status === 'success') {
        await addDoc(collection(db, "executions"), {
          txHash: hash,
          type: "WITHDRAW",
          profit: "0",
          message: `Redeemed ${shares} Shares`,
          timestamp: serverTimestamp()
        });

        addNotification(`Redemption Successful.`);

        await addDoc(collection(db, "chart_data"), {
          value: Number(formatUnits(totalAssets as bigint || 0n, 18)) - Number(shares),
          timestamp: serverTimestamp()
        });

        // Full Refetch for Real-Time UI
        refetchNative();
        refetchAssets();
        refetchWbnb();
        refetchShares();
      }
    } catch (err: any) {
      console.error("Withdraw Error Details:", err);
      console.dir(err);
      const errorMsg = err.shortMessage || err.message || "Withdraw failed.";
      addNotification(`Error: ${errorMsg.slice(0, 50)}...`);
    }
  };

  const handleStrike = async () => {
    if (!vaultStatus?.opportunity) return;
    try {
      addNotification(`Vinsmoke Strike Initiated...`);
      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'executeArb',
        args: [
          parseUnits(vaultStatus.opportunity.amountToArb.toString(), 18),
          parseUnits(vaultStatus.opportunity.minOutput.toString(), 18),
          getAddress(vaultStatus.opportunity.tokenOut)
        ],
      } as any);

      addNotification("Waiting for Strike Confirmation...");
      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt.status === 'success') {
        await addDoc(collection(db, "executions"), {
          txHash: hash || "local-strike",
          type: "STRIKE",
          profit: vaultStatus.opportunity.profit,
          tokenOut: vaultStatus.opportunity.tokenOut,
          timestamp: serverTimestamp()
        });

        addNotification(`Vinsmoke Strike Confirmed!`);

        await addDoc(collection(db, "chart_data"), {
          value: Number(formatUnits(totalAssets as bigint || 0n, 18)) + Number(vaultStatus.opportunity.profit),
          timestamp: serverTimestamp()
        });

        // Full Refetch for Real-Time UI
        refetchNative();
        refetchWbnb();
        refetchShares();
        refetchAssets();
      }
    } catch (err: any) {
      console.error("Strike Error Details:", err);
      const errorMsg = err.shortMessage || err.message || "Strike failed.";
      addNotification(`Error: ${errorMsg.slice(0, 50)}...`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            vaultStatus={vaultStatus}
            history={history}
            totalAssets={totalAssets}
            handleStrike={handleStrike}
            chartData={chartData}
            chartRange={chartRange}
            setChartRange={setChartRange}
            setActiveTab={setActiveTab}
          />
        );
      case 'vaults':
        return (
          <VaultView
            totalAssets={totalAssets}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            nativeBalance={nativeBalance ? formatUnits(nativeBalance.value, 18) : '0'}
            wbnbBalance={wbnbBalance ? formatUnits(wbnbBalance as bigint, 18) : '0'}
            userShares={userShares ? formatUnits(userShares as bigint, 18) : '0'}
            onWrap={handleWrap}
          />
        );
      case 'history':
        return <HistoryView history={history} />;
      case 'sentinel':
        return <SentinelView config={sentinelConfig} onSave={handleSaveConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid-layout">
      {/* Protocol Alerts - Centered on Mobile, Top Right on Desktop */}
      <div className="fixed top-6 lg:top-8 right-6 lg:right-8 left-6 lg:left-auto z-[200] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((note, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50 }}
              className="bg-white text-black pl-4 pr-10 py-4 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 flex items-center gap-4 pointer-events-auto min-w-full lg:min-w-[320px]"
            >
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Protocol Alert</p>
                <p className="font-bold text-sm tracking-tight">{note}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden overflow-y-auto custom-scrollbar relative">
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
