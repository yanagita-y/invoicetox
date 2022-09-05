<template>
  <div class="signup">
    <h2 class="subtitle has-text-centered">請求書新規登録</h2>
    <div class="container is-max-desktop">
      <table class="table is-fullwidth">
          <tr v-if="flag"></tr>
  <!-- 作成したデータベースの入力項目を作成 -->
          <tr>
            <th class="is-vcentered">相手名称</th>
            <td class="is-vc">
              <template v-if="company_id">
                <input type="text" readonly class="input" disabled v-bind:value="company_name">
                <input type="hidden" v-model="company">
              </template>
              <template v-else>
                <div class="select">
                  <select v-model="company">
                    <option disabled value="">選択して下さい</option>
                    <option v-for="company in companies" v-bind:value="company.id" v-bind:key="company.id">
                        {{ company.name }}
                    </option>
                  </select>
                </div>
              </template>

            </td>
          </tr>
          <tr>
            <th class="is-vcentered">案件名</th><td><input class="input" type="txt" v-model="caseName"></td>
          </tr>
          <!-- <tr>
            <td>案件担当者名：</td><td><input type="txt" v-model="CaseManager"></td>
          </tr> -->
          <tr>
            <th class="is-vcentered">締め切り</th><td><input class="input" type="date" v-model="deadline"></td>
          </tr>
          <!-- <tr>
            <td>アラートを出す日：</td><td><input type="txt" v-model="alertdate"></td>
          </tr>
          <tr>
            <td>繰り返し：</td><td><input type="txt" v-model="repeat"></td>
          </tr>
          <tr>
            <td>金額：</td><td><input type="txt" v-model="money"></td>
          </tr>
          <tr>
            <td>必要稼働時間：</td><td><input type="txt" v-model="needTime"></td>
          </tr>
          <tr>
            <td>税率：</td><td><input type="txt" v-model="tax"></td>
          </tr>
          <tr>
            <td>拡張1：</td><td><input type="txt" v-model="column1"></td>
          </tr>
          <tr>
            <td>拡張2：</td><td><input type="txt" v-model="column2"></td>
          </tr> -->
        </table>

        <div class="has-text-centered">
          <button class="button is-primary" @click="addInvoice">請求書を追加する</button>
        </div>
      </div>

      
      <router-link v-if="company_id" :to="{ name: 'company'}" class="button is-light mt-6">請求書一覧に戻る</router-link>
      <router-link v-else :to="{ name: 'list'}" class="button is-light mt-6">会社一覧に戻る</router-link>

      <transition name="fade">
        <div class="modal is-active" v-if="isSuccessModal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">登録完了</p>
              <button class="delete" aria-label="close" @click="isSuccessModal=false">></button>
            </header>
            <section class="modal-card-body">
              {{ message }}
            </section>
            <footer class="modal-card-foot">
              <button class="button" @click="isSuccessModal=false">閉じる</button>
            </footer>
          </div>
        </div>
      </transition>
  
</div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style> 
<script>
  import { db } from "../main";
  import { collection,addDoc,getDocs } from "firebase/firestore";
  export default {
    data(){
      return {
        name: '',
        mailaddress: '',
        password: '',
        flag: false,
        companies: [],
        company_id: false,
        company_name: '',
        isSuccessModal: false,
        message: '',
      }
    },
    mounted: async function(){
      this.company_id = this.$route.params.id;

      // firestoreからcompanyの一覧を取得する（selectで表示するため）
      const querySnapshot = await getDocs(collection(db, "company"));
      querySnapshot.forEach((doc) => {
        const company = {
          id: doc.id,
          name: doc.data().name
        };
        if(doc.id === this.company_id){
          this.company_name = doc.data().name;
          this.company = this.company_id
        }
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
      addInvoice: function () {
        console.log(this.company);
        
        // dispatchの必要はなく、ここでfirestoreに直接読み書きすればOKでは？
        // this.$store.dispatch('submit', { company: this.company});
        const invoiceRef = collection(db, 'invoice');
        addDoc(invoiceRef, {
          company_id:this.company,
          name:this.caseName,
          deadline:this.deadline,
          alertdate: '',
          case: '',
          casemanager: '',
          column1: '',
          column2: '',
          money: '',
          needtime: '',
          repeat: '',
          tax: '',},
          { merge: true });
          this.message = '「' + this.caseName + '」の請求書を追加しました';
          console.log(1);
          this.caseName = '';
          console.log(2);
          this.deadline = '';
          console.log(3);
          if(!this.company_id){
            this.company = null
          }
          console.log(4);
          this.isSuccessModal = true
          console.log(5);
      }
    }
  }
</script>