<template>
    <v-dialog v-model="flag" >
        <v-card  style="min-height: 600px;">
            <v-container style="padding:20px 0px;margin:0 20px;max-width: 100%; " >
                <v-row ref="ggggg" justify="center" style="font-size:30px">挂号</v-row>
                <v-row>
                    <v-col>
                        <v-text-field label="输入搜索文本后按回车或点击搜索" v-model="search" density="compact" hide-details  class="ghcell" style="width:240px"></v-text-field>
                        <v-btn>搜索</v-btn>
                    </v-col>
                    <v-col><v-select  label="挂号类别" :items="ghType"  v-model="selectedGhType" density="compact" readonly  hide-details hide-no-data  class="ghcell" ></v-select></v-col>
                    <v-col><v-text-field label="门诊号" v-model="mzh"  density="compact" disabled variant="outlined"  hide-details  class="ghcell"></v-text-field></v-col>
                    <v-col><v-select  label="初复诊" :items="chuFuZhen"  v-model="selectedChuFuZhen" density="compact"   hide-details hide-no-data  class="ghcell"></v-select></v-col>
                </v-row>
                <v-row>
                    <v-col><v-select  label="病人类别" :items="brlb"  v-model="selectedbrlb" density="compact"   hide-details hide-no-data  class="ghcell"></v-select></v-col>
                    <v-col><v-text-field label="姓名" v-model="name"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                    <v-col><v-text-field label="身份证号" v-model="sfzh"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                    <v-col><v-text-field label="其他证件号" v-model="qtzjh"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                </v-row>
                <v-row>
                    <v-col><v-select  label="性别" :items="sex"  v-model="selectedsex" density="compact"   hide-details hide-no-data  class="ghcell"></v-select></v-col>
                    <v-col>
                        <span style="font-size:15px">出生日期</span>
                        <VueDatePicker v-model="birthDate" format="yyyy-MM-dd"  locale="zh-cn" day-picker 
                        :enable-time-picker="false" text-input select-text="确定" cancel-text="取消" class="ghcell" style="width:240px"></VueDatePicker>
                    </v-col>
                    <v-col><v-text-field label="年龄(岁)" v-model="age"  density="compact"  hide-details  class="ghcell" ></v-text-field></v-col>
                    <v-col><v-text-field label="联系电话" v-model="phone"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                </v-row>
                <v-row>
                    <div>
                        <div class="ghcell" style="width:200px">
                            <v-text-field label="省" v-model="sheng"  density="compact"  hide-details class="ghcell" style="width:200px;"></v-text-field>
                            <div style="position: fixed;width:300px;">
                                <v-data-table v-show="showSheng" :headers="shengHeaders" :items="shengList" :search="sheng" fixed-header no-data-text="暂无数据"  
                                density="compact"   hide-default-footer style="white-space: nowrap;font-size:12px">
                                    <template v-slot:item="{ item }">
                                        <tr :class="{'highlighted':selectedSheng === item  }" @click="selectSheng(item)">
                                            <td v-for="column in shengHeaders">{{ item[column.key] }}</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </div>
                        <div class="ghcell" style="width:200px">
                            <v-text-field label="市" v-model="shi"  density="compact"  hide-details class="ghcell" style="width:200px;"></v-text-field>
                            <div style="position: fixed;width:300px;">
                                <v-data-table v-show="showShi" :headers="shiHeaders" :items="shiList" :search="shi" fixed-header  no-data-text="暂无数据" 
                                density="compact"   hide-default-footer style="white-space: nowrap;font-size:12px">
                                <template v-slot:item="{ item }">
                                    <tr :class="{'highlighted':selectedShi === item  }" @click="selectShi(item)">
                                        <td v-for="column in shiHeaders">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                            </div>
                        </div>
                        <div class="ghcell" style="width:200px">
                            <v-text-field label="区" v-model="xianqu"  density="compact"  hide-details class="ghcell" style="width:200px;"></v-text-field>
                            <div style="position: fixed;width:300px;">
                                <v-data-table v-show="showQu"  :headers="quHeaders" :items="quList" :search="xianqu" fixed-header  no-data-text="暂无数据" 
                                density="compact"   hide-default-footer style="white-space: nowrap;font-size:12px">
                                <template v-slot:item="{ item }">
                                    <tr :class="{'highlighted':selectedQu === item  }" @click="selectQu(item)">
                                        <td v-for="column in quHeaders">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                            </div>
                        </div>
                        <!-- <div class="ghcell" style="width:200px">
                            <v-text-field label="住址" v-model="address"  density="compact"  hide-details class="ghcell" style="width:100px"></v-text-field>
                            <v-data-table :headers="addHeaders" :items="zhen" fixed-header   ></v-data-table>
                        </div> -->
                        
                    </div>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { mapState } from 'vuex'

