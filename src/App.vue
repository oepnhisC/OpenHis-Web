<template >
  <v-card>
   <v-layout>
     <v-app-bar scroll-behavior="hide" >
       <v-app-bar-nav-icon  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
       <v-toolbar-title >{{mytitle}}</v-toolbar-title>
       <v-spacer ></v-spacer>
       <v-btn variant="text" rounded="xl" @click="goHome">返回首页</v-btn>
     </v-app-bar>

     <v-navigation-drawer v-model="drawer" temporary>
       <v-list>
         <v-list-item @click="goHome" >首页</v-list-item>
         <v-list-item  @click="$router.push('/about');mytitle='关于'">关于</v-list-item>
         <v-list-item  @click="$router.push('/test');mytitle='测试'">测试</v-list-item>
       </v-list>
     </v-navigation-drawer>

     <v-main>
       <RouterView @setTitle="setTitle($event)"/>
     </v-main>
   </v-layout>
 </v-card>

</template>


<style scoped>
</style>


<script >
export default {
  data() {
    return {
      drawer: false,
      mytitle: '首页',
    };
  },
  mounted() {
    this.goHome();
  },
  beforeDestroy() {
    this.drawer = false;
  },
  methods: {
    goHome() {
      this.$router.push('/');
      this.mytitle = '首页';
    },
    setTitle(title) {
      this.mytitle = title;
    }
  },
};

</script>