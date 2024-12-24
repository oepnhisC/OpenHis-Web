<template>
   <v-container style="width:100%;margin:0;max-width: 100%;height: 700px;">
		<v-row justify="start" >
			<v-btn >挂号</v-btn>
			<v-btn >接诊</v-btn>
			<v-btn >新开医嘱</v-btn>
			<v-btn >修改医嘱</v-btn>
			<v-btn >删除医嘱</v-btn>
			<v-btn >发送医嘱</v-btn>
			<v-btn >回退医嘱</v-btn>
		</v-row>
   </v-container>
</template>
  
<script>
export default {
	data() {
		return {
			items: [
				{ title: "首页", to:'/' ,replace:true,disabled:false},
				{ title: "门诊医生工作站" }
			],
		};
	},
	mounted() {
		this.$emit('setTitle','门诊医生工作站');
		this.$emit('setbreadcrumbs',this.items);
	},
	methods: {
		
	}
};
</script>
  