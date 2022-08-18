<template>
  <div class="signup">
    <h1>新規登録</h1>
    <table>
        <tr v-if="flag"></tr>
<!-- 作成したデータベースの入力項目を作成 -->
        <tr>
          <td>相手名称：</td><td><input type="txt" v-model="company"></td>
        </tr>
        <tr>
          <td>案件名：</td><td><input type="txt" v-model="caseName"></td>
        </tr>
        <!-- <tr>
          <td>案件担当者名：</td><td><input type="txt" v-model="CaseManager"></td>
        </tr> -->
        <tr>
          <td>締め切り：</td><td><input type="date" v-model="deadline"></td>
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
        <button class="button is-primary" @click="submit">送信</button>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: '',
        mailaddress: '',
        password: '',
        flag: false
      }
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
      submit: function () {
        this.$store.dispatch('submit', { company: this.company});
      }
    }
  }
</script>