<template>

  <header class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          <router-link :to="{ name:'list' }">請求書TOX</router-link>
        </h1>
      </div>
    </div>
  </header>

  <main class="container">

    <p class="has-text-right mt-3">今日の日付：{{ today }}</p>
    <div id ="app">
      <router-view/>
    </div>
  </main>
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
