<template>
    <v-container style="width:100%;margin:0;max-width: 100%;height: 700px;">
        <v-row justify="center" style="margin-top: 100px;" ><v-text-field label="工号" v-model="username" type="text" required max-width="344" ref="username" @keydown="handleKeydown"></v-text-field></v-row>
        <v-row justify="center" ><v-text-field label="密码" v-model="password" type="password" required max-width="344" ref="password" @keydown="handleKeydown2"></v-text-field></v-row>
        <v-row justify="center" ><v-btn color="primary" @click="login()" size="x-large" :loading="loading">登录</v-btn></v-row>

		<v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
    </v-container>

</template>

<script>
import { mapActions } from 'vuex';

 
export default {
	name: 'Login',
	data() {
		return {
			items: [
				{ title: "登录"},
			],
			username: '',
			password: '',
			loading: false,
			warningFlag: false,
			warningmsg: ''
		}
	},
	mounted() {
		this.$emit('setTitle','登录')
		this.$emit('setbreadcrumbs',this.items);
		this.$refs.username.focus();
	},
	methods: {
		...mapActions(['updatePermissions','updateUserInfo']),
		async login(){
			this.loading = true;
			const response = await this.$axios.post('/user/login',{username:this.username,password:this.password});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
					let token=result.result;
					this.$axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
					let permissions = [];
					for(let i=0;i<result.permission.length;i++){
						permissions.push(result.permission[i].fpath);
					}
					this.updatePermissions(permissions);
					let userInfo = {
						'name':result.fname,
						'ip':result.ip,
						'keshi':result.fks,
						'keshiID':result.fksid
					};
					this.updateUserInfo(userInfo);
					this.$router.replace('/');
				}else{
					this.warningFlag = true;
					this.warningmsg = result.result;
				}
			}
			this.loading = false;
		},
		handleKeydown(event) {
			if (event.key === 'Enter') {
				this.$refs.password.focus();
			}
		},
		handleKeydown2(event) {
			if (event.key === 'Enter') {
				this.login();
			}
		},
	}
}

</script>