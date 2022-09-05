<template>
  <div>
    <div  v-if="!initialized">
      <h2 class="subtitle has-text-centered"></h2>
      <p class="has-text-centered">読み込み中...</p>
      <progress class="progress is-small is-primary mb-6" max="100">100%</progress>
    </div>

    <div v-else>
      <h2 class="subtitle has-text-centered">{{ name }}の請求書一覧</h2>
      <p v-if="invoices.length == 0" class="has-text-centered">請求書は登録されていません。</p>
      <table class="table is-fullwidth" v-else>
        <thead>
          <tr>
            <th class="has-text-centered">案件名</th>
            <th class="has-text-centered" colspan="2">期日</th>
            <th style="width: 5em;">&nbsp;</th>
          </tr>
        </thead>
            <template v-for="invoice in invoices" :key="invoice.id">
              <tr>
                  <td :class="{
                    'is-vcentered' :true,
                  'has-text-success has-background-success-light':(invoice.remain>=7)
                  ,'has-text-warning has-background-warning-light':(7>invoice.remain)
                  ,'has-text-danger has-background-danger-light':(invoice.remain<=2)
                  }"><a href="#" style="pointer-events: none;">{{invoice.name}}</a></td>
                  <td class="has-text-info has-background-info-light is-vcentered" style="width:8em">{{ invoice.deadline }}</td>
                  <td class="has-text-link has-background-link-light is-vcentered">まで{{ invoice.remain }}日</td>
                  <td><button class="button is-light" @click="showDeleteInvoiceModal(invoice.id, invoice.name)">削除</button></td>
                  <!-- <td><button class="button is-success is-light" @click="sendInvoice(invoice.id)">送信</button></td> -->
              </tr>
          </template>
      </table>
    </div>

    <div class="is-flex is-justify-content-space-between mt-6">
      <router-link :to="{ name: 'list'}" class="button is-light">会社一覧に戻る</router-link>
      <router-link :to="{ name: 'company_invoice_add'}" class="button is-primary">請求書を追加する</router-link>
    </div>

    <table class="table mt-6">
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
              <td class="has-text-warning has-background-warning-light"><a href="#" style="pointer-events: none;">請求書発行期限まで2日〜6日</a></td>
            </tr>
            <tr>
              <td class="has-text-danger has-background-danger-light"><a href="#" style="pointer-events: none;">請求書発行期限まで2日未満</a></td>
            </tr>
            <tr>
              <td class=""><a href="#" style="pointer-events: none;">請求書登録なし</a></td>
            </tr>
          </tbody>
    </table>

    <transition name="fade">
      <div class="modal is-active" v-if="isConfirmModal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">削除確認</p>
            <button class="delete" aria-label="close" @click="isConfirmModal=false">></button>
          </header>
          <section class="modal-card-body">
            請求書「{{deleteInvoiceName}}」を削除してよろしいですか？
          </section>
          <footer class="modal-card-foot">
            <button class="button is-danger" @click="deleteInvoice(deleteInvoiceId)">削除する</button>
            <button class="button" @click="isConfirmModal=false">キャンセル</button>
          </footer>
        </div>
      </div>
    </transition>

    <transition name="fade">
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
  import { doc, getDoc, runTransaction } from "firebase/firestore";
  // import { createTransport } from "nodemailer";
  export default {
    data(){
      return {
        initialized: false,
        company_id: null,
        name: '',
        mailaddress: '',
        password: '',
        flag: false,
        companies: [],
        invoices: [],
        isConfirmModal: false,
        isSuccessModal: false,
        deleteInvoiceId : null,
        deleteInvoiceName : null,
      }
    },
    mounted: async function(){
        this.company_id = this.$route.params.id;
        console.log(this.company_id);
        
        // firestoreから自分のデータを取得する
        const docRef = doc(db, "company", this.company_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            this.name = docSnap.data().name
        } else {
        // doc.data() will be undefined in this case
            console.log("No such document!");
        }

        // firestoreからinvoiceの一覧を取得する（一覧表示のため）
        const querySnapshot2 = await getDocs(collection(db, "invoice"));
        querySnapshot2.forEach((doc) => {
          // console.log(doc);
          // console.log(doc.id);
          // console.log(doc.data().name);
          if(this.company_id===doc.data().company_id){
            const invoice = {
              id: doc.id,
              name: doc.data().name,
              deadline: doc.data().deadline,
              remain:(parseInt(new Date(doc.data().deadline)/1000/60/60/24) - parseInt(new Date()/1000/60/60/24))
            };
            this.invoices.push(invoice);
            console.log(invoice.remain);
          }
          // selectでloopを回すための変数に追加していく
        });
        this.initialized = true;

      // // firestoreからcompanyの一覧を取得する（selectで表示するため）
      // const querySnapshot = await getDocs(collection(db, "company"));
      // querySnapshot.forEach((doc) => {
      //   const company = {
      //     id: doc.id,
      //     name: doc.data().name
      //   };
      //   // selectでloopを回すための変数に追加していく
      //   this.companies.push(company);
      // });
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
      showDeleteInvoiceModal(invoice_id, invoice_name){
        this.deleteInvoiceId = invoice_id;
        this.deleteInvoiceName = invoice_name;
        this.isConfirmModal = true;
      },

      deleteInvoice: async function(invoice_id){
        try {
            // トランザクションの開始
            await runTransaction(db, async (transaction) => {
              // 請求書データを削除
              transaction.delete(doc(db, "invoice", invoice_id));
            });
            this.isConfirmModal = false;
            this.isSuccessModal = true;
            // 表示している一覧から削除した会社を消す
            for(let i=0; i<this.invoices.length; i++){
              if(this.invoices[i].id == invoice_id){
                this.invoices.splice(i, 1);
              }
            }
          } catch (e) {
            console.log("Transaction failed: ", e);
          }
        },

// nodemailerでのメール送信テスト
//       sendInvoice: async function(invoice_id){
// // メール送信準備
//         const transporter = createTransport({
//           host: "reinoindex.co.jp",
//           port: 465,
//           secure: true,
//           auth: {
//           user: "devnodemailer@reinoindex.co.jp", // メールアドレス
//           pass: "" // パスワード
//           }
//         });
// // 送信準備ここまで

//         try {
//           await transporter.sendMail({
//             from: `"try"<devnodemailer@reinoindex.co.jp>`,
//             to: `y_yanagita@reinoindex.co.jp`,
//             subject: "送信テスト",
//             text: `${{invoice_id}}nodemailer導入して送信テスト。ひとまず請求書を削除時に送信してみるテスト。お名前.comサーバーに専用アドレス追加しそちらを認証。`
//           });
//         } catch (error) {
//           console.log(`メールを送信できませんでした`);
//           throw error;
//         }
//       },
// nodemailerでのメール送信テストここまで

      addInvoice: function () {
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
      },
    }
  }
</script>