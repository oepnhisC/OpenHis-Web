<template>
    <v-container style="width:100%;margin:0;max-width: 100%;">
        <v-row>
            
            <v-col style="padding-top:20px" cols="3">
                <VueDatePicker v-model="date" format="yyyy-MM-dd" range locale="zh-cn" day-picker 
                    :enable-time-picker="false" text-input select-text="确定" cancel-text="取消"></VueDatePicker>
            </v-col>
            <v-col  cols="1"><v-btn @click="getDanJuList()" :loading="loading" size="x-large">查询</v-btn></v-col>
            <v-col  cols='2'>
                <v-radio-group v-model="search" inline style="margin-top: 10px;" >
                <v-radio label="全部" value="" ></v-radio>
                <v-radio label="已上传" value="LOAD" ></v-radio>
                <v-radio label="未上传" value="NOTUPLOAD" ></v-radio>
                </v-radio-group>
            </v-col>
            <v-col  cols='2'>
                <v-radio-group v-model="flag" inline style="margin-top: 10px;" >
                <v-radio label="门诊" value="1" ></v-radio>
                <v-radio label="住院" value="2" ></v-radio>
                </v-radio-group>
            </v-col>
            <v-col  cols='2'><v-btn @click="uploadOne()" :loading="loading" size="x-large">上传单个病人数据</v-btn></v-col>
            <v-col  cols='2'><v-btn @click="uploadAll()" :loading="loading" size="x-large">上传所有未上传数据</v-btn></v-col>
        </v-row>
        <v-row>
            <v-col >
                <v-row justify="center">门诊自费病人列表</v-row>
                <v-row>
                    <v-data-table v-show="flag==1" :headers="headers" :items="danJuList"   
                        :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
                        no-data-text="暂无数据" hide-default-footer  dense :search="search"
                        style="font-size:12px;height: 680px;white-space: nowrap;" >
                        <template v-slot:item="{ item }">
                        <tr :class="{'finished':item.FSTATE=='UPLOAD' && selectedItem !== item,'highlighted':selectedItem === item  }" @click="selectRow(item)"
                            style="white-space: nowrap;">
                            <td>{{ item.fixmedins_mdtrt_id }}</td>
                            <td>{{ item.psn_cert_type }}</td>
                            <td>{{ item.certno }}</td>
                            <td>{{ item.psn_name }}</td>
                            <td>{{ item.begntime }}</td>
                            <td>{{ item.med_type }}</td>
                            <td>{{ item.FSTATE == 'UPLOAD'?'已上传':'未上传' }}</td>
                            <td>{{ item.beizhu }}</td>
                        </tr>
                        </template>
                    </v-data-table>
                </v-row>
            </v-col>
            <!-- <v-col cols="5">
                <v-row justify="center">诊断信息</v-row>
                <v-row>
                    <v-data-table v-show="flag==1" :headers="zhenduanHeaders" :items="zhenduanList"   
                        :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
                        no-data-text="暂无数据" hide-default-footer  dense
                        style="font-size:12px;height: 350px;white-space: nowrap;" >
                    </v-data-table>
                </v-row>
            </v-col> -->

        </v-row>
        <!-- <v-row justify="center">单据明细</v-row>
        <v-row>
            <v-data-table v-show="flag==1" :headers="mingxiHeaders" :items="mingxiList"   
                :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
                no-data-text="暂无数据" hide-default-footer  dense
                style="font-size:12px;height: 350px;white-space: nowrap;" >
            </v-data-table>
        </v-row> -->

    </v-container>
</template>


<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'



