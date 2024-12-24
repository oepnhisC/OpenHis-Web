<template>
    <div>
        <v-container style="width:100%;margin:0;max-width: 100%;">
          
            <v-row no-gutters>
                <v-col><v-btn @click="this.$router.replace('/ruyuan');$emit('setTitle','病人入院管理')" size="x-large" color="green" >病人入院管理</v-btn></v-col>
                <v-col><v-btn @click="this.$router.replace('/ruyuan02');" size="x-large" color="green" >病人入院管理2.0版</v-btn></v-col>
                <v-col><v-btn size="x-large">更多功能正在开发中...</v-btn></v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

export default {
    name: 'yibaofuzhu',
    data() {
        return {
            items: [
                    { title: "首页", to:'/' ,replace:true,disabled:false},
                    { title: "病人入院管理"},
            ],
        }
    },
    mounted() {
        this.$emit('setbreadcrumbs',this.items);
    },
    methods: {
       
    },
    watch: {
    }
}

</script>