<template>
    <v-dialog v-model="flag" style="width: 500px;height: 500px;">
        <div>
            <h2>简易挂号</h2>
            <p>请选择您需要的服务</p>
        </div>
    </v-dialog>
</template>

<script>
export default {
    name: 'JianYiGuaHao',
    data() {
        return {
                items: [
                    { title: "首页", to:'/' ,replace:true,disabled:false},
                    { title: "门诊医生工作站", to:'/MenZhen' ,replace:true,disabled:false},
                    { title:"简易挂号" }
                ],
                flag:true,
            }
        },
    mounted() {
        this.$emit('setTitle','简易挂号');
		this.$emit('setbreadcrumbs',this.items);
    },
    methods: {

    }
}
</script>