<template>
  <div class="signup">
    <h2 class="subtitle has-text-centered">会社名一覧</h2>
    
    <div  v-if="companies.length == 0">
      <p class="has-text-centered">読み込み中...</p>
      <progress class="progress is-small is-primary mb-6" max="100">100%</progress>
  </div>

    
    <table v-else class="table is-fullwidth">
      <thead>
        <tr>
          <th class="has-text-centered">会社名</th>
          <th style="width: 5em;">&nbsp;</th>
        </tr>
      </thead>
        <template v-for="company in companies" :key="company.id">
            <tr>
              <td :class="{
              'is-vcentered' :true,
              'has-text-success has-background-success-light':(this.remains[company.id]>=7)
              ,'has-text-warning has-background-warning-light':(7>this.remains[company.id])
              ,'has-text-danger has-background-danger-light':(this.remains[company.id]<=2)
              }">
              <router-link :to="{ name: 'company', params: {id: company.id } }">{{ company.name }}</router-link></td>
              <td><button @click="showDeleteCompanyModal(company.id, company.name)" class="button is-light">削除</button></td>
            </tr>
        </template>
    </table>
    <p class="has-text-right"><router-link :to="{ name: 'invoice_add'}" class="button is-primary">請求書を追加する</router-link></p>
    <table class="table">
      <thead>
        <tr>
          <th>※凡例</th>
        </tr>
      </thead>
      <tbody>
            <tr>
              <td class="has-text-success has-background-success-light"><a href="#" style="pointer-events: none;">請求書発行期限まで7日以上</a></td>
            </tr>
            <tr>
              <td class="has-text-warning has-background-warning-light"><a href="#" style="pointer-events: none;">請求書発行期限まで2日〜7日</a></td>
            </tr>
            <tr>
              <td class="has-text-danger has-background-danger-light"><a href="#" style="pointer-events: none;">請求書発行期限まで2日未満</a></td>
            </tr>
          </tbody>
    </table>
    
    <div class="modal is-active" v-if="isConfirmModal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">削除確認</p>
          <button class="delete" aria-label="close" @click="isConfirmModal=false">></button>
        </header>
        <section class="modal-card-body">
          {{deleteCompanyName}}の情報（会社情報、請求書情報）を削除してよろしいですか？
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="deleteCompany(deleteCompanyId)">削除する</button>
          <button class="button" @click="isConfirmModal=false">キャンセル</button>
        </footer>
      </div>
    </div>

    <div class="modal is-active" v-if="isSuccessModal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">削除完了</p>
          <button class="delete" aria-label="close" @click="isSuccessModal=false">></button>
        </header>
        <section class="modal-card-body">
          削除しました
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="isSuccessModal=false">閉じる</button>
        </footer>
      </div>
    </div>

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
        recentRemain: '10',
        isConfirmModal: false,
        isSuccessModal: false,
        deleteCompanyId : null,
        deleteCompanyName : null,
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
      showDeleteCompanyModal(company_id, company_name){
        this.deleteCompanyId = company_id;
        this.deleteCompanyName = company_name;
        this.isConfirmModal = true;
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
            this.isConfirmModal = false;
            this.isSuccessModal = true;
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