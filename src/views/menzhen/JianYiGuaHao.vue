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
                    <v-col><v-text-field label="联系电话" v-model="lxdh"  density="compact"  hide-details  class="ghcell"></v-text-field></v-col>
                </v-row>
                <v-row>
                    <v-col><v-text-field label="住址" v-model="jtzz"  density="compact"  hide-details style="width:500px"></v-text-field></v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

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
            lxdh:'',
        }
    },
    mounted() {

    },
    methods: {
        
    },
    watch: {
        show(val) {
            // 父级组件按下
            this.flag = true;
        }
    }
}
</script>

<style scoped>
.ghcell{width:300px;display: inline-block;vertical-align:middle;}
input{border:1px solid #ccc;}
</style>