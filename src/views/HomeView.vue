<template>
  <v-container style="width: 100%;min-height: 700px;">
    <v-row>
      <v-col  v-if="userInfo.name== ''"><v-btn @click="this.$router.replace('/Login');$emit('setTitle','登录')" size="x-large" prepend-icon="mdi-login" color="blue-lighten-4">登录</v-btn></v-col>
      <v-col v-if="this.$hasPermission('changePassword')"><v-btn @click="this.$router.replace('/ChangePassword');" size="x-large" prepend-icon="mdi-key-change" color="deep-purple-lighten-4">修改密码</v-btn></v-col>
      <v-col v-if="this.$hasPermission('yibaofuzhu')"><v-btn  @click="this.$router.replace('/yibaofuzhu');$emit('setTitle','医保辅助功能')" size="x-large" prepend-icon="mdi-hospital-building" color="yellow-lighten-1">医保辅助功能</v-btn></v-col>
      <v-col v-if="this.$hasPermission('jiezhangdanju')"><v-btn @click="this.$router.replace('/MenZhenJZGuanLi');$emit('setTitle','门诊结账管理')" size="x-large">门诊结账管理</v-btn></v-col>
      <v-col><v-btn  @click="this.$router.replace('/GaoLingZiFeiBiao');$emit('setTitle','高龄自费计算表')" size="x-large" prepend-icon="mdi-human-cane">高龄自费计算表</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/dad');$emit('setTitle','病人入院管理')" size="x-large" color="green" >病人入院管理</v-btn></v-col>
      <v-col v-if="this.$hasPermission('vipcard')" ><v-btn @click="this.$router.replace('/vipcard');$emit('setTitle','会员管理')" size="x-large" color="green">会员管理</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/menzhen');" size="x-large" prepend-icon="mdi-doctor" color="secondary">门诊医生工作站</v-btn></v-col>
      <v-col v-if="this.$hasPermission('userManger')"><v-btn @click="this.$router.replace('/HISManager');" size="x-large" prepend-icon="mdi-star-david" color="deep-orange-accent-3">管理员功能</v-btn></v-col>


      <v-col><v-btn size="x-large">更多功能正在开发中...</v-btn></v-col>

    </v-row>
  </v-container>
</template>


<style scoped>

</style>


<script>
import { mapState } from 'vuex';

export default {
	data: () => ({
		items: [
			{ title: "首页", to:'/' ,replace:true,disabled:false},
          
		],
		
	}),
	mounted:function(){
		this.$emit('setbreadcrumbs',this.items);
        this.$emit('setTitle','首页');
	},
  computed:{
	...mapState(['userInfo'])
  },
	methods: {
	

	},

}


</script>
