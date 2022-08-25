<template>
  <div class="signup">
    <h1 class="title">一覧</h1>
    <table>
        <template v-for="company in companies" :key="company.id">
            <tr>
              <td :class="{
              'has-text-success has-background-success-light':(this.remains[company.id]>=7)
              ,'has-text-warning has-background-warning-light':(7>this.remains[company.id])
              ,'has-text-danger has-background-danger-light':(this.remains[company.id]<=2)
              }">
              <router-link :to="{ name: 'company', params: {id: company.id } }" >{{ company.name }}</router-link></td>
              <td><button @click="deleteCompany(company.id)" class="button is-light">削除</button></td>
            </tr>
        </template>
    </table>
    <router-link :to="{ name: 'invoice_add'}" class="button is-primary">追加</router-link>
  </div>
</template>

<script>
  import { db } from "../main";
  import { doc,collection,getDocs,runTransaction } from "firebase/firestore";
  import { query, where } from "firebase/firestore";
  export default {
    data(){
      return {
        name: '',
        mailaddress: '',
        password: '',
        flag: false,
        companies: [],
        invoices: [],
        remains: [],
        recentRemain: '10'
      }
    },
    mounted: async function(){
      // firestoreからinvoiceの一覧を取得する（一覧表示のため）
      const querySnapshot2 = await getDocs(collection(db, "invoice"));
      querySnapshot2.forEach((doc) => {

        const remain = (parseInt(new Date(doc.data().deadline)/1000/60/60/24) - parseInt(new Date()/1000/60/60/24));
        if(typeof this.remains[doc.data().company_id] == 'undefined'){
          this.remains[doc.data().company_id] = remain;
        }
        else{
          if(remain < this.remains[doc.data().company_id]){
              this.remains[doc.data().company_id] = remain;
          }
        }
      });

      // firestoreからcompanyの一覧を取得する（selectで表示するため）
      const querySnapshot = await getDocs(collection(db, "company"));
      querySnapshot.forEach((doc) => {
        const company = {
          id: doc.id,
          name: doc.data().name
        };
        // selectでloopを回すための変数に追加していく
        this.companies.push(company);
      });
    },
    methods: {
      // signs: function () {
      //   if(this.name && this.mailaddress && this.password){
      //     this.$store.dispatch('sendAuth', { userName: this.name, userMailaddress: this.mailaddress, userPassword: this.password });
      //   }
      // },
      toggleFlag: function () {
        this.flag = !this.flag;
      },
      deleteCompany: async function(company_id){

        // console.log('削除するIDの一覧')
        // for(let i = 0; i < deleteList.length; i++){
        //   console.log(deleteList[i]);
        //   await deleteDoc(doc(db, "invoice", deleteList[i]));
        // }

        // 削除する請求書配列
        const deleteList = [];
        const q = query(collection(db, "invoice"), where("company_id", "==", company_id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          deleteList.push(doc.id);
        });
        try {
            // トランザクションの開始
            await runTransaction(db, async (transaction) => {
              // 請求書配列を削除
              for(let i = 0; i < deleteList.length; i++){
                transaction.delete(doc(db, "invoice", deleteList[i]));
              }
              // 会社データを削除
              transaction.delete(doc(db, "company", company_id));
            });
            alert('削除しました');
            // 表示している一覧から削除した会社を消す
            for(let i=0; i<this.companies.length; i++){
              if(this.companies[i].id == company_id){
                this.companies.splice(i, 1);
              }
            }
          } catch (e) {
            console.log("Transaction failed: ", e);
          }
      }
      
    }
  }
</script>