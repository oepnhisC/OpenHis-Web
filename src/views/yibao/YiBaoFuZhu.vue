<template>
    <div>
        <v-container style="width:100%;margin:0;max-width: 100%;">
          
            <v-row no-gutters>
                <v-col><v-btn @click="this.$router.replace('/RenYuanYiBaoXinxi');$emit('setTitle','人员医保信息查询')" size="x-large">人员医保信息查询</v-btn></v-col>
                <v-col><v-btn @click="this.$router.replace('/ZiFeiBingRenShangChuan');" size="x-large">全量自费病人信息上传</v-btn></v-col>
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
                    { title: "医保辅助功能"},
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