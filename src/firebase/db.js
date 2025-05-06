import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  Timestamp
} from 'firebase/firestore';

// Work data operations
export const saveWorkData = async (userId, workData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const workDataRef = doc(userDocRef, 'data', 'workData');
    await setDoc(workDataRef, { workDays: workData });
    return true;
  } catch (error) {
    console.error('Error saving work data:', error);
    return false;
  }
};

export const loadWorkData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const workDataRef = doc(userDocRef, 'data', 'workData');
    const docSnap = await getDoc(workDataRef);
    
    if (docSnap.exists()) {
      return docSnap.data().workDays || {};
    }
    return {};
  } catch (error) {
    console.error('Error loading work data:', error);
    return {};
  }
};

// Payment data operations
export const savePaymentData = async (userId, paymentData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const paymentDataRef = doc(userDocRef, 'data', 'paymentData');
    await setDoc(paymentDataRef, { payments: paymentData });
    return true;
  } catch (error) {
    console.error('Error saving payment data:', error);
    return false;
  }
};

export const loadPaymentData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const paymentDataRef = doc(userDocRef, 'data', 'paymentData');
    const docSnap = await getDoc(paymentDataRef);
    
    if (docSnap.exists()) {
      return docSnap.data().payments || {};
    }
    return {};
  } catch (error) {
    console.error('Error loading payment data:', error);
    return {};
  }
};

// Authentication helpers
export const getCurrentUserId = () => {
  // Use this function to get the current user ID from your authentication context
  // For now we'll return a placeholder, but this should be replaced with actual auth logic
  return localStorage.getItem('userId') || 'default-user';
};

// Example of how to structure your data for a more scalable approach
// Instead of storing all work days in a single document, you can store each day separately
export const saveWorkDay = async (userId, dateStr, dayData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const workDaysCollectionRef = collection(userDocRef, 'workDays');
    const workDayDocRef = doc(workDaysCollectionRef, dateStr);
    
    await setDoc(workDayDocRef, {
      ...dayData,
      date: dateStr,
      timestamp: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error saving work day:', error);
    return false;
  }
};

export const getWorkDays = async (userId, startDate, endDate) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const workDaysCollectionRef = collection(userDocRef, 'workDays');
    
    // If we have start and end dates, we could query by date range
    // For this example, we'll just get all work days
    const querySnapshot = await getDocs(workDaysCollectionRef);
    
    const workDays = {};
    querySnapshot.forEach((doc) => {
      workDays[doc.id] = doc.data();
    });
    
    return workDays;
  } catch (error) {
    console.error('Error getting work days:', error);
    return {};
  }
};

export const deleteWorkDay = async (userId, dateStr) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const workDaysCollectionRef = collection(userDocRef, 'workDays');
    const workDayDocRef = doc(workDaysCollectionRef, dateStr);
    
    await deleteDoc(workDayDocRef);
    return true;
  } catch (error) {
    console.error('Error deleting work day:', error);
    return false;
  }
}; 