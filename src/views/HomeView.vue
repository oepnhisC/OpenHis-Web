<template>
  <v-container style="width: 100%;min-height: 700px;">
    <v-row>
      <v-col><v-btn @click="this.$router.replace('/Login');$emit('setTitle','登录')" size="x-large">登录</v-btn></v-col>
      <v-col><v-btn v-if="hasPermission('/yibaofuzhu')" @click="this.$router.replace('/yibaofuzhu');$emit('setTitle','医保辅助功能')" size="x-large">医保辅助功能</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/MenZhenJZGuanLi');$emit('setTitle','门诊结账管理')" size="x-large">门诊结账管理</v-btn></v-col>
      <v-col><v-btn v-if="hasPermission('/shoufei/gaolingjifeihuizong')" @click="this.$router.replace('/GaoLingZiFeiBiao');$emit('setTitle','高龄自费计算表')" size="x-large">高龄自费计算表</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/dad');$emit('setTitle','病人入院管理')" size="x-large" color="green" >病人入院管理</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/HISManager');" size="x-large" >管理员功能</v-btn></v-col>

      <v-col><v-btn size="x-large">更多功能正在开发中...</v-btn></v-col>

      <!-- <v-col><v-btn @click="this.$router.replace('/guahao');$emit('setTitle','挂号')">挂号</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/menzhen');$emit('setTitle','门诊')">门诊</v-btn></v-col>
      <v-col><v-btn>住院</v-btn></v-col>
      <v-col><v-btn size="x-large">体检</v-btn></v-col>
      <v-col><v-btn @click="this.$router.replace('/shoufei');$emit('setTitle','收费')">收费</v-btn></v-col> -->
    </v-row>
    <!-- <v-row>
      <v-col><v-btn>检验</v-btn></v-col>
      <v-col><v-btn>B超</v-btn></v-col>
      <v-col><v-btn>心电图</v-btn></v-col>
      <v-col><v-btn>放射</v-btn></v-col>
      <v-col><v-btn>报表</v-btn></v-col>
    </v-row> -->
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
	},
	computed:{
		...mapState(['permissions']),
	},
	methods: {
		hasPermission(permission){
			for(let i=0;i<this.permissions.length;i++){
				console.log(this.permissions[i],permission);
				if(this.permissions[i].includes(permission)){
					return true;
				}
			}
			return false;
		}

	},

}


</script>
