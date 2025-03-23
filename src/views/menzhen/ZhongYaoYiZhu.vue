<template>
    <v-dialog v-model="showFlag" persistent width="930px">
        <div style="background-color: #fff;">
            <div style="text-align: center;font-size:20px;font-weight:bold">中药处方</div>
            <!-- 处方内容 -->
            <div style="height:400px;margin-top: 10px;border:1px solid #ccc;margin:0 10px;">
                <div style="border-bottom: 1px solid #ccc;">
                    <div style="display: inline-block;width:40px;"></div>
                    <div style="display: inline-block;text-align: center;width:100px;">名称</div>
                    <div style="display: inline-block;text-align: center;width:50px;">剂量</div>
                    <div style="display: inline-block;text-align: center;width:50px;">单位</div>
                    <div style="display: inline-block;text-align: center;width:60px;">脚注</div>
                    <div style="display: inline-block;width:40px;"></div>
                    <div style="display: inline-block;text-align: center;width:100px;">名称</div>
                    <div style="display: inline-block;text-align: center;width:50px;">剂量</div>
                    <div style="display: inline-block;text-align: center;width:50px;">单位</div>
                    <div style="display: inline-block;text-align: center;width:60px;">脚注</div>
                    <div style="display: inline-block;width:40px;"></div>
                    <div style="display: inline-block;text-align: center;width:100px;">名称</div>
                    <div style="display: inline-block;text-align: center;width:50px;">剂量</div>
                    <div style="display: inline-block;text-align: center;width:50px;">单位</div>
                    <div style="display: inline-block;text-align: center;width:60px;">脚注</div>
                </div>
                <!-- 已有 -->
                <div v-for="(item,index) in yizhuList" style="display: inline-block;">
                    <div style="display: inline-block;text-align: right;width:40px;">
                        <v-icon icon="mdi-close" color="error" @click=""></v-icon>
                    </div>
                    <div style="display: inline-block;text-align: center;width:100px;vertical-align: middle;">
                        <v-text-field v-model="item.fxmname" density="compact" hide-details width="90px" ></v-text-field>
                    </div>
                    <div style="display: inline-block;text-align: center;width:50px;vertical-align: middle;">
                        <v-text-field :ref="'jiliang'" v-model="item.jiliang" 
                        :loading="loading" density="compact" hide-details width="50px"  ></v-text-field>
                    </div>
                    <div style="display: inline-block;text-align: center;width:50px;">{{ item.fdanwei }}</div>
                    <div style="display: inline-block;text-align: center;width:60px;vertical-align: middle;">
                        <v-select v-model="item.jiaozhu" :items="jiaozhuList" return-object density="compact" hide-details></v-select>
                    </div>
                </div>
                <!-- 新增 -->
                <div style="display: inline-block;">
                    <div style="display: inline-block;text-align: right;width:40px;">
                        <v-icon icon="mdi-close" color="error"></v-icon>
                    </div>
                    <div style="display: inline-block;text-align: center;width:100px;vertical-align: middle;">
                        <v-text-field v-model="zyname" @keydown.enter.prevent="goToGetYiZhuContent" density="compact" hide-details width="90px" ></v-text-field>
                        <div style="position: fixed;width:900px;left:5%;z-index:999;">
                            <v-data-table v-show="showZhongYaoFlag"  :headers="zhongYaoHeaders" :items="zhongYaoList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="50" :items-per-page-text="'条/页'" 
                                density="compact"   style="font-size:12px;z-index:999" height="500px">
                                <template v-slot:headers>
                                    <tr>
                                        <th v-for="column in zhongYaoHeaders" :key="column.key">
                                            <div :style="{width:column.width}">{{column.title}}</div>
                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:item="{ item }">
                                    <tr @click="selectZhongYao(item)" :ref="item.fxmbm" :class="{highlighted:selectedZhongYao === item}">
                                        <td v-for="column in zhongYaoHeaders">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                    <div style="display: inline-block;text-align: center;width:50px;vertical-align: middle;">
                        <v-text-field  v-model="jiliang" 
                        :loading="loading" density="compact" hide-details width="50px"  ></v-text-field>
                    </div>
                    <div style="display: inline-block;text-align: center;width:50px;"></div>
                    <div style="display: inline-block;text-align: center;width:60px;vertical-align: middle;">
                        <v-select v-model="jiaozhu" :items="jiaozhuList" return-object density="compact" hide-details></v-select>
                    </div>
                </div>
            </div>
            <div  style="text-align: center;font-size:20px;font-weight:bold">费用明细</div>
            <div style="height:200px;margin-top: 10px;border:1px solid #ccc;margin:0 10px;">
                {{ yizhuList }}
            </div>
            <div style="text-align: center;margin: 10px 0;">
                <v-btn @click="showFlag = false" color="primary" prepend-icon="mdi-check">确定</v-btn>
                <v-btn @click="showFlag = false" color="error" prepend-icon="mdi-close" style="margin-left: 200px;">取消</v-btn>
            </div>
           
        </div>
        <div v-show="showZhongYaoFlag" @click="showZhongYaoFlag = false" class="zhezhao"></div>
    </v-dialog>
