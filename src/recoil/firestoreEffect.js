// recoil/firestoreEffect.js
import { startAuthListener, db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

export const firestoreEffect = ({ collection, field }) =>
  ({ setSelf, onSet }) => {
    let isInitialLoad = true;
    let currentUser = null;
    let unsubscribe = null;

    function gotDataACB(sn) {
      setSelf(sn.data()?.[field] || []);  // Default to empty array if no data
      isInitialLoad = false;
    }

    function catchGetDocACB() {
      setSelf([]);
      isInitialLoad = false;
    }

    startAuthListener((user) => {
      currentUser = user;

      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }

      if (!user) {
        setSelf([]);
        isInitialLoad = false;
        return;
      }

      const theDoc = doc(db, collection, user.uid);
      unsubscribe = onSnapshot(theDoc, gotDataACB, catchGetDocACB);
    });

    function saveACB(newValue, _, isReset) {
      if (isInitialLoad || isReset || !currentUser) return;

      const theDoc = doc(db, collection, currentUser.uid);
      setDoc(theDoc, { [field]: newValue }, { merge: true });
    }

    onSet(saveACB); // Subscribe to data changes
  };