export default {

    name: 'JianYiGuaHao',
    props:{
        show:{
            type:Boolean,
            default:true
        }
    },
    components: { VueDatePicker },
    data() {
        return {
            flag:false,
            search:'',
            ghType: [
				{ title: '普通医师号', value: '普通医师号' },
			],
            chuFuZhen:[
                { title: '初诊', value: '初诊' },
                { title: '复诊', value: '复诊' },
            ],
            selectedGhType: '普通医师号',
            mzh:'',
            selectedChuFuZhen: '初诊',
            name:'',
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
                { title: '男', value: '男' },
                { title: '女', value: '女' },
            ],
            selectedsex: '男',

            birthDate: new Date(),
            age:'',
            phone:'',
            address:'',

            sheng:'',
            shengHeaders:[
                { title:'省', key:'sheng'},
                { title:'区划', key:'quhua'},
                { title:'拼音', key:'pinyin'},
                { title:'五笔', key:'wubi'},
            ],
            selectedSheng:null,
            showSheng:false,

            shi:'',
            shiHeaders:[
                { title:'省', key:'sheng'},
                { title:'市', key:'shi'},
                { title:'区划', key:'quhua'},
                { title:'拼音', key:'pinyin'},
                { title:'五笔', key:'wubi'},
            ],
            selectedShi:null,
            showShi:false,
            closeShi :false,

            xianqu:'',
            quHeaders:[
                { title:'省', key:'sheng'},
                { title:'市', key:'shi'},
                { title:'区', key:'qu'},
                { title:'区划', key:'quhua'},
                { title:'拼音', key:'pinyin'},
                { title:'五笔', key:'wubi'},
            ],
            selectedQu:null,
            showQu:false,
            closeQu :false,



        }
    },
    computed:{
        ...mapState(['shengList','shiList', 'quList', 'zhenList']),
        searchSheng(){
            return this.search;
        },
    },
    mounted() {
        
    },
    methods: {
        selectSheng(item){
            console.log(item)
            this.selectedSheng = item;
            this.sheng = item.sheng;
            this.showSheng = false;
        },
        selectShi(item){
            console.log(item)
            this.selectedShi = item;
            this.shi = item.shi;
            // this.sheng = item.sheng;
            this.showShi = false;
            // this.closeShi = true;
        },
        selectQu(item){
            console.log(item)
            this.selectedQu = item;
            this.xianqu = item.qu;
            this.showQu = false;
        },
    },
    watch: {
        show(val) {
            // 父级组件按下
            this.flag = true;
        },
        sheng(newVal,oldVal) {
            // if(this.closeShi){
            //     this.closeShi = false;
            //     this.showSheng = false;
            //     return;
            // }
            
            if( newVal == '' ||  (oldVal == ''  && (this.selectedSheng && newVal == this.selectedSheng.sheng))
                || (newVal == '' && (this.selectedSheng && oldVal != this.selectedSheng.sheng)) ) {
                this.showSheng = false;
                return;
            }
            if(oldVal == ''  || (this.selectedSheng && newVal != this.selectedSheng.sheng)){
                this.showSheng = true;
                return;
            }
            if( (this.selectedSheng && newVal == this.selectedSheng.sheng) ){
                this.showSheng = false;
            }
        },
        shi(newVal,oldVal) {
            if( newVal == '' ||  (oldVal == ''  && (this.selectedShi && newVal == this.selectedShi.shi))
                || (newVal == '' && (this.selectedShi && oldVal != this.selectedShi.shi)) ) {
                this.showShi = false;
                return;
            }
            if(oldVal == ''  || (this.selectedShi && newVal != this.selectedShi.shi)){
                this.showShi = true;
                return;
            }
            if( (this.selectedShi && newVal == this.selectedShi.shi) ){
                this.showShi = false;
            }
        },
        xianqu(newVal,oldVal) {
            
            if( newVal == ''  || (oldVal == ''  && (this.selectedQu && newVal == this.selectedQu.qu))
                || (newVal == '' && (this.selectedQu && oldVal != this.selectedQu.qu)) ) {
                this.showQu = false;
                return;
            }
            
            if(oldVal == ''  || (this.selectedQu && newVal != this.selectedQu.qu)){
                this.showQu = true;
                return;
            }
            console.log(newVal,oldVal)
            if(  (this.selectedQu && newVal == this.selectedQu.qu) ){
                this.showQu = false;
            }
        },
    }
}
</script>

<style scoped>
.ghcell{width:300px;display: inline-block;vertical-align:middle;}
input{border:1px solid #ccc;}
.highlighted{background-color: #cceeff}
</style>