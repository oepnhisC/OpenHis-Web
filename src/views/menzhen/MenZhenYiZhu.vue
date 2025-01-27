<template>
<v-dialog v-model="showFlag" persistent style="width:100%">
    <div style="padding:0;margin:0;max-width: 100%;height:1000px;background-color: #fff; " >

        <!-- 病人信息 -->
        <div >
            <v-data-table :headers="personInfoHeaders" :items="personInfoList" 
                :items-per-page="1"  sticky :loading="loading" loading-text="正在加载中"
                no-data-text="暂无数据"  density="compact" hide-default-footer
                style="font-size:15px;white-space: nowrap;border:1px solid #e0e0e0;width: 100%;height: 100%;" >
                <template v-slot:headers>
                    <tr>
                        <th v-for="column in personInfoHeaders" :key="column.key">
                            <div :style="{width:column.width}">{{column.title}}</div>
                        </th>
                    </tr>
                </template>
                <template v-slot:item="{ item }">
                    <tr><td v-for="column in personInfoHeaders">{{ item[column.key] }}</td></tr>
                </template>
            </v-data-table>
        </div>
        <v-btn @click="showFlag = false">取消</v-btn>
        <v-btn @click="showFlag = false">取消</v-btn>
        <v-btn @click="showFlag = false">取消</v-btn>
        <v-btn @click="showFlag = false">取消</v-btn>
    </div>
</v-dialog>
</template>

<script>
export default {
    name: 'MenZhenYiZhu',
    props:{
        show:{
            type:Boolean,
            default:true
        },
        bingRen:{
            type:Object,
            required:true
        }
    },
    data() {
        return {
            showFlag: false,
            personInfoHeaders:[
				{title:'姓名',key:'fname',width:'40px'},
				{title:'门诊号',key:'fmzh',width:'40px'},
				{title:'性别',key:'fsex',width:'40px'},
				{title:'年龄',key:'fage',width:'40px'},
				{title:'病人类别',key:'fbrlb',width:'60px'},
				// {title:'身份证号',key:'fsfz',width:'40px'},
				// {title:'今日挂号',key:'fjtgh',width:'40px'},
				// {title:'联系电话',key:'fphone',width:'40px'},
				// {title:'住址',key:'faddress',width:'40px'},
				// {title:'会员卡号',key:'fhykh',width:'70px'},
				// {title:'会员余额',key:'fyyye',width:'70px'},
				// {title:'出生日期',key:'fbirthday',width:'40px'},
				// {title:'备注',key:'fbz',width:'40px'},
				// {title:'传染病',key:'fcrb',width:'40px'},
				// {title:'症状体征',key:'fzz',width:'60px'},
				// {title:'并发症',key:'fbfz',width:'40px'},
			],
            personInfoList:[],
            loading:false,
        }
    },
    mounted() {
    },
    methods: {
    },
    watch:{
        show(val){
            this.showFlag = true;
            this.personInfoList = [];
            this.personInfoList.push(this.bingRen);
        }
    }
   

}
</script>


<style scoped>
.v-dialog > .v-overlay__content{width:100%;height:100%}
.highlighted{background-color: #cceeff}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;height: 30px;
}
</style>