<template>
  <div class="signup">
    <h1 class="title">{{ name }}</h1>
    <table>
          <template v-for="invoice in invoices" :key="invoice.id">
            <tr>
                <td class="has-text-primary has-background-primary-light">{{ invoice.name }}</td><td><button class="button is-link is-light" @click="deleteInvoice(invoice.id)">削除</button></td>
            </tr>
        </template>
    </table>


    <router-link :to="{ name: 'company_invoice_add'}">追加</router-link>
    <router-link :to="{ name: 'list'}">戻る</router-link>
  </div>
</template>

<script>
  import { db } from "../main";
  import { collection,addDoc,getDocs } from "firebase/firestore";
  import { doc, getDoc, runTransaction } from "firebase/firestore";
  export default {
    data(){
      return {
        company_id: null,
        name: '',
        mailaddress: '',
        password: '',
        flag: false,
        companies: [],
        invoices: []
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
          console.log(doc);
          console.log(doc.id);
          console.log(doc.data().name);
          const invoice = {
            id: doc.id,
            name: doc.data().name
          };
          // selectでloopを回すための変数に追加していく
          this.invoices.push(invoice);
          console.log(this.invoices)
        });

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

      deleteInvoice: async function(invoice_id){
        try {
            // トランザクションの開始
            await runTransaction(db, async (transaction) => {
              // 請求書データを削除
              transaction.delete(doc(db, "invoice", invoice_id));
            });
            alert('削除しました');
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
      }
    }
  }
</script>