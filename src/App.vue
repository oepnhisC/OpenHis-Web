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
		<v-toolbar-title >{{mytitle}}</v-toolbar-title>
		<v-spacer ></v-spacer>
		<v-btn variant="text" rounded="xl" @click="goHome()">返回首页</v-btn>
		<v-btn v-show="username == ''" variant="text" rounded="xl" @click="Login()">登录</v-btn>
		<v-btn v-show="username!= ''" variant="text" rounded="xl" @click="logOut()">退出</v-btn>
		<v-btn v-show="username!= ''" variant="text" rounded="xl"  color="primary">{{'ip:'+ ip }}</v-btn>
		<v-btn v-show="username!= ''" variant="text" rounded="xl"  color="primary">{{ username }}</v-btn>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" temporary>
		<v-list>
			<v-list-item @click="goHome()" >首页</v-list-item>
		</v-list>
		</v-navigation-drawer>

		<v-main>
			<RouterView @setTitle="setTitle($event)" @setbreadcrumbs="setbreadcrumbs($event)" @setUserInfo="setUserInfo($event)"/>
		</v-main>
	</v-layout>
   	<v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
	<v-snackbar v-model="successFlag"  color="success" >操作成功!!!</v-snackbar>
</v-card>

</template>


<style scoped>
</style>


<script >

import { mapActions } from 'vuex';

export default {
  data() {
    return {
      drawer: false,
      mytitle: '首页',
      items: [
        { title: "首页", to:'/' ,replace:true,disabled:false},
      ],
      username:'',
      ip:'',
	  warningFlag: false,
      warningmsg: '',
	  successFlag: false,
    };
  },
  mounted() {
    // this.goHome();
  },
  beforeDestroy() {
    this.drawer = false;
  },
  methods: {
	...mapActions(['updatePermissions']),
    goHome() {
      this.$router.replace('/');
      this.mytitle = '首页';
      this.drawer = false;
    },
    setTitle(title) {
      this.mytitle = title;
    },
    setbreadcrumbs(items) {
      this.items = items;
    },
	
    Login() {
      this.$router.replace('/Login');
      this.drawer = false;
    },
	async logOut(){
		const response = await this.$axios.post('/user/logout');
		if (response.data){
			let result = response.data;
			if(result.code == 0){
				this.$router.replace('/login');
				this.drawer = false;
				this.username = '';
				this.ip = '';
				this.updatePermissions([]);
				this.successFlag = true;
			}else{
				console.log(result);
				this.warningFlag = true;
				this.warningmsg = result.result;
			}
		}

		
	},
	setUserInfo(userinfo) {
      this.username = userinfo.username;
      this.ip = userinfo.ip;
	},
  },
};

</script>

<style>
::-webkit-scrollbar{width:6px;height: 6px;}
::-webkit-scrollbar-track{background:rgb(239,239,239);border-radius: 2px;}
::-webkit-scrollbar-thumb{background-color:#666f7799;border-radius: 10px;}
::-webkit-scrollbar-thumb:hover{background-color:#3b8ee288;}

</style>