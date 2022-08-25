<template>
  <p style="text-align: right;">{{ today }}</p>
  <div id ="app">
  <router-view/>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        today : ""
      }
    },
    mounted: function(){
      const now = new Date();
      this.today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() ;

    }
  }
</script>
