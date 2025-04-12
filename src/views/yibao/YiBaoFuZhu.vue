<template>
    <div>
        <v-container style="width:100%;margin:0;max-width: 100%;">
          
            <v-row no-gutters>
                <v-col v-if="this.$hasPermission('personInfo')"><v-btn @click="this.$router.replace('/RenYuanYiBaoXinxi');$emit('setTitle','人员医保信息查询')" size="x-large" prepend-icon="mdi-account-search" color="indigo-lighten-1">人员医保信息查询</v-btn></v-col>
                <v-col v-if="this.$hasPermission('getMenZhenZiFeiList')"><v-btn @click="this.$router.replace('/ZiFeiBingRenShangChuan');" size="x-large" prepend-icon="mdi-upload" color="blue-lighten-3">全量自费病人信息上传</v-btn></v-col>
                <v-col v-if="this.$hasPermission('shiqianfenxi')"><v-btn @click="this.$router.replace('/ShiQianFenXi');" size="x-large" prepend-icon="mdi-poll" color="teal-lighten-3">事前分析</v-btn></v-col>
                <v-col v-if="this.$hasPermission('bingren_data')"><v-btn @click="this.$router.replace('/search01');$emit('setTitle','医保就诊信息查询')" size="x-large"  prepend-icon="mdi-magnify" color="secondary" >医保就诊信息查询</v-btn></v-col>
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