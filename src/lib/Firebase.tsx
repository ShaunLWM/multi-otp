import { initializeApp } from "firebase/app";
import { FirestoreDataConverter, QueryDocumentSnapshot, collection, getFirestore, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "multiotp-7d08a.firebaseapp.com",
  projectId: "multiotp-7d08a",
  storageBucket: "multiotp-7d08a.appspot.com",
  messagingSenderId: "1009378327155",
  appId: "1:1009378327155:web:c173962e9596cf4c08c806"
};

const converter: FirestoreDataConverter<AccountWithId> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<Account>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id
    };
  }
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const accountCollection = collection(db, "account").withConverter(converter);
export const accountCollectionRef = query<AccountWithId>(accountCollection);
