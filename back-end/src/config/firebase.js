import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT ||
    fs.readFileSync("./firebase-key.json", "utf8"),
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
export default db;
