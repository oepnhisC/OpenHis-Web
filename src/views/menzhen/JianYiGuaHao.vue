<template>
    <v-dialog v-model="flag" persistent >
        <v-card  style="min-height: 600px;">
            <v-container style="padding:20px 0px;margin:0 20px;max-width: 100%; " >
                <v-row justify="center" style="font-size:30px">挂号</v-row>
                <v-row>
                    <v-col>
                        <v-text-field label="姓名、门诊号、卡号、拼音首写字母" v-model="search"  @keydown="handleKeydown" :loading="loading"
                        density="compact" hide-details  class="ghcell" style="width:240px"></v-text-field>
                        <v-btn color="primary" @click="getOldData()" :loading="loading">搜索</v-btn>
                        <div style="position: fixed;width:800px;z-index:999;">
                            <v-data-table-virtual v-show="showOldData"  :headers="oldDataHeaders" :items="oldDataList"  fixed-header  no-data-text="暂无数据" 
                                density="compact"   style="white-space: nowrap;font-size:12px;z-index:999" height="400">
                                <template v-slot:headers>
                                    <tr>
                                        <th v-for="column in oldDataHeaders" :key="column.key">
                                            <div :style="{width:column.width}">{{column.title}}</div>
                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:item="{ item }">
                                    <tr :class="{'highlighted':selectedOldData === item  }" @click="selectOldData(item)">
                                        <td v-for="column in oldDataHeaders">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table-virtual>
                        </div>
                        <div v-show="showOldData" @click="showOldData = false" style="position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);"></div>
                    </v-col>
                    <!-- <v-col><v-select  label="挂号类别" :items="ghType"  v-model="selectedGhType" density="compact" readonly  hide-details hide-no-data  class="ghcell" ></v-select></v-col> -->
                    <v-col><v-select  label="病人类别" :items="brlb"  v-model="selectedbrlb" density="compact"   hide-details hide-no-data  class="ghcell"></v-select></v-col>
                    <v-col><v-text-field label="门诊号" v-model="mzh"  density="compact" disabled variant="outlined"  hide-details  class="ghcell"></v-text-field></v-col>
                    <v-col><v-select  label="初复诊" :items="chuFuZhen"  v-model="selectedChuFuZhen" density="compact"   hide-details hide-no-data  class="ghcell"></v-select></v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <span style="font-size:15px">出生日期</span>
                        <VueDatePicker v-model="birthDate"  @date-update="dateClicked" ref="datepicker"
                        format="yyyy-MM-dd"  locale="zh-cn" day-picker 
                        :enable-time-picker="false" text-input select-text="确定" cancel-text="取消" class="ghcell" style="width:240px"></VueDatePicker>
                    </v-col>
                    <v-col><v-text-field label="年龄(岁)" v-model="age"  density="compact"  hide-details  class="ghcell" ></v-text-field></v-col>
                    <v-col><v-text-field label="身份证号(18位)" v-model="sfzh" @input="checkSFZ()"   density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                    <v-col><v-text-field label="其他证件号" v-model="qtzjh"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                </v-row>
                <v-row>
                    <v-col><v-select  label="性别" :items="sex"  v-model="selectedsex" density="compact"   hide-details hide-no-data  class="ghcell"></v-select></v-col>
                    <v-col><v-text-field label="姓名" v-model="name"  :base-color="name==''?'error':''"  :color="name==''?'error':''" density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                    <v-col><v-text-field label="联系电话(最多20位)" v-model="telephone" @input="checkTel()"  :base-color="telephone==''?'error':''"  :color="telephone==''?'error':''"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                </v-row>
                <v-row>
                    <v-col>
                        
                        <v-text-field label="住址" v-model="zhuzhi"  :base-color="zhuzhi==''?'error':''"  :color="zhuzhi==''?'error':''" 
                            density="compact" hide-details class="ghcell" style="width:600px;"></v-text-field>
                        <!-- <div class="ghcell" style="width:300px">
                            <v-text-field label="住址" v-model="zhuzhi"  :base-color="zhuzhi==''?'error':''"  :color="zhuzhi==''?'error':''" density="compact"  hide-details class="ghcell" style="width:500px;"></v-text-field>
                            <div style="position: fixed;width:400px;">
                                <v-data-table v-show="showZhen" :headers="zhenHeaders" :items="zhenList" :search="zhuzhi" fixed-header no-data-text="暂无数据"  
                                density="compact"   hide-default-footer style="white-space: nowrap;font-size:12px;height:300px">
                                    <template v-slot:item="{ item }">
                                        <tr :class="{'highlighted':selectedZhen === item  }" @click="selectZhen(item)">
                                            <td v-for="column in zhenHeaders">{{ item[column.key] }}</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </div> -->
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <div>
                        <v-alert density="compact" title="失败" type="error" v-show="errFlag" width="500px">{{ errmsg }}</v-alert>
                    </div>
                </v-row>
                <v-row justify="center" style="margin-top:50px">
                    <v-btn @click="guaHao()" :loading="loading" size="x-large" color="primary">确定</v-btn>
                    <v-btn @click="flag=false" :loading="loading" size="x-large" color="error" style="margin-left:100px;">取消</v-btn>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// import { mapState } from 'vuex'
