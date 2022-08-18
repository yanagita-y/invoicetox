<template>
  <div class="signup">
    <h1>{{ name }}</h1>
    <table>
        <template v-for="company in companies" :key="company.id">
            <tr>
                <!-- <td><button>{{ company.name }}</button></td><td><button>削除</button></td> -->
                <td>ここに請求書の一覧を表示してください</td>
            </tr>
        </template>
    </table>


    <router-link :to="{ name: 'invoice_add'}">追加</router-link>
    <router-link :to="{ name: 'list'}">戻る</router-link>
  </div>
</template>

<script>
  import { db } from "../main";
  import { collection,addDoc,getDocs } from "firebase/firestore";
  import { doc, getDoc } from "firebase/firestore";
  export default {
    data(){
      return {
        company_id: null,
        name: '',
        mailaddress: '',
        password: '',
        flag: false,
        companies: [],
      }
    },
    mounted: async function(){
        this.company_id = this.$route.params.id;
        console.log(this.company_id);

        
        // firestoreから自分のデータを取得rする
        const docRef = doc(db, "company", this.company_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            this.name = docSnap.data().name
        } else {
        // doc.data() will be undefined in this case
            console.log("No such document!");
        }

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