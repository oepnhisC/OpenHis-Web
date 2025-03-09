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
		<v-btn v-show="userInfo.name == ''" variant="text" rounded="xl" @click="Login()">登录</v-btn>
		<v-btn v-show="userInfo.name!= ''" variant="text" rounded="xl" @click="logOut()">退出</v-btn>
		<v-btn v-show="userInfo.name!= ''" variant="text" rounded="xl"  color="primary">{{'ip:'+ userInfo.ip }}</v-btn>
		<v-btn v-show="userInfo.name!= ''" variant="text" rounded="xl"  color="primary">{{ userInfo.name+'('+userInfo.keshi+')' }}</v-btn>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" temporary>
		<v-list>
			<v-list-item @click="goHome()" >首页</v-list-item>
		</v-list>
		</v-navigation-drawer>

		<v-main>
			<RouterView @setTitle="setTitle($event)" @setbreadcrumbs="setbreadcrumbs($event)" />
		</v-main>
	</v-layout>
   	<v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
	<v-snackbar v-model="successFlag"  color="success" >操作成功!!!</v-snackbar>
</v-card>

</template>


<style scoped>
</style>


<script >
import { addData, getData } from '@/services/indexedDBService';
import { mapActions,mapState } from 'vuex';

export default {
  data() {
    return {
      drawer: false,
      mytitle: '首页',
      items: [
        { title: "首页", to:'/' ,replace:true,disabled:false},
      ],
      name:'',
	  keshi:'',
      ip:'',
	  warningFlag: false,
      warningmsg: '',
	  successFlag: false,
    };
  },
  mounted() {
    // this.goHome();
	this.getAddress();
  },
  beforeDestroy() {
    this.drawer = false;
  },
  computed:{
	...mapState(['userInfo'])
  },
  methods: {
	...mapActions(['updatePermissions','updateAddress','updateUserInfo']),
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
				this.name = '';
				this.ip = '';
				this.updatePermissions([]);
				this.updateUserInfo({ name:'', ip:'', keshi:'', keshiID:''});
				this.successFlag = true;
			}else{
				console.log(result);
				this.warningFlag = true;
				this.warningmsg = result.result;
			}
		}
		
	},

	//获取所有地址
	async getAddress(){
		let address = await getData(1);
		if(address){
			this.updateAddress(address);
			return ;
		}

		const response = await this.$axios.get('/gonggong/getAddress');
		if (response.data){
			let result = response.data;
			if(result.code == 0){
				console.log(result);
				let data = {
					"id":1,
					"shengList": result.result.sheng,
					"shiList": result.result.shi,
					"quList": result.result.qu,
					"zhenList": result.result.zhen,
				}
				this.updateAddress(data);
				await addData(data);
			}else{
				this.warningFlag = true;
				this.warningmsg = result.result;
			}
		}
	}


  },
};

</script>

<style>
::-webkit-scrollbar{width:6px;height: 6px;}
::-webkit-scrollbar-track{background:rgb(239,239,239);border-radius: 2px;}
::-webkit-scrollbar-thumb{background-color:#666f7799;border-radius: 10px;}
::-webkit-scrollbar-thumb:hover{background-color:#3b8ee288;}

</style>