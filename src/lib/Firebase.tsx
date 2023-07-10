import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "multiotp-7d08a.firebaseapp.com",
  projectId: "multiotp-7d08a",
  storageBucket: "multiotp-7d08a.appspot.com",
  messagingSenderId: "1009378327155",
  appId: "1:1009378327155:web:c173962e9596cf4c08c806"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const accountCollection = collection(db, "account").withConverter({
  toFirestore: (account: Account) => account,
  fromFirestore: (snapshot, options) => snapshot.data(options) as Account
});

export const accountCollectionRef = query<Account>(accountCollection);

export async function getAccounts() {
  const citySnapshot = await getDocs(accountCollection);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

export type Account = {
  email: string;
  secret: string;
}

export async function addAccount(account: Account) {
  try {
    const docRef = await addDoc(accountCollection, account);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function remove(email: string) {
  try {
    const q = query(accountCollection, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      return;
    }

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (error) {

  }
}
