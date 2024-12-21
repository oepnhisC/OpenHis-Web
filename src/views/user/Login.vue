<template>
    <v-container style="width:100%;margin:0;max-width: 100%;">
        <v-row justify="center" ><v-text-field label="工号" v-model="username" type="text" required max-width="344"></v-text-field></v-row>
        <v-row justify="center" ><v-text-field label="密码" v-model="password" type="password" required max-width="344"></v-text-field></v-row>
        <v-row justify="center" ><v-btn color="primary" @click="login()" size="x-large" :loading="loading">登录</v-btn></v-row>
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
    }
  },
  mounted() {
    this.$emit('setTitle','登录')
    this.$emit('setbreadcrumbs',this.items);
  },
  methods: {
	...mapActions(['updatePermissions']),
    async login(){
        this.loading = true;
		const response = await this.$axios.post('/user/login',{username:this.username,password:this.password});
		if (response.data){
			console.log(response.data);
			let result = response.data;
			if(result.code == 0){
				let token=result.result;
				this.$axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
				let permissions = [];
				for(let i=0;i<result.permission.length;i++){
					permissions.push(result.permission[i].fpath);
				}
				this.updatePermissions(permissions);
				this.$router.replace('/');
			}else{
				
			}
		}
		this.loading = false;
    },
  }
}

</script>