import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBa2Mjyb8W86kjmWOJX6JUDY_Vzkr564rQ',
	authDomain: 'retrotool-3d516.firebaseapp.com',
	projectId: 'retrotool-3d516',
	storageBucket: 'retrotool-3d516.appspot.com',
	messagingSenderId: '395654503517',
	appId: '1:395654503517:web:d3bf47760ed31e566881b4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
