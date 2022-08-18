// Vue3への変更に伴いコメントアウト ここから
/*
import Vue from 'vue'
import Vuex from 'vuex'
*/
// Vue3への変更に伴いコメントアウト ここまで
// Vue3への変更に伴い追加 ここから
import { createStore } from "vuex";
// Vue3への変更に伴い追加 ここまで
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "../main";
import { runTransaction, setDoc, doc, getDoc, increment } from "firebase/firestore";
import router from '@/router';

// Vue3への変更に伴いコメントアウト ここから
// Vue.use(Vuex)
// Vue3への変更に伴いコメントアウト ここまで

// Vue3への変更に伴いコメントアウト ここから
// export default new Vuex.Store({
// Vue3への変更に伴いコメントアウト ここまで
// Vue3への変更に伴い追加 ここから
export default createStore({
// Vue3への変更に伴い追加 ここまで
    state: {
        user: null
        // myUID: null
    },
    getters: {
        user: function(state){
          return state.user;
        }
    },
    mutations: {
        setUser: function( state, value ){
            state.user = value;
        },
        updateUser: function( state, value ){
            //サーバからちゃんと持って来て処理しないと怖い・・けどわからないので暫定
            state.user.wallet = state.user.wallet - value;
        }
    },
    actions: {
        sendAuth: function({commit},{userName, userMailaddress, userPassword}){
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, userMailaddress, userPassword)
            .then((response) => {
                const user = {
                    name: userName,
                    mailaddress: userMailaddress,
                    wallet: 500
                };
                console.log(response.user.uid);
                const docRef = doc(db ,'users' ,response.user.uid );
                setDoc(docRef, user);
                user.push({"UID": response.user.uid});
                commit('setUser', user);
                console.log("登録成功")
            })
            .catch((e) => {
                console.log("登録失敗")
                console.log(e);
            });
        },
        signIn:function({commit}, {userMailaddress, userPassword}){
            const auth = getAuth();
            signInWithEmailAndPassword(auth, userMailaddress, userPassword)
            .then((response) => {
                const getFireStoreData = async function(){                    
                    const docRef = doc(db, "users", response.user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                        const user={...docSnap.data(), 'UID':response.user.uid};
                        commit('setUser', user);
                    } else {
                        console.log("No such document!");
                    }
                    //ダッシュボードに移動
                    router.push('/dashboard');
                };
                getFireStoreData(response.user.uid);
            })
            .catch((e) => {
                console.log(e);
            });
        },
        signOut:function({commit}){
            const auth = getAuth();
            signOut(auth).then(() => {
                // Sign-out successful.
                commit('setUser', null);
                router.push('/');
            }).catch((error) => {
                console.log(error);
                // An error happened.
            });
        },


// 必要データ入力後のsubmitをここに記載して動かしたい
// Add a new document in collection "cities"
// submit:function({commit}, {preliminary}){
submit:function(preliminary){
    console.log(preliminary);
    const companyRef = doc(db, 'company', 'rgCBq5keifzGpzYp4yUA');
    setDoc(companyRef, { name: '無限会社残業' }, { merge: true });
    // commit('company', preliminary);
},
/*        submit:function({commit}, {company, caseName, deadline}){
            const auth = getAuth();
            signInWithEmailAndPassword(auth, userMailaddress, userPassword)
            .then((response) => {
                const getFireStoreData = async function(){                    
                    const docRef = doc(db, "users", response.user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                        const user={...docSnap.data(), 'UID':response.user.uid};
                        commit('setUser', user);
                    } else {
                        console.log("No such document!");
                    }
                    //ダッシュボードに移動
                    router.push('/dashboard');
                };
                getFireStoreData(response.user.uid);
            })
            .catch((e) => {
                console.log(e);
            });
        },*/
// submitここまで
// サンプル
// こんな形でDBの内容を記載する(?)
/*
const docData = {
    // stringExample: "Hello world!",
    // booleanExample: true,
    // numberExample: 3.14159265,
    // dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
    // arrayExample: [5, true, "hello"],
    // nullExample: null,
    alertdate: "",
    case: data,
    casemanager: "",
    column1: "",
    column2: "",
    deadline: data,
    money: "",
    name: data,
    needtime: "",
    repeat: "",
    tax: "",
    

    objectExample: {
        a: 5,
        b: {
            nested: "foo"
        }
    }
};
await setDoc(doc(db, "data", "one"), docData);
//
*/




        updateWallet:async function({commit},{getValue, toUID}){
            try {
                await runTransaction(db, async (transaction) => {
                    const sfDocRef = doc(db, "users", this.getters.user.UID);
                    const sfDoc = await transaction.get(sfDocRef);
                    const toDocRef = doc(db, "users", toUID);
                    const toDoc = await transaction.get(toDocRef);
                    if (!sfDoc.exists() || !toDoc.exists ) {
                        throw "Document does not exist!";
                    }
                    transaction.update(sfDocRef, {wallet: increment(-getValue)});
                    transaction.update(toDocRef, {wallet: increment(getValue)});
                });
                console.log("Transaction successfully committed!");
                commit('updateUser', getValue);
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
        }
    }
})
