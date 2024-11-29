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
            <v-row style="height: 80px;">
                <v-col cols="3">
                    <v-row>
                        <VueDatePicker v-model="date" format="yyyy-MM-dd" range locale="zh-cn" day-picker 
                        :enable-time-picker="false" text-input select-text="确定" cancel-text="取消"></VueDatePicker>
                    </v-row>
                    <v-row style="font-size: 12px;margin-top: 10px;" no-gutters><v-col align="center">不建议查询超过2个月的数据，有卡死的风险</v-col></v-row>
                </v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getDanJuList()" :loading="loading" size="large">查询</v-btn></v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getToDay()" :loading="loading" size="large">查今日</v-btn></v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getThisWeek()" :loading="loading" size="large">查最近一周</v-btn></v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getThisMonth()" :loading="loading" size="large">查本月</v-btn></v-col>
            </v-row>
            <v-data-table :headers="headers" :items="danJuList"  
             :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
             no-data-text="暂无数据" hide-default-footer  draggable
             style="width: 100%;font-size:12px;height: 750px;" >
             <template v-slot:item="{ item }">
                <tr :class="{'highlighted':selectedItem === item }" @click="selectRow(item)" style="white-space: nowrap;">
                    <td>{{ item.ffph }}</td>
                    <td>{{ item.fjzdjh }}</td>
                    <td>{{ item.fname }}</td>
                    <td>{{ item.fsex }}</td>
                    <td>{{ item.fage }}</td>
                    <td>{{ item.fmzh }}</td>
                    <td>{{ item.fbrlb }}</td>
                    <td>{{ item.fszf }}</td>
                    <td>{{ item.fjysj }}</td>
                    <td>{{ item.fsfy }}</td>
                    <td>{{ item.fqe }}</td>
                    <td>{{ item.fysje }}</td>
                    <td>{{ item.fjzje }}</td>
                    <td>{{ item.fws }}</td>
                    <td>{{ item.fjmyh }}</td>
                    <td>{{ item.fbz }}</td>
                    <td>{{ item.fzhzf }}</td>
                    <td>{{ item.ftczf }}</td>
                    <td>{{ item.fgwybz }}</td>
                    <td>{{ item.fylbz }}</td>
                    <td>{{ item.fyljz }}</td>
                    <td>{{ item.fqybz }}</td>
                    <td>{{ item.fdfbc }}</td>
                    <td>{{ item.fzxjj }}</td>
                    <td>{{ item.fdetc }}</td>
                    <td>{{ item.fdbtbtc }}</td>
                    <td>{{ item.fqtzj }}</td>
             
                </tr>
             </template>
            </v-data-table>
        </v-container>
    </div>
</template>


<script>

    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

    export default {
        name: "MenZhenJieZhangGuanLi",
        components: { VueDatePicker },
        data() {
            return {
                date: [],
                items: [
                    { title: "首页", to:'/' ,replace:true,disabled:false},
                    { title: "门诊结帐管理" }
                ],
                headers: [
                    // {title:'结账ID',key:'jiezhangID'},
                    {title:'发票号',key:'ffph',nowrap:true},
                    {title:'结账单据号',key:'fjzdjh',nowrap:true},
                    {title:'病人姓名',key:'fname',nowrap:true},
                    {title:'性别',key:'fsex',nowrap:true},
                    {title:'年龄',key:'fage',nowrap:true},
                    {title:'门诊号',key:'fmzh',nowrap:true},
                    {title:'病人类别',key:'fbrlb',nowrap:true},
                    {title:'身份证号',key:'fszf',nowrap:true},
                    {title:'交易时间',key:'fjysj',nowrap:true},
                    {title:'收费员',key:'fsfy',nowrap:true},
                    {title:'全额',key:'fqe',nowrap:true},
                    {title:'应收金额',key:'fysje',nowrap:true},
                    {title:'结账金额',key:'fjzje',nowrap:true},
                    {title:'尾数',key:'fws',nowrap:true},
                    {title:'减免优惠',key:'fjmyh',nowrap:true},
                    {title:'备注',key:'fbz',nowrap:true},
                    {title:'账户支付',key:'fzhzf',nowrap:true},
                    {title:'统筹支付',key:'ftczf',nowrap:true},
                    {title:'公务员支付',key:'fgwybz',nowrap:true},
                    {title:'医疗补助',key:'fylbz',nowrap:true},
                    {title:'医疗救助',key:'fyljz',nowrap:true},
                    {title:'企业补助',key:'fqybz',nowrap:true},
                    {title:'地方补充',key:'fdfbc',nowrap:true},
                    {title:'专项基金',key:'fzxjj',nowrap:true},
                    {title:'大额统筹',key:'fdetc',nowrap:true},
                    {title:'大病特病统筹',key:'fdbtbtc',nowrap:true},
                    {title:'其他证件',key:'fqtzj',nowrap:true},
                ],
                danJuList: [],
                loading: false,
                selectedItem :null,
            }
        },
        mounted() {
            this.getToDay();
        },
        methods:{
          
            // 选择单据
            async selectRow(item) {
                console.log(item);
                this.selectedItem = item;
            },
            // 获取单据列表
            async getDanJuList() {
                this.loading = true;
                const response = await this.$axios.post('/shoufei/jiezhangdanju',{begintime:this.date[0],endtime:this.date[1]});
                if (response.data){
                    if(response.data.code == 0){
                        let result = response.data;
                        console.log(result);
                        this.danJuList = result.result;
                    }else{
                        this.danJuList = [];
                        console.log(response.data);
                    }
                }
                this.loading = false;
            },
            // 获取今日
            async getToDay() {
                let today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let day = today.getDate();

                today.setDate(today.getDate() + 1);
                
                this.date = [year + '-' + month + '-' + day, today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()];
                this.getDanJuList();
            },
            // 获取最近一周
            async getThisWeek() {
                let today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let day = today.getDate();
                let lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                this.date = [lastWeek.getFullYear() + '-' + (lastWeek.getMonth() + 1) + '-' + lastWeek.getDate(), year + '-' + month + '-' + day];
                this.getDanJuList();
            },
            // 获取本月
            async getThisMonth() {
                let today = new Date();
                // 获取本月的第一天
                let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                // 获取下个月的第一天，然后减去一天，获得本月的最后一天
                let endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                this.date = [startOfMonth.getFullYear() + '-' + (startOfMonth.getMonth() + 1) + '-' + startOfMonth.getDate()
                , endOfMonth.getFullYear() + '-' + (endOfMonth.getMonth() + 1) + '-' + endOfMonth.getDate()];
                this.getDanJuList();
            }

        },
    }
</script>


<style scoped>
.highlighted{background-color: #cceeff}
</style>