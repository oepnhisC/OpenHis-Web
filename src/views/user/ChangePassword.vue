<template>
    <v-container style="width:100%;margin:0;max-width: 100%;height: 700px;">
        <v-row justify="center" style="margin-top: 100px;" >
            <v-text-field label="旧密码" v-model="oldpassword" type="password" required max-width="344" @keydown="handleKeydown" ref="oldpassword"></v-text-field>
        </v-row>
        <v-row justify="center" >
            <v-text-field label="新密码" v-model="newpassword" type="password" required max-width="344"  @keydown="handleKeydown2" ref="newpassword"></v-text-field>
        </v-row>
        <v-row justify="center" >
            <v-text-field label="确认新密码" v-model="newpassword2" type="password" required max-width="344" @keydown="handleKeydown3" ref="newpassword2"></v-text-field>
        </v-row>
        <v-row justify="center" ><v-btn color="primary" @click="changePassword()" size="x-large" :loading="loading">确认修改</v-btn></v-row>

		<v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
        <v-snackbar v-model="successFlag"  color="success" >操作成功!!!</v-snackbar>
    </v-container>

</template>

<script>
export default {
    name: 'ChangePassword',
    data() {
        return {
            oldpassword: '',
            newpassword: '',
            newpassword2: '',
            loading: false,
            warningFlag: false,
            warningmsg: '',
            items: [
                { title: "首页", to:'/' ,replace:true,disabled:false},
                { title: "修改密码" }
            ],
            successFlag: false,

        }
    },
    mounted() {
        this.$emit('setTitle','修改密码')
        this.$emit('setbreadcrumbs',this.items);
        this.$refs.oldpassword.focus();
    },
    methods: {
        handleKeydown(event) {
			if (event.key === 'Enter') {
				this.$refs.newpassword.focus();
			}
		},
        handleKeydown2(event) {
			if (event.key === 'Enter') {
				this.$refs.newpassword2.focus();
			}
        },
        handleKeydown3(event) {
			if (event.key === 'Enter') {
				this.changePassword();
			}
        },
        // 修改密码
        async changePassword() {
            if (this.oldpassword === '') {
                this.warningmsg = '请输入旧密码！';
                this.warningFlag = true;
                return;
            }
            if (this.newpassword === '') {
                this.warningmsg = '请输入新密码！';
                this.warningFlag = true;
                return;
            }
            if (this.newpassword !== this.newpassword2) {
                this.warningmsg = '两次输入的密码不一致，请重新输入！';
                this.warningFlag = true;
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/user/changePassword',{'oldPassword':this.oldpassword,'newPassword':this.newpassword});
			if (response.data){
				console.log(response.data);
				let result = response.data;
				if(result.code == 0){
                    this.successFlag = true;
                    this.oldpassword = '';
                    this.newPassword = '';
                    this.newPassword2 = '';
                    
				}else{
					this.warningFlag = true;
					this.warningmsg = result.result;
				}
			}
            this.loading = false;
        },
    }
}
</script>