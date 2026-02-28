import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin with defensive error handling
let db: admin.firestore.Firestore | null = null;
let isFirebaseAvailable = false;

async function setupFirebase() {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || "vinsmoke-vault"
      });
    }
    const tempDb = admin.firestore();
    // Liveness test
    await tempDb.collection("vault").limit(1).get();

    db = tempDb;
    isFirebaseAvailable = true;
    console.log("[Firebase] Successfully initialized Admin SDK.");
  } catch (error) {
    console.warn("\x1b[33m[Firebase] Warning: Admin SDK initialization failed or credentials missing.\x1b[0m");
    console.warn("\x1b[33m[Firebase] Tip: Start the Firebase Emulator or provide a service account JSON.\x1b[0m");
    isFirebaseAvailable = false;
    db = null;
  }
}

async function startServer() {
  await setupFirebase();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  if (isFirebaseAvailable && db) {
    try {
      const chartDataRef = db.collection("chart_data");
      const snapshot = await chartDataRef.limit(1).get().catch(() => ({ empty: true }));

      if (snapshot.empty) {
        console.log("[Sentinel] Generating initial chart data...");
        const batch = db.batch();
        const now = Date.now();
        for (let i = 0; i < 50; i++) {
          const docRef = chartDataRef.doc();
          batch.set(docRef, {
            timestamp: admin.firestore.Timestamp.fromMillis(now - (50 - i) * 60000),
            market: 600 + Math.random() * 10,
            vault: 1200 + (i * 2) + Math.random() * 5
          });
        }
        await batch.commit();
      }

      setInterval(async () => {
        if (!db) return;
        try {
          const configDoc = await db.collection("vault").doc("config").get();
          const config = configDoc.exists ? configDoc.data() : { monitoringEnabled: true, minProfit: "0.01" };

          if (config?.monitoringEnabled === false) {
            await db.collection("vault").doc("status").set({
              ready_for_strike: false,
              status: "PAUSED"
            }, { merge: true });
            return;
          }

          const asterPrice = 100 + Math.random() * 2;
          const pancakePrice = 100 + Math.random() * 2;
          const gap = Math.abs(asterPrice - pancakePrice);

          const statusRef = db.collection("vault").doc("status");
          const networkLoad = 10 + Math.floor(Math.random() * 5);
          const activePairs = 12 + Math.floor(Math.random() * 3);

          const potentialProfit = (gap * 0.05).toFixed(4);
          const minProfitThreshold = parseFloat(config?.minProfit || "0.01");

          const perfRef = db.collection("performance").doc("latest");
          const bnbPrice = 600 + Math.random() * 10;
          const vaultValue = 1200 + Math.random() * 5;

          await perfRef.set({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            market: bnbPrice,
            vault: vaultValue
          });

          await db.collection("chart_data").add({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            market: bnbPrice,
            vault: vaultValue
          });

          if (gap > 1.2 && parseFloat(potentialProfit) >= minProfitThreshold) {
            await statusRef.set({
              ready_for_strike: true,
              networkLoad,
              activePairs,
              nextScan: 15,
              status: "ACTIVE",
              opportunity: {
                tokenOut: "0x0E09Fa171825718718064039aaE1ce24B2447276",
                minOutput: (10.1 + Math.random() * 0.5).toString(),
                profit: potentialProfit,
                amountToArb: "1000000000000000000",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
              }
            }, { merge: true });
          } else {
            await statusRef.set({
              ready_for_strike: false,
              networkLoad,
              activePairs,
              nextScan: 15,
              status: "ACTIVE"
            }, { merge: true });
          }
        } catch (error) {
        }
      }, 15000);
    } catch (e) {
      console.warn("[Sentinel] Simulation startup failed. Logic disabled.");
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n\x1b[32mVINSMOKE’S VAULT running on http://localhost:${PORT}\x1b[0m`);
    if (!isFirebaseAvailable) {
      console.log("\x1b[33m[Warning] Simulation disabled. No Firebase credentials found.\x1b[0m");
      console.log("\x1b[90mTip: Start the Firebase Emulator or provide a service account JSON.\x1b[0m\n");
    }
  });
}

startServer();