</template>

<script>

export default {
    name: 'ZhongYaoYiZhu',
    props:{
        show:{
            type:Boolean,
            default:true
        },
        firstZY:{
            type:Object,
        },
        ksID:{
            type:Number,
            required:true
        },
    },
    data() {
        return {
            showFlag: false,
            zyname: '',//中药名
            jiliang: '',//剂量

            jiaozhuList: [],//脚注
            jiaozhu: null,//脚注

            yizhuList: [],//医嘱列表

            loading: false,

            zhongYaoList: [],//中药列表
            zhongYaoHeaders:[
                {title:'项目编码',key:'fxmbm',width:'60px'},
                {title:'项目名称',key:'fxmname',width:'60px'},
                {title:'是否报销',key:'fsfbx',width:'60px'},
                {title:'规格',key:'fguige',width:'40px'},
                {title:'单价',key:'fprice',width:'40px'},
                {title:'单位',key:'fdanwei',width:'40px'},
                {title:'库存数量',key:'famount',width:'60px'},
                {title:'药房',key:'fyaofang',width:'80px'},
                {title:'厂家',key:'fchangjia',width:'40px'},
                {title:'说明',key:'fshuoming',width:'40px'},
                // {title:'项目特性',key:'fxmtx',width:'40px'},
                {title:'类型',key:'fleixing',width:'40px'},
            ],
            showZhongYaoFlag:false,
            selectedZhongYao:null,
        }
    },
    mounted(){
        this.getZhongYaoJiaoZhu();
    },
    methods: {
        //获取中药脚注
        async getZhongYaoJiaoZhu(){
            const response = await this.$axios.get('/menzhenyizhu/getZhongYaoJiaoZhu');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    let list = result.result;
                    this.jiaozhuList.push({title:'',value:''})
                    for(let i=0;i<list.length;i++){
                        this.jiaozhuList.push({title:list[i].jiaozhu,value:list[i].jbbm})
                    }
                }else{

                }
            }
        },

        // 获取中药医嘱
        async getZhongYaoYiZhu(){
            const response = await this.$axios.post('/menzhenyizhu/getZhongYaoYiZhu',{content:this.zyname,keshiId:this.ksID});
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                   this.zhongYaoList = result.result;
                   this.showZhongYaoFlag = true;
                }else{
                    this.zhongYaoList = [];
                }
            }
        },
        // 选择中药
        async selectZhongYao(item){
            this.yizhuList.push(item);
            this.showZhongYaoFlag = false;
            this.selectedZhongYao = null;
        },
        // 回车获取医嘱内容
        goToGetYiZhuContent(event){
            if(!this.showZhongYaoFlag){
                this.getZhongYaoYiZhu();
            }else{
                if (this.selectedZhongYao == null){
                    if(this.zhongYaoList.length > 0){
                        this.selectedZhongYao = this.zhongYaoList[0];
                    }
                }else{
                    this.selectZhongYao(this.selectedZhongYao);
                }
            }
        },
    },
    watch:{
        show(newVal){
            this.showFlag = true;
            let item = {...this.firstZY};
            this.yizhuList.push(item);
            this.$nextTick(() => {
                console.log(this.$refs['jiliang'][0])
                this.$refs['jiliang'][0].focus();
            });
        }
    },
}

</script>

<style scoped>
.zhezhao{position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);}
:deep(.v-field) {  --v-field-padding-start:6px;  --v-field-padding-end:6px;}
:deep(.v-field.v-field--appended){--v-field-padding-end:0}
:deep(.v-field--appended){padding-inline-end:0;}
:deep(input){font-size:12px;}
:deep(.v-field__input){font-size:12px;}
.highlighted{background-color: #cceeff}

</style>