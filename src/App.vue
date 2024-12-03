<template >
  <v-card>
   <v-layout>
     <v-app-bar scroll-behavior="hide" >
       <v-app-bar-nav-icon  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
       <v-breadcrumbs :items="items">
        <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
        </v-breadcrumbs>
      <v-spacer ></v-spacer>
      <v-spacer ></v-spacer>
       <v-toolbar-title >{{mytitle}}</v-toolbar-title>
       <v-spacer ></v-spacer>
       <v-btn variant="text" rounded="xl" @click="goHome">返回首页</v-btn>
     </v-app-bar>

     <v-navigation-drawer v-model="drawer" temporary>
       <v-list>
         <v-list-item @click="goHome" >首页</v-list-item>
         <!-- <v-list-item  @click="$router.replace('/about');mytitle='关于'">关于</v-list-item>
         <v-list-item  @click="$router.replace('/test');mytitle='测试'">测试</v-list-item> -->
       </v-list>
     </v-navigation-drawer>

     <v-main>
        <RouterView @setTitle="setTitle($event)" @setbreadcrumbs="setbreadcrumbs($event)"/>
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
      items: [
        { title: "首页", to:'/' ,replace:true,disabled:false},
      ],
    };
  },
  mounted() {
    // this.goHome();
  },
  beforeDestroy() {
    this.drawer = false;
  },
  methods: {
    goHome() {
      this.$router.replace('/');
      this.mytitle = '首页';
    },
    setTitle(title) {
      this.mytitle = title;
    },
    setbreadcrumbs(items) {
      this.items = items;
    },
  },
};

</script>