import pinyin from 'pinyin';

export default {

    name: 'JianYiGuaHao',
    props:{
        show:{
            type:Boolean,
            default:true
        },
        ghksid:{
            type:Number,
        }
    },
    components: { VueDatePicker },
    data() {
        return {
            flag:false,
            search:'',
            // ghType: [{ title: '普通医师号', value: '普通医师号' },],
            chuFuZhen:[
                { title: '初诊', value: '0' },
                { title: '复诊', value: '1' },
                { title: '复查', value: '2' },
            ],
            selectedChuFuZhen: '0',
            // selectedGhType: '普通医师号',
            mzh:'',
            name:'测试豆',
            brlb: [
				{ title: '自费', value: '自费' },
                { title: '特种病门诊', value: '特种病门诊' },
                { title: '定点', value: '定点' },
                { title: '工伤', value: '工伤' },
			],
            selectedbrlb: '自费',
            sfzh:'',
            qtzjh:'',
            sex: [
                { title: '男', value: '1' },
                { title: '女', value: '2' },
            ],
            selectedsex: '1',

            birthDate: '',
            age:'',
            telephone:'12345679810',
            mobilephone:'',

            // sheng:'',
            // shi:'',
            // xianqu:'',
            // zhen:'',
            // zhenHeaders:[
            //     { title:'全名', key:'quanming'},
            //     { title:'区划', key:'quhua'},
            //     { title:'拼音', key:'pinyin'},
            //     { title:'五笔', key:'wubi'},
            // ],
            // selectedZhen:null,
            // showZhen:false,

            zhuzhi:'银河系',
            jzid:'0',
            brid :'0',
            hykh:'',
            kh:'',
            yhid:'0',
            zhiye:'',
            pingyin:'',
            wubi:'',
            hunyinid:'9',
            guoji:'',
            minzu:'',
            momo:'',
            zhengzhuang:'',
            gzdw:'',
            dwdh:'',
            dwdz:'',


            errFlag:false,
            errmsg:'',

            loading:false,

            oldDataHeaders:[
                
                { title:'会员卡号', key:'fhykh',width:'60px'},
                { title:'门诊号', key:'fmzh',width:'60px'},
                // { title:'住院号', key:'fzyh',width:'60px'},
                { title:'姓名', key:'fname' ,width:'60px'},
                { title:'年龄', key:'fage',width:'40px'},
                { title:'性别', key:'fsex',width:'40px'},
                { title:'身份证', key:'fsfz',width:'60px'},
                { title:'其他证件', key:'fqtzj',width:'60px'},
                { title:'住址', key:'fzhuzhi',width:'60px'},
                { title:'生日', key:'fbirthday',width:'60px'},
                { title:'座机电话', key:'telephone',width:'60px'},
                { title:'手机', key:'mobilephone',width:'60px'},
                { title:'病人类别', key:'fbrlb',width:'60px'},
                { title:'婚姻状况', key:'fhunyin',width:'60px'},
                // { title:'婚姻ID', key:'fhunyinid',width:'60px'},
                { title:'职业', key:'fzhiye',width:'60px'},
                // { title:'民族', key:'fminzu',width:'60px'},
                // { title:'省', key:'sheng',width:'60px'},
                // { title:'市', key:'shi',width:'60px'},
                { title:'出生地', key:'fcsd',width:'60px'},
                // { title:'户口地址', key:'fhkdz',width:'60px'},
                // { title:'户籍邮编', key:'fhjyb',width:'60px'},
                // { title:'会员ID', key:'fhyid',width:'60px'},
                { title:'会员余额', key:'fhyye',width:'60px'},
                // { title:'联系人姓名', key:'flxrxm',width:'60px'},
                // { title:'联系人关系', key:'flxrgx',width:'60px'},
                // { title:'联系人地址', key:'flxrdz',width:'60px'},
                // { title:'联系人电话', key:'flxrdh',width:'60px'},
                // { title:'联系人邮编', key:'flxryb',width:'60px'},
                // { title:'工作单位', key:'fgzdw',width:'60px'},
                // { title:'单位电话', key:'fdwdh',width:'60px'},
                // { title:'单位地址', key:'fdwdz',width:'60px'},
                // { title:'籍贯', key:'fjiguan',width:'60px'},
                // { title:'电子邮箱', key:'email',width:'60px'},
                { title:'备注', key:'momo',width:'60px'},
                // { title:'病人ID', key:'fbrid',width:'60px'},
            ],
            oldDataList:[],
            selectedOldData:null,
            showOldData:false,

           

        }
    },
    computed:{
        // ...mapState([ 'zhenList']),

    },
    mounted() {
        this.nameToPinyin(this.name);
    },
    methods: {
       
        // selectZhen(item){
        //     console.log(item)
        //     this.sheng = item.sheng;
        //     this.shi = item.shi;
        //     this.qu = item.qu;
        //     this.zhen = item.zhen;
        //     this.selectedZhen = item;
        //     this.zhuzhi = item.quanming;
        //     this.showSheng = false;
        // },

        //计算年龄
        calculateAge() {
            let now = new Date();
            let birthDate = new Date(this.birthDate);
            let age = now.getFullYear() - birthDate.getFullYear();
            let month = now.getMonth() - birthDate.getMonth();
            if (month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            this.age = age;
        },

        // 根据身份证计算出生日期
        calculateAgeBySFZ(value) {
            if(value.length == 18){
                let birthDate = value.substring(6,10) + '-' + value.substring(10,12) + '-' + value.substring(12,14);
                let now = new Date();
                let birthDateObj = new Date(birthDate);
                let age = now.getFullYear() - birthDateObj.getFullYear();
                let month = now.getMonth() - birthDateObj.getMonth();
                if (month < 0 || (month === 0 && now.getDate() < birthDateObj.getDate())) {
                    age--;
                }
                this.birthDate = birthDate;
                this.age = age;
                const genderDigit = value.charAt(16);
                // 判断性别
                if (parseInt(genderDigit) % 2 === 0) {
                    this.selectedsex = '2';
                } else {
                    this.selectedsex = '1';
                }
            }
        },

        //日期选中
        dateClicked(date){
            this.birthDate = date;
            this.$refs.datepicker.closeMenu();
            //计算年龄
            this.calculateAge();
        },

        // 验证身份证号
        validate18ID(id) {
            // 检查出生日期
            const year = id.substring(6, 10);
            const month = id.substring(10, 12);
            const day = id.substring(12, 14);
            const date = new Date(`${year}-${month}-${day}`);
            
            if (date.getFullYear() !== +year || 
                date.getMonth() + 1 !== +month || 
                date.getDate() !== +day) {
                return false; // 出生日期不合法
            }

            // 校验最后一位
            const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            const checkDigits = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
            let sum = 0;

            for (let i = 0; i < 17; i++) {
                sum += id[i] * weights[i];
            }

            const checkIndex = sum % 11;
            const checkDigit = checkDigits[checkIndex];

            return checkDigit === id[17].toUpperCase(); // 比较最后一位
        },

        nameToPinyin(name){
            return pinyin(name, {style: pinyin.STYLE_FIRST_LETTER     }).join('')
        },

        // 挂号
        async guaHao(){
            this.errFlag = false;
            // 验证身份证号
            if(this.sfzh.length > 0){
                if(this.sfzh.length < 18 || this.sfzh.length > 18){
                    this.errFlag = true;
                    this.errmsg = '请输入正确的身份证号';
                    return;
                }
                if(!this.validate18ID(this.sfzh)){
                    this.errFlag = true;
                    this.errmsg = '请输入正确的身份证号';
                    return;
                }
            }

            if(this.name == ''){
                this.errFlag = true;
                this.errmsg = '请输入姓名';
                return;
            }
            if(this.telephone == ''){
                this.errFlag = true;
                this.errmsg = '请输入联系电话';
                return;
            }
            if(this.zhuzhi == ''){
                this.errFlag = true;
                this.errmsg = '请输入住址';
                return;
            }

            if(this.pinyin == ''){
                this.pinyin = this.nameToPinyin(this.name);
            }
            if(this.mobilephone == ''){
                this.mobilephone = this.telephone;
            }
            

            let postData = {
                jzid: '0', //就诊ID
                brid: this.brid, //病人ID
                mzh: this.mzh, //门诊号
                yykh: this.yhkh, //会员卡号
                kh: this.kh, //卡号
                yyid: this.yhid, //会员ID
                zjlx: '01',  //证件类型
                sfz: this.sfzh, //身份证号码
                qtzj: this.qtzjh, //其他证件
                name: this.name, //姓名
                pingyin: this.pingyin, //拼音
                wubi: this.wubi,  //五笔
                sex: this.selectedsex, //性别
                xxnl: this.age + 'Y', //详细年龄
                zy: this.zhiye, //职业
                hunyin: this.hunyinid, //婚姻状况
                guoji:this.guoji, //国籍
                minzu: this.minzu, //民族
                brlb: this.selectedbrlb, //病人类别
                fkfs: '', //付款方式
                telephone: this.telephone, // 电话
                mobilephone: this.mobilephone, //手机号
                sheng: this.sheng, //省
                shi: this.shi, //市
                zhuzhi: this.zhuzhi, //住址
                jsr: '', //介绍人
                momo: this.momo, //备注
                zhengzhuang:this.zhengzhuang, //症状体征
                gzdw: this.gzdw, //工作单位
                dwdh: this.dwdh, //单位电话
                dwdz: this.dwdz, //单位地址
                ghksid: this.ghksid, //挂号科室ID
                cfz: this.selectedChuFuZhen, //初复诊
                birthday:this.birthDate, //出生日期
            }
            console.log(postData)

            this.loading = true;
			const response = await this.$axios.post('/menzhen/jianYiGuaHao',postData);
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
                    this.$emit('guaHaoSuccess',result.result);
                    this.flag = false;
				}else{
                    this.errFlag = true;
                    this.errmsg = result.result;
				}
			}
			this.loading = false;
        },
        // 选择历史数据
        selectOldData(item){
            console.log(item)

            this.selectedOldData = item;

            this.birthDate=item.fbirthday;
            this.brid=item.fbrid;
            this.mzh=item.fmzh;
            this.name=item.fname;
            this.hykh=item.fhykh;
            this.kh=item.fkh;
            this.sfzh=item.fsfz;
            this.qtzjh=item.fqtzj;
            this.pingyin=item.pingyin;
            this.wubi=item.wubi;
            this.selectedsex=item.fsexid;
            this.zhiye = item.fzhiye;
            this.hunyinid = item.fhunyinid;
            this.guoji = item.fguoji;
            this.minzu = item.fminzu;
            this.selectedbrlb=item.fbrlb;
            this.telephone=item.telephone;
            this.mobilephone=item.mobilephone;
            this.sheng = item.sheng;
            this.shi = item.shi;
            this.zhuzhi = item.fzhuzhi;
            this.momo = item.momo;
            this.zhengzhuang = item.fzhengzhuang;
            this.gzdw = item.fgzdw;
            this.dwdh = item.fdwdh;
            this.dwdz = item.fdwdz;

            
            if(this.sfzh.length == 18){
                this.calculateAgeBySFZ(this.sfzh);
            }

            //计算年龄
            if(this.birthDate != ''){
                this.calculateAge();
            }

            this.showOldData = false;

        },
        // 按下回车搜索
		handleKeydown(event){
            if(this.loading){
                return;
            }
			if(event.keyCode == 13){
				this.getOldData();
			}
		},
        // 获取历史数据
        async getOldData(){

            if(this.search == ''){
                this.errFlag = true;
                this.errmsg = '请输入搜索内容';
                return;
            }
            this.errFlag = false;
            this.loading = true;
            const response = await this.$axios.post('/menzhen/getOldData',{content: this.search,mzh:this.search.padStart(10,'0')});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.oldDataList = result.result;
                    this.showOldData = true;
                }else{
                    this.showOldData = false;
                    this.errFlag = true;
                    this.errmsg = result.result;
                }
            }
            this.loading = false;
        },
        // 检查身份证
        checkSFZ(){
            //只允许输入数字和X、x
            const reg = /^[0-9Xx]*$/;
            if(!reg.test(this.sfzh)){
                this.sfzh = this.sfzh.replace(/[^0-9Xx]/g,'');
            }
            if(this.sfzh.length > 18){
                this.sfzh = this.sfzh.substring(0,18);
            }
        },
        //检查电话
        checkTel(){
            //只允许输入数字和-
            const reg = /^[0-9-]*$/;
            if(!reg.test(this.telephone)){
                this.telephone = this.telephone.replace(/[^0-9-]/g,'');
            }
            if(this.telephone.length > 20){
                this.telephone = this.telephone.substring(0,20);
            }
        },
    },
    watch: {
        show(val) {
            // 父级组件按下
            this.flag = true;
        },
        sfzh(value){
           this.calculateAgeBySFZ(value);
        },
        // zhuzhi(newVal,oldVal) {
        //     if( newVal == '' ||  (oldVal == ''  && (this.selectedZhen && newVal == this.selectedZhen.quanming))
        //         || (newVal == '' && (this.selectedZhen && oldVal != this.selectedZhen.quanming)) ) {
        //         this.showZhen = false;
        //         return;
        //     }
        //     if(newVal != '' && this.zhen != ''  && newVal.includes(this.zhen)){
        //         this.showZhen = false;
        //         return;
        //     }
        //     if(oldVal == ''  || (this.selectedZhen && newVal != this.selectedZhen.quanming)){
        //         this.showZhen = true;
        //         return;
        //     }
        //     if( (this.selectedZhen && newVal == this.selectedZhen.quanming) ){
        //         this.showZhen = false;
        //     }
        // },
    }
}
</script>

<style scoped>
.ghcell{width:300px;display: inline-block;vertical-align:middle;}
input{border:1px solid #ccc;}
.highlighted{background-color: #cceeff}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;
}
</style>