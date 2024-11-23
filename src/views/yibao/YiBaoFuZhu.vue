<template>
    <div>
        <v-container style="width:100%">
            <v-row no-gutters>
                <v-col cols="6">
                    <v-row no-gutters><v-col align="center" style="font-size:23px">请填入参保人信息</v-col></v-row>
                    <v-row no-gutters><v-select hide-details v-model="mdtrt_cert_type" :items="options1" label="就诊凭证类型"></v-select></v-row>
                    <v-row no-gutters><v-text-field :rules="rules" hide-details v-model="mdtrt_cert_no" :label="label" clearable></v-text-field></v-row>
                    <!-- <v-row no-gutters><v-text-field hide-details v-model="card_sn" label="卡识别码"></v-text-field></v-row> -->
                    <!-- <v-row no-gutters><v-text-field hide-details v-model="begntime" label="开始时间"></v-text-field></v-row> -->
                    <!-- <v-row no-gutters><v-select hide-details v-model="psn_cert_type" :items="options2" label="患者证件类型"></v-select></v-row> -->
                    <v-row no-gutters><v-text-field hide-details v-model="insuplc_admdvs" label="参保地区划（异地才需要填）" clearable></v-text-field></v-row>
                    <v-row><v-col align="center"><v-btn size="x-large" @click="personInfo()">查询</v-btn></v-col></v-row>
                    <v-row><v-col><v-alert density="compact" title="失败" type="error"  v-show="errFlag">{{ errmsg }}</v-alert></v-col></v-row>
                </v-col>

                <v-col cols="6">
                    {{ personInfoJson.baseinfo.age }}{{ personInfoJson.baseinfo.brdy }}{{ personInfoJson.baseinfo.psn_name }}
                </v-col>

            </v-row>
            
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'yibaofuzhu',
    data() {
        return {
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
                }else{
                    console.log(response.data);
                    this.errFlag = true;
                    this.errmsg = response.data.result ;
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