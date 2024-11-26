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
            <v-row no-gutters>
                <v-col cols="4" align="center" style="padding:0 10px">
                    <v-row no-gutters><v-col align="center" style="font-size:23px">请填入参保人信息</v-col></v-row>
                    <v-row no-gutters><v-select hide-details v-model="mdtrt_cert_type" :items="options1" label="就诊凭证类型"></v-select></v-row>
                    <v-row no-gutters><v-text-field :rules="rules" hide-details v-model="mdtrt_cert_no" :label="label" clearable></v-text-field></v-row>
                    <!-- <v-row no-gutters><v-text-field hide-details v-model="card_sn" label="卡识别码"></v-text-field></v-row> -->
                    <!-- <v-row no-gutters><v-text-field hide-details v-model="begntime" label="开始时间"></v-text-field></v-row> -->
                    <!-- <v-row no-gutters><v-select hide-details v-model="psn_cert_type" :items="options2" label="患者证件类型"></v-select></v-row> -->
                    <v-row no-gutters><v-text-field hide-details v-model="insuplc_admdvs" label="参保地区划（一般外省才需要填）" clearable></v-text-field></v-row>
                    <v-row><v-col align="center"><v-btn size="x-large" @click="personInfo()" :loading="loading">查询</v-btn></v-col></v-row>
                    
                </v-col>

                <v-col cols="8" align="center" style="padding:0 10px">
                    <v-row no-gutters><v-col align="center" style="font-size:20px" >基础信息</v-col></v-row>
                    <v-row no-gutters>
                        <v-col  cols="4" align="left">姓名：{{ personInfoJson.baseinfo.psn_name }}</v-col>
                        <v-col  cols="4" align="left">性别：{{ personInfoJson.baseinfo.gend  =='2'?'女':'男' }}</v-col>
                        <v-col  cols="4" align="left">年龄：{{   personInfoJson.baseinfo.age }}</v-col>
                        <v-col  cols="4" align="left">生日： {{ personInfoJson.baseinfo.brdy }}</v-col>
                        <v-col  cols="4" align="left">民族：{{ minzu(personInfoJson.baseinfo.naty)  }}</v-col>
                    </v-row>
                    <v-row no-gutters>
                            <v-col  cols="8" align="left">人员编号：{{ personInfoJson.baseinfo.psn_no }}</v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col>参保地医保区划</v-col>
                        <v-col>险种类型</v-col>
                        <v-col>单位</v-col>
                    </v-row>
                    <v-row no-gutters v-for = "item in personInfoJson.insuinfo" >
                        <v-col  cols="4" >{{ item.insuplc_admdvs }}</v-col>
                        <v-col  cols="4" >{{  xianzhongleixing(item.insutype) }}</v-col>
                        <v-col  cols="4" >{{ item.emp_name }}</v-col>
                    </v-row>
                    <v-row no-gutters><hr style="border:1px solid #000000;width: 100%;" /></v-row>

                    <v-container style="width:100%;margin:0;max-width: 100%;padding: 0" v-show="manbingList.length>0">
                        <v-row ><v-col align="center" style="font-size:20px">慢特病备案信息</v-col></v-row>
                        <v-row no-gutters>
                            <v-col>慢特病</v-col>
                            <v-col>慢特病编码</v-col>
                            <v-col>开始时间</v-col>
                            <v-col>结束时间</v-col>
                            <v-col>区划</v-col>
                            <v-col>险种</v-col>
                        </v-row>
                        <v-row no-gutters v-for="item in manbingList" :class="{'greenBG':isTimeScope(item.begndate,item.enddate)}">
                            <v-col>{{ item.opsp_dise_name }}</v-col>
                            <v-col>{{ item.opsp_dise_code }}</v-col>
                            <v-col>{{ item.begndate }}</v-col>
                            <v-col>{{ item.enddate }}</v-col>
                            <v-col>{{ mantebingbeizhu1(item.exp_content) }}</v-col>
                            <v-col>{{ mantebingbeizhu2(item.exp_content) }}</v-col>
                        </v-row>
                        <v-row no-gutters><hr style="border:1px solid #000000;width: 100%;" /></v-row>
                    </v-container>
                    <v-container style="width:100%;margin:0;max-width: 100%;padding: 0" v-show="dingdianList.length>0">
                        <v-row ><v-col align="center" style="font-size:20px">定点信息</v-col></v-row>
                        <v-row no-gutters>
                            <v-col>机构</v-col>
                            <v-col>开始时间</v-col>
                            <v-col>结束时间</v-col>
                            <v-col>险种</v-col>
                        </v-row>
                        <v-row no-gutters v-for="item in dingdianList" :class="{'greenBG':isTimeScope(item.begndate,item.enddate)}">
                            <v-col>{{ item.fixmedins_name }}</v-col>
                            <v-col>{{ item.begndate }}</v-col>
                            <v-col>{{ item.enddate }}</v-col>
                            <v-col>{{ xianzhongleixing(item.insutype) }}</v-col>
                        </v-row>
                        <v-row no-gutters><hr style="border:1px solid #000000;width: 100%;" /></v-row>
                    </v-container>
                </v-col>

            </v-row>
            <v-row><v-col><v-alert density="compact" title="失败" type="error"  v-show="errFlag">{{ errmsg }}</v-alert></v-col></v-row>
            <v-row ><v-col align="center" style="font-size:30px">缴费信息</v-col></v-row>
            <v-row><v-col align="center" style="font-size:20px">注意：职工一般当月缴费，下个月享受。灵活就业需连续缴费3个月，下个月才能享受。城乡一般缴费一次全年享受。</v-col></v-row>
            <v-row no-gutters style="margin-top:20px">
                <v-col>统筹区</v-col>
                <v-col>险种类型</v-col>
                <v-col>缴费时间</v-col>
                <v-col>缴费状态</v-col>
                <v-col>缴费开始月份</v-col>
                <v-col>缴费结束月份</v-col>
            </v-row>
            <v-row v-for = "item in jiaofeiList" no-gutters :class="{'greenBG':jiaofeiFuHe(item.accrym_begn,item.accrym_end,item.insutype)}">
                <v-col>{{ item.poolarea_no }}</v-col>
                <v-col>{{ item.insutype_name }}</v-col>
                <v-col>{{ item.clct_time }}</v-col>
                <v-col>{{ item.clct_flag_name }}</v-col>
                <v-col>{{ item.accrym_begn }}</v-col>
                <v-col>{{ item.accrym_end }}</v-col>
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
                    { title: "医保辅助功能",to:'/yibaofuzhu',replace:true,disabled:false },
                    {title:'个人医保信息查询'}
            ],

            mdtrt_cert_type: '02',
            options1: [
                { title: '01电子医保凭证', value: '01'},
                { title: '02居民身份证', value: '02' },
                { title: '03社会保障卡', value: '03' },
                { title: '04其他：目前支持港澳社保卡(HKG或MAC开头)，其他未知', value: '04' }
            ],
            mdtrt_cert_no: '',
            card_sn: '',
            begntime: '',
            psn_cert_type: '',
            options2: [
                { title: '01居民身份证（户口簿）', value: '01' },
                { title: '04香港特区护照/港澳居民来往内地通行证', value: '04' },
                { title: '05澳门特区护照/港澳居民来往内地通行证', value: '05' },
                { title: '06台湾居民来往大陆通行证', value: '06' },           
                { title: '07外国人永久居留证', value: '07' },
                // { title: '08外国人护照', value: '08' },
                // {title:'02中国人民解放军军官证',value:'02'},
                // {title:'03中国人民武装警察警官证',value:'03'},
                // {title:'09残疾人证',value:'09'},
                // {title:'10军烈属证明',value:'10'},
                // {title:'11外国人就业证',value:'11'},
                // {title:'12外国专家证',value:'12'},
                // {title:'13外国人常驻记者证',value:'13'},
                // {title:'14台港澳人员就业证',value:'14'},
                // {title:'15回国（来华）定居专家证',value:'15'},
                // {title:'90社会保障卡',value:'90'},
                // {title:'990201医学出生证明',value:'990201'},
                // { title: '99其他身份证件', value: '99' },
            ],
            certno: '',
            psn_name: '',
            insuplc_admdvs: '',
            rules:[
                value => !!value || 'Required.',
            ],
            label: '参保人证件号码',
            errFlag: false,
            errmsg: '',

            personInfoJson: {
                baseinfo:{age: '',brdy: '',psn_name: '',},
                insuinfo:[],
                idetinfo:[]
            },
            jiaofeiList:[],
            manbingList:[],
            dingdianList:[],
            loading:false,
        }
    },
    methods: {
        //获取人员信息
        async personInfo(){
            
            if(!this.mdtrt_cert_no){
                this.errFlag = true;
                this.errmsg = '请填写参保人证件号码';
                return;
            }
            if(this.mdtrt_cert_type == '02' && this.mdtrt_cert_no.length != 18){
                this.errFlag = true;
                this.errmsg = '请填写正确的身份证号码';
                return;
            }
            this.errFlag = false;
            this.loading = true;
            this.certno = this.mdtrt_cert_no;
            const response = await this.$axios.post('/yibaofuzhu/personInfo',{
                mdtrt_cert_type: this.mdtrt_cert_type,
                mdtrt_cert_no:this.mdtrt_cert_no,
                card_sn: this.card_sn,
                begntime: this.begntime,
                psn_cert_type: this.psn_cert_type,
                certno: this.certno,
                psn_name: this.psn_name,
                insuplc_admdvs: this.insuplc_admdvs
            });
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    this.errFlag = false;
                    this.personInfoJson = result.result;
                    this.getPayInfo(this.personInfoJson.baseinfo.psn_no);
                    this.getManBingInfo(this.personInfoJson.baseinfo.psn_no);
                    this.getDingDianInfo(this.personInfoJson.baseinfo.psn_no);
                }else{
                    console.log(response.data);
                    this.errFlag = true;
                    this.errmsg = response.data.result ;
                }
            }
            this.loading = false;

        },

        //获取缴费信息
        async getPayInfo(psn_no){
            const response = await this.$axios.post('/yibaofuzhu/jiaofeiInfo',{psn_no:psn_no});
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    this.jiaofeiList = result.result;
                }else{
                    console.log(response.data);
                }
            }
        },
        
        //获取慢特病信息
        async getManBingInfo(psn_no){
            const response = await this.$axios.post('/yibaofuzhu/manbingInfo',{psn_no:psn_no});
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    if(result.result.feedetail){
                        this.manbingList = result.result.feedetail;
                    }
                }else{
                    console.log(response.data);
                    this.errFlag = true;
                    this.errmsg = response.data.result ;
                }
            }
        },


        //获取定点信息
        async getDingDianInfo(psn_no){
            const response = await this.$axios.post('/yibaofuzhu/dingdianInfo',{psn_no:psn_no});
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    if(result.result.psnfixmedin){
                        this.dingdianList = result.result.psnfixmedin;
                    }
                }else{
                    console.log(response.data);
                    this.errFlag = true;
                    this.errmsg = response.data.result ;
                }
            }
        },

        //险种类型
        xianzhongleixing(insutype){
            switch (insutype) {
                case '390':return '城乡';
                case '310':return '职工';
                case '340':return '离休';
                case '510':return '生育';
                default:return insutype;
            }
        },
        //民族
        minzu(naty){
            switch (naty) {
                case '01':return '汉族';
                default:return naty;
            }
        },

        //慢特病备注1
        mantebingbeizhu1(exp_content){
            let beizhu = JSON.parse(exp_content);
            return beizhu.poolareaNo
        },
        //慢特病备注2
        mantebingbeizhu2(exp_content){
            let beizhu = JSON.parse(exp_content);
            return this.xianzhongleixing(beizhu.insutype);
        },
        //符合时间范围
        isTimeScope(begindate,enddate){
            begindate = new Date(begindate);
            enddate = new Date(enddate);
            let current = new Date();
            if(current < begindate || current > enddate){
                return false;
            }else{
                return true;
            }
        },
        jiaofeiFuHe(begindate,enddate,insutype){


            const year1 = parseInt(begindate.slice(0, 4), 10);
            const month1 = parseInt(begindate.slice(4, 6), 10) - 1; // 月份从 0 开始
            const begind = new Date(year1, month1, 1);

            const year2 = parseInt(enddate.slice(0, 4), 10);
            const month2 = parseInt(enddate.slice(4, 6), 10) - 1; // 月份从 0 开始
            const endd = new Date(year2, month2, 1); 


            let current = new Date();
            const today = new Date(current.getFullYear(), current.getMonth());


            if(insutype == '390'){
                console.log(today < begind || today > endd)
                if(today < begind || today > endd){
                    return false;
                }else{
                    return true;
                }
            }else if(insutype == '310'){
                let lastMonth = new Date(current.getFullYear(), current.getMonth() - 1);
                if(begind.getFullYear() == lastMonth.getFullYear() && begind.getMonth() == lastMonth.getMonth()){
                    return true;
                }else{
                    return false;
                }
            }
        },
    },
    watch: {
        mdtrt_cert_type: function(val) {
            if (val === '04') {
                this.label = '目前支持港澳社保卡(HKG或MAC开头)，其他未知';
            } else if (val === '02') {
                this.label = '身份证';
            } else if (val === '03') {
                this.label = '社会保障卡号';
            } else if (val === '01') {
                this.label = '电子医保凭证号';
            }
        },
    }
}

</script>


<style scoped>
.greenBG{background-color: #90EE90;}

</style>