export default {
    name: "ZiFeiBingRenShangChuan",
    components: { VueDatePicker },
    data() {
        return {
            search: '',
            date: [],
            items: [
                    { title: "首页", to:'/' ,replace:true,disabled:false},
                    { title: "医保辅助功能",to:'/yibaofuzhu',replace:true,disabled:false },
                    {title:'全量自费病人信息上传'}
            ],
            selectedItem: null,
            headers: [
                { title: '医药机构就诊ID', value: 'fixmedins_mdtrt_id' },
                { title: '人员证件类型', value: 'psn_cert_type' },
                { title: '证件号码', value: 'certno' },
                { title: '人员姓名', value: 'psn_name' },
                { title: '开始时间', value: 'begntime' },
                { title: '医疗类别', value: 'med_type' },
                { title: '状态', value:'FSTATE' },
                { title: '备注', value: 'beizhu' }
            ],
            danJuList: [],
            loading: false,
            flag: '1',

            zhenduanHeaders:[
                // { title: '诊断类别', value: 'diag_type' },
                { title: '诊断排序号', value: 'diag_srt_no' },
                { title: '诊断代码', value: 'diag_code' },
                { title: '诊断名称', value: 'diag_name' },
                { title: '诊断科室', value: 'diag_dept' }, 
                { title: '诊断医生编码', value: 'diag_dr_code' },
                { title: '诊断医生姓名', value: 'diag_dr_name' },
                { title: '诊断时间', value: 'diag_time' },
                // { title: '有效标志', value: 'vali_flag' },

            ],
            zhenduanList: [],

            mingxiHeaders:[
                // { title: '医药机构就诊ID', value: 'fixmedins_mdtrt_id' },
                // { title: '医疗类别', value:'med_type' },
                { title: '记账流水号', value: 'bkkp_sn' },
                { title: '数量', value: 'cnt' },
                { title: '单价', value: 'pric' },
                { title: '明细项目费用总额', value: 'det_item_fee_sumamt' },
                { title: '医疗目录编码', value:'med_list_codg' },
                { title: '医药机构目录编码', value:'medins_list_codg' },
                { title: '医药机构目录名称', value:'medins_list_name' },
                // { title: '医疗收费项目类别', value:'med_chrgitm_type' },
                { title: '商品名', value: 'prodname' },
                { title: '开单科室编码', value: 'bilg_dept_codg' },
                { title: '开单科室名称', value: 'bilg_dept_name' },
                { title: '开单医生编码', value: 'bilg_dr_code' },
                { title: '开单医师姓名', value: 'bilg_dr_name' },
                { title: '费用发生时间', value: 'fee_ocur_time' }
            ],
            mingxiList: [],

        }
    },

    mounted() {
        this.$emit('setTitle','全量自费病人信息上传')
        this.$emit('setbreadcrumbs',this.items);
        this.getThisMonth();
    },

    methods: {
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
        },
        // 选择单据
        async selectRow(item) {
            console.log(item);
            if (this.selectedItem === item) {
                return;
            }
            this.selectedItem = item;
            // this.getZhenduan(item.fixmedins_mdtrt_id);
            // this.getMingXi(item.fixmedins_mdtrt_id);
        },
        // 获取门诊自费病人列表
        async getDanJuList() {
            this.loading = true;
            const response = await this.$axios.post('/yibaofuzhu/getMenZhenZiFeiList',{begin_time:this.date[0],end_time:this.date[1]});
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
            this.selectedItem = null;
            this.zhenduanList = [];
            this.mingxiList = [];
            this.loading = false;
        },

        //获取门诊诊断
        async getZhenduan(id){
            this.loading = true;
            const response = await this.$axios.post('/yibaofuzhu/getzhenduan',{id:id});
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    this.zhenduanList = result.result;
                }else{
                    this.zhenduanList = [];
                    console.log(response.data);
                }
            }
            this.loading = false;
        },

        //获取明细
        async getMingXi(id){
            this.loading = true;
            const response = await this.$axios.post('/yibaofuzhu/getMingXi',{id:id});
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    this.mingxiList = result.result;
                }else{
                    this.mingxiList = [];
                    console.log(response.data);
                }
            }
            this.loading = false;
        },

        //上传单个病人数据
        async uploadOne() {
            if (!this.selectedItem) {
                console.log('请先选择病人');
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/yibaofuzhu/uploadOne',{id:this.selectedItem.fixmedins_mdtrt_id});
            if (response.data){
                if(response.data.code == 0){
                    // let result = response.data;
                    console.log('上传成功');
                    this.uploadOneFinish();
                }else{
                    console.log(response.data);
                    this.selectedItem['beizhu'] = response.data.result
                }
            }
            this.loading = false;
        },

        //上传单个病人数据完成
        async uploadOneFinish() {
            if (!this.selectedItem) {
                console.log('请先选择病人');
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/yibaofuzhu/uploadOneFinish',{id:this.selectedItem.fixmedins_mdtrt_id});
            if (response.data){
                if(response.data.code == 0){
                    // let result = response.data;
                    console.log('上传完成');
                    this.selectedItem['FSTATE'] = 'UPLOAD';
                }else{
                    console.log(response.data);
                }
            }
            this.loading = false;
        },


        //上传所有未上传数据
        async uploadAll() {
            this.loading = true;
            let count = this.danJuList.length;
            for(let i=0; i < count ;i++){
                if(this.danJuList[i].FSTATE != 0){
                    this.selectedItem = this.danJuList[i];
                    await this.uploadOne();
                }
            }

            this.loading = false;
        }

    }
}
</script>


<style scoped>
.highlighted{background-color: #cceeff}
.finished{background-color:#7CFC0077}
</style>