<template>
    <div>
        <v-container style="width:100%;margin:0;max-width: 100%;">
            <v-row>
                <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
                </v-breadcrumbs>
            </v-row>
            <v-data-table :headers="headers" :items="danJuList"   @click:row="selectRow"></v-data-table>
        </v-container>
    </div>
</template>


<script>

    export default {
        name: "MenZhenJieZhangGuanLi",
        data() {
            return {
                items: [
                    { title: "首页", to:'/' ,replace:true,disabled:false},
                    { title: "门诊结帐管理" }
                ],
                headers: [],
                danJuList: [],
            }
        },
        methods:{
            // 选择单据
            async selectRow(item,obj) {
                console.log(obj.item);
                

            },
            // 获取单据列表
            async getDanJuList() {
                const response = await this.$axios.post('/shoufei/jiezhangdanju');
                if (response.data){
                    if(response.data.code == 0){
                        let result = response.data;
                        console.log(result);
                        this.jiaofeiList = result.result;
                    }else{
                        console.log(response.data);
                    }
                }
            }
        },
    }
</script>