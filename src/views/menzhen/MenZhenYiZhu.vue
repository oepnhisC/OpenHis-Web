<template>
<v-dialog v-model="showFlag" persistent fullscreen>
    <div style="padding:0;margin:0;width: 100%;height: 100%;background-color: #fff; " >
        <div style="border-bottom: 1px solid #e0e0e0;">
            <div style="display:inline-block;width:20%;font-size:28px;vertical-align: bottom;text-align:center">新开医嘱</div>
            <!-- 病人信息 -->
            <div style="display: inline-block;width:80%;height: 28px;">
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'姓名：'+ bingRen.fname }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'门诊号：'+ bingRen.fmzh }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'性别：'+ bingRen.fsex }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'年龄：'+ bingRen.fage }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'病人类别：'+ bingRen.fbrlb }}</div>
            </div>
        </div>
        <div style="margin-top:5px;height:300px;border-bottom: 1px solid #e0e0e0;">
            <!-- 医嘱单诊断 -->
            <div style="display: inline-block;vertical-align:top;width:350px;">
                <div style="text-align: center;">当前医嘱单诊断</div>
                <v-data-table :headers="zhenDuanHeaders" :items="zhenDuanList" 
                    :items-per-page="50"  sticky :loading="loading" loading-text="正在加载中"
                    no-data-text="暂无数据"  density="compact" hide-default-footer 
                    style="border:1px solid #e0e0e0;white-space: nowrap;height: 176px;font-size:12px;">
                    <template v-slot:headers>
                        <tr>
                            <th><div>操作</div></th>
                            <th><div>主次</div></th>
                            <th v-for="column in zhenDuanHeaders" :key="column.key"><div :style="{width:column.width}">{{column.title}}</div></th>
                        </tr>
                    </template>
                    <template v-slot:item="{ item }">
                        <tr>
                            <td><v-btn @click="deleteZhenDuan(item)" color="error" size="x-small">删除</v-btn></td>
                            <td><v-btn @click="setZhuDuanZhu(item)" :color="item.fzybz == '主'?'success' :''" size="x-small">{{ item.fzybz  }}</v-btn></td>
                            <td v-for="column in zhenDuanHeaders">{{ item[column.key] }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
            <!-- 医嘱明细 -->
            <div style="display: inline-block;margin-left:5px;">
                <!-- 搜索疾病 -->
                <div style="display: inline-block;vertical-align:top;">
                    <v-text-field v-model="searchJiBingContent" @keydown="searchJiBing"
                        label="疾病编码、名称" density="compact" hide-details width="200px"
                         style="display: inline-block;vertical-align: top;"></v-text-field>
                    <v-btn @click="getICD10Code()" >搜索</v-btn>
                    <div style="position: fixed;width:800px;z-index:999;">
                        <v-data-table v-show="showJiBingFlag"  :headers="jiBingHeaders" :items="jiBingList"  fixed-header  no-data-text="找不到数据" 
                              :items-per-page="50" :items-per-page-text="'条/页'" 
                            density="compact"   style="white-space: nowrap;font-size:12px;z-index:999" height="500px">
                            <template v-slot:headers>
                                <tr>
                                    <th v-for="column in jiBingHeaders" :key="column.key">
                                        <div :style="{width:column.width}">{{column.title}}</div>
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:item="{ item }">
                                <tr @click="selectJiBing(item)">
                                    <td v-for="column in jiBingHeaders">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <div v-show="showJiBingFlag" @click="showJiBingFlag = false" style="position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);"></div>
                <!-- 紧急 并发症 -->
                <div style="display: inline-block;">
                    <v-checkbox v-model="isJinJi" label="紧急" style="display: inline-block;height:20px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                    <v-checkbox v-model="isBingFaZheng" label="并发症" style="display: inline-block;height:20px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                </div>
                <!-- 开始时间 -->
                <div style="vertical-align: top;">
                    <VueDatePicker v-model="beginTime" format="yyyy-MM-dd HH:mm:ss"  auto-apply enable-seconds time-picker-inline
                        locale="zh-cn"  text-input  class="ghcell" placeholder="开始时间"
                        style="width:250px;--dp-input-padding:3px;margin-bottom:5px;display:inline-block;" ></VueDatePicker>
                </div>
                <div>
                    <v-textarea label="医嘱内容" v-model="yiZhuContent" rows="3" row-height="20" style="width:300px;display:inline-block;vertical-align:middle" no-resize hide-details></v-textarea>
                    <v-btn @click="getYiZhuContent()" size="large">搜索</v-btn>
                </div>
            </div>
        </div>
        <div>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
        </div>
    </div>
</v-dialog>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'MenZhenYiZhu',
    components:{
        VueDatePicker
    },
    props:{
        show:{
            type:Boolean,
            default:true
        },
        bingRen:{
            type:Object,
            required:true
        },
        keshiId:{
            type:Number,
            required:true
        },
    },
    data() {
        return {
            showFlag: false,
            // personInfoHeaders:[
			// 	{title:'姓名',key:'fname',width:'40px'},
			// 	{title:'门诊号',key:'fmzh',width:'40px'},
			// 	{title:'性别',key:'fsex',width:'40px'},
			// 	{title:'年龄',key:'fage',width:'40px'},
			// 	{title:'病人类别',key:'fbrlb',width:'60px'},
			// 	// {title:'身份证号',key:'fsfz',width:'40px'},
			// 	// {title:'今日挂号',key:'fjtgh',width:'40px'},
			// 	// {title:'联系电话',key:'fphone',width:'40px'},
			// 	// {title:'住址',key:'faddress',width:'40px'},
			// 	// {title:'会员卡号',key:'fhykh',width:'70px'},
			// 	// {title:'会员余额',key:'fyyye',width:'70px'},
			// 	// {title:'出生日期',key:'fbirthday',width:'40px'},
			// 	// {title:'备注',key:'fbz',width:'40px'},
			// 	// {title:'传染病',key:'fcrb',width:'40px'},
			// 	// {title:'症状体征',key:'fzz',width:'60px'},
			// 	// {title:'并发症',key:'fbfz',width:'40px'},
			// ],

            personInfo :{
                fname:'',
                fmzh:'',
                fsex:'',
                fage:'',
                fbrlb:'',
            },

            loading:false,
            searchJiBingContent:'55',

            zhenDuanList:[],
            zhenDuanHeaders:[
                {title:'编码',key:'ficdbm',width:'40px'},
                {title:'名称',key:'ficdmc',width:'40px'},
                // {title:'灰码',key:'fhuima',width:'40px'},
                {title:'医保版编码',key:'fybbbm',width:'60px'},
                {title:'医保版名称',key:'fybbmc',width:'40px'},
            ],

            showJiBingFlag:false,
            jiBingList:[],
            jiBingHeaders:[
                {title:'编码',key:'ficdbm',width:'40px'},
                {title:'名称',key:'ficdmc',width:'40px'},
                // {title:'灰码',key:'fhuima',width:'40px'},
                {title:'医保版编码',key:'fybbbm',width:'40px'},
                {title:'医保版名称',key:'fybbmc',width:'40px'},
            ],

            isJinJi:false,
            isBingFaZheng:false,
            beginTime:'',
            yiZhuContent:'',
        }
    },
    mounted() {
        
    },
    methods: {
        //搜索疾病编码
        async getICD10Code(){
            if(this.loading){
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/menzhenyizhu/getICD10Code',{content:this.searchJiBingContent});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
                    this.jiBingList = result.result;
                    this.showJiBingFlag = true;

				}else{
                    this.jiBingList = []; 
                    this.showJiBingFlag = true;
				}
			}
            this.loading = false;
        },
        // 按回车搜索疾病
        searchJiBing(event){
            if(event.keyCode == 13){
				this.getICD10Code();
			}
        },
        // 添加选中的疾病
        selectJiBing(item){
            this.showJiBingFlag = false;
            let zditem = {...item};
            for(let i=0;i<this.zhenDuanList.length;i++){
                if(this.zhenDuanList[i].ficdbm == zditem.ficdbm){
                    return;
                }
            }
            //默认第一个诊断为主诊断
            if(this.zhenDuanList.length == 0){
                zditem.fzybz = '主';
            }else{
                zditem.fzybz = '次';
            }
            this.zhenDuanList.push(zditem);
        },
        // 设置主次诊断
        setZhuDuanZhu(item){
            for(let i=0;i<this.zhenDuanList.length;i++){
                if(this.zhenDuanList[i].ficdbm == item.ficdbm){
                    this.zhenDuanList[i].fzybz = '主';
                }else{
                    this.zhenDuanList[i].fzybz = '次';
                }
            }
        },
        // 删除诊断
        deleteZhenDuan(item){
            for(let i=0;i<this.zhenDuanList.length;i++){
                if(this.zhenDuanList[i].ficdbm == item.ficdbm){
                    this.zhenDuanList.splice(i,1);
                    break;
                }
            }
        },
        // 获取医嘱内容
        async getYiZhuContent(){
            if(this.loading){
                return;
            }
            if(this.yiZhuContent.trim() == ''){
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/menzhenyizhu/getYiZhuContent',{content:this.yiZhuContent,keshiId:this.keshiId});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){

				}else{

				}
			}
            this.loading = false;
        },

    },
    watch:{
        show(val){
            this.showFlag = true;
            this.beginTime = new Date();
        }
    }
   

}
</script>


<style scoped>
.highlighted{background-color: #cceeff}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;height: 30px;
}
</style>

