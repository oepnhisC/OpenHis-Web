<template>
    <div>
        <v-container style="width:100%;margin:0;max-width: 100%;">
            <v-row>
                
                <v-col cols="3" >
                    <v-radio-group v-model="flag" inline style="margin-top: 10px;" >
                    <v-radio label="汇总" value="0" ></v-radio>
                    <v-radio label="明细" value="1" ></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col  ><v-btn @click="loadData()" :loading="loading" size="x-large">刷新</v-btn></v-col>
            </v-row>
            
            <v-data-table v-show="flag==1" :headers="headers" :items="danJuList"   
             :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
             no-data-text="暂无数据" hide-default-footer  
             style="width: 100%;font-size:12px;height: 750px;white-space: nowrap;" >
             <template v-slot:item="{ item }">
                <tr :class="{'highlighted':selectedItem === item }" @click="selectRow(item)"
                 style="white-space: nowrap;">
                    <td>{{ item.fjiuzhenID }}</td>
                    <td>{{ item.fname }}</td>
                    <td>{{ item.fsex }}</td>
                    <td>{{ item.fage }}</td>
                    <td>{{ item.fmzh }}</td>
                    <td>{{ item.fzyzd }}</td>
                    <td>{{ item.fkdys }}</td>
                    <td>{{ item.fkdsj }}</td>
                    <td>{{ item.fxm }}</td>
                    <td>{{ item.fsl }}</td>
                    <td>{{ item.fzj }}</td>
                    <td>{{ item.fdjh }}</td>
                    <td>{{ item.fzfbl }}</td>
                    <td>{{ item.fzfje }}</td>
                    <td>{{ item.fzkbxje }}</td>
                    <td>{{ item.fybbxje }}</td>
                    <td>{{ item.fglbzje }}</td>
                    <td>{{ item.fsfbxg }}</td>
                    <td>{{ item.ffyid }}</td>
                </tr>
             </template>
            </v-data-table>


            <v-data-table v-show="flag==0" :headers="headers2" :items="huizongList"   
             :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
             no-data-text="暂无数据" hide-default-footer  
             style="width: 100%;font-size:12px;height: 750px;white-space: nowrap;" >
            </v-data-table>

        </v-container>
    </div>
</template>


<script>

    export default {
        name: "GaoLingZiFeiBiao",
        data() {
            return {
                date: [],
                items: [
                    { title: "首页", to:'/' ,replace:true,disabled:false},
                    { title: "高龄自费计算表" }
                ],
                headers: [
                    {title: '就诊ID',key: 'fjiuzhenID'},
                    {title: '姓名',key: 'fname'},
                    {title: '性别',key: 'fsex'},
                    {title: '年龄',key: 'fage'},
                    {title: '门诊号',key: 'fmzh'},
                    {title: '主要诊断',key: 'fzyzd'},
                    {title: '开单医生',key: 'fkdys'},
                    {title: '开单时间',key: 'fkdsj'},
                    {title: '项目',key: 'fxm'},
                    {title: '数量',key: 'fsl'},
                    {title: '总价',key: 'fzj'},
                    {title: '单据号',key: 'fdjh'},
                    {title: '自付比例',key: 'fzfbl'},
                    {title: '自费金额',key: 'fzfje'},
                    {title: '总可报销金额',key: 'fzkbxje'},
                    {title: '医保报销金额',key: 'fybbxje'},
                    {title: '高龄补助金额',key: 'fglbzje'},
                    {title: '是否报销过',key: 'fsfbxg'},
                    {title: '费用ID',key: 'ffyid'},
                    
                ],
                headers2: [
                    {title: '就诊ID',key: 'fjiuzhenID'},
                    {title: '姓名',key: 'fname'},
                    {title: '性别',key: 'fsex'},
                    {title: '年龄',key: 'fage'},
                    {title: '门诊号',key: 'fmzh'},
                    {title: '主要诊断',key: 'fzyzd'},
                    {title: '开单医生',key: 'fkdys'},
                    {title: '开单时间',key: 'fkdsj'},
                    {title: '总价',key: 'fzj'},
                    {title: '单据号',key: 'fdjh'},
                    {title: '自费金额',key: 'fzfje'},
                    {title: '总可报销金额',key: 'fzkbxje'},
                    {title: '医保报销金额',key: 'fybbxje'},
                    {title: '高龄补助金额',key: 'fglbzje'},
                    
                ],

                danJuList: [],
                loading: false,
                selectedItem :null,
                flag:'0',

                huizongList:[],
            }
        },
        mounted() {
            this.loadData();
            this.$emit('setbreadcrumbs',this.items);
        },
        methods:{
            // 刷新数据
            async loadData() {
                await this.getDanJuList();  
                await this.getHuiZongList();  
            },
            // 选择单据
            async selectRow(item) {
                console.log(item);
                this.selectedItem = item;
            },
            // 获取单据列表
            async getDanJuList() {
                this.loading = true;
                const response = await this.$axios.get('/shoufei/gaolingjifeibiao');
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

            // 获取汇总列表
            async getHuiZongList() {
                this.loading = true;
                const response = await this.$axios.get('/shoufei/gaolingjifeihuizong');
                if (response.data){
                    if(response.data.code == 0){
                        let result = response.data;
                        console.log(result);
                        this.huizongList = result.result;
                    }else{
                        this.huizongList = [];
                        console.log(response.data);
                    }
                }
                this.loading = false;
            },
           

        },
    }
</script>


<style scoped>
.highlighted{background-color: #cceeff}
</style>