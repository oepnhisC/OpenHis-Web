<template>
    <div>

    </div>
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