// Vendor
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

// Config
import games from '@/config/games';

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'gobelins-axis.firebaseapp.com',
    projectId: 'gobelins-axis',
    storageBucket: 'gobelins-axis.appspot.com',
    messagingSenderId: '529378279324',
    appId: '1:529378279324:web:3f38515eec42d202dc9259',
    measurementId: 'G-YSGEBD6L4W',
};

export default ({ store }, inject) => {
    const apps = getApps();
    const firebaseApp = !apps.length ? initializeApp(config) : apps[0];

    const firestore = getFirestore(firebaseApp);
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage);

    function getGames() {
        const collectionRef = collection(firestore, 'games');

        const promise = new Promise((resolve, reject) => {
            // getDocs(collectionRef).then((response) => {
            //     const games = response.docs.map((doc) => {
            //         return { id: doc.id, fields: doc.data() };
            //     });
            //     resolve(games);
            // });

            // Debug
            resolve(games);
        });
        return promise;
    }

    function getGameLeaderboard(id) {
        const leaderboardCollection = collection(firestore, 'leaderboards');
        const gameRef = doc(leaderboardCollection, id);
        const scoreCollectionRef = collection(gameRef, 'scores');

        const promise = new Promise((resolve) => {
            getDocs(scoreCollectionRef).then((response) => {
                const scores = response.docs.map((doc) => {
                    return doc.data();
                });
                resolve(scores);
            });
        });

        return promise;
    }

    inject('firebase', {
        // Firebase instances
        firestore,
        storage,
        storageRef,
        // Custom methods
        getGames,
        getGameLeaderboard,
    });

    const promises = [
        getGames(),
    ];

    return Promise.all(promises).then(([games]) => {
        store.dispatch('data/setGames', games);
    });
};
