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
        <div style="margin-top:5px;height:278px;border-bottom: 1px solid #e0e0e0;">
            <!-- 医嘱单诊断 -->
            <div style="display: inline-block;vertical-align:top;width:350px;">
                <div style="text-align: center;">当前医嘱单诊断</div>
                <v-data-table :headers="zhenDuanHeaders" :items="zhenDuanList" 
                    :items-per-page="50"  sticky :loading="loading" loading-text="正在加载中"
                    no-data-text="暂无数据"  density="compact" hide-default-footer 
                    style="border:1px solid #e0e0e0;white-space: nowrap;height: 252px;font-size:12px;">
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
                    <v-text-field v-model="searchJiBingContent" @keydown="searchJiBing" :loading="loading" 
                        label="疾病编码、名称" density="compact" hide-details width="200px"
                         style="display: inline-block;vertical-align: top;"></v-text-field>
                    <v-btn @click="getICD10Code()" :loading="loading" >搜索</v-btn>
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
                <!-- 紧急 并发症 -->
                <div style="display: inline-block;">
                    <v-checkbox v-model="isJinJi" label="紧急" style="display: inline-block;height:20px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                    <v-checkbox v-model="isBingFaZheng" label="并发症" style="display: inline-block;height:20px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                </div>
                <!-- 开始时间 工伤-->
                <div style="vertical-align: top;height:35px">
                    <VueDatePicker v-model="beginTime" format="yyyy-MM-dd HH:mm:ss"  auto-apply enable-seconds time-picker-inline
                        locale="zh-cn"  text-input  class="ghcell" placeholder="开始时间"
                        style="width:200px;--dp-input-padding:3px;margin-bottom:5px;display:inline-block;vertical-align: top;" ></VueDatePicker>
                    <v-checkbox  label="因工伤" style="display: inline-block;height:20px;margin-left:70px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                </div>
                <!-- 医嘱内容 -->
                <div>
                    <v-textarea @keydown="goToGetYiZhuContent"  @keydown.enter.prevent label="医嘱内容" v-model="yiZhuContent" :loading="loading" 
                    rows="3" row-height="20" style="width:300px;display:inline-block;vertical-align:middle" no-resize hide-details
                    clearable ></v-textarea>
                    <v-btn @click="getYiZhuContent()" :loading="loading"  size="large">搜索</v-btn>
                    <div style="position: fixed;width:80%;left:10%;z-index:999;">
                        <v-data-table v-show="showYiZhuFlag"  :headers="yiZhuHeaders" :items="yiZhuList"  fixed-header  no-data-text="找不到数据" 
                              :items-per-page="50" :items-per-page-text="'条/页'" 
                            density="compact"   style="font-size:12px;z-index:999" height="500px">
                            <template v-slot:headers>
                                <tr>
                                    <th v-for="column in yiZhuHeaders" :key="column.key">
                                        <div :style="{width:column.width}">{{column.title}}</div>
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:item="{ item }">
                                <tr @click="selectYiZhu(item)">
                                    <td v-for="column in yiZhuHeaders">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <!-- 给药途径 -->
                <div style="margin-top:5px;display:inline-block;vertical-align:top;width:220px;">
                    <v-text-field v-model="gytj" :loading="loading" @focus="showGytjFlag = true"  @click="showGytjFlag = true" 
                        label="给药途径" density="compact" hide-details width="220px"  @keydown.enter.prevent="enterRowGytj" @keydown.up.prevent="selectUpRowGytj" @keydown.down.prevent="selectDownRowGytj"
                         style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearGytj" ></v-text-field>
                    <div style="position: fixed;width:300px;z-index:999;">
                        <v-data-table v-show="showGytjFlag" :search="gytj"  :headers="gytjHeaders" :items="gytjList"  fixed-header  no-data-text="找不到数据" 
                            :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                            density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                            <template v-slot:item="{ item }">
                                <tr @click="selectGytj(item)" :class="{highlighted:selectedGytj === item}" :ref="item.fxmname">
                                    <td v-for="column in gytjHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                
                <!-- 执行频率 -->
                <div style="margin-top:5px;margin-left:10px;display: inline-block;vertical-align:top;width:180px;">
                    <v-text-field v-model="zxpl" :loading="loading" @focus="showZxplFlag = true"  @click="showZxplFlag = true" 
                        label="执行频率" density="compact" hide-details width="180px"  @keydown.enter.prevent="enterRowZxpl" @keydown.up.prevent="selectUpRowZxpl" @keydown.down.prevent="selectDownRowZxpl"
                         style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearZxpl" ></v-text-field>
                    <div style="position: fixed;width:200px;z-index:999;">
                        <v-data-table v-show="showZxplFlag" :search="zxpl"  :headers="zxplHeaders" :items="zxplList"  fixed-header  no-data-text="找不到数据" 
                            :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                            density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                            <template v-slot:item="{ item }">
                                <tr @click="selectZxpl(item)" :class="{highlighted:selectedZxpl === item}" :ref="item.fpcname">
                                    <td v-for="column in zxplHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                
                
                <!-- 剂量 -->
                <div style="margin-top:5px;vertical-align:top;">
                    <v-text-field label="剂量" type="number" 
                    :loading="loading" density="compact" hide-details width="68px" style="display: inline-block;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: super;">片</div>
                    <v-text-field label="天数" type="number" 
                    :loading="loading" density="compact" hide-details width="60px" style="display: inline-block;margin-left:20px;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: super;">天</div>
                    <v-text-field label="总量" type="number"  readonly
                    :loading="loading" density="compact" hide-details width="68px" style="display: inline-block;margin-left:20px;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: super;">片</div>
                    
                </div>

            </div>
            <div style="display: inline-block;margin-left:10px;vertical-align: top;height: 100%;width:1px">
                <v-divider vertical style="height: 100%;"></v-divider>
            </div>
            <!-- 医嘱明细2 -->
            <div style="display: inline-block;margin-left:15px;vertical-align: top;">
                <!-- 给药次数 -->
                <v-text-field label="给药次数" type="number" readonly :loading="loading" density="compact" hide-details width="88px" style="display: inline-block;vertical-align:top;" ></v-text-field>
                <!-- 用药目的 -->
                <div style="margin-left:20px;display: inline-block;vertical-align:top;width:120px;">
                    <v-text-field v-model="yymd" :loading="loading" @focus="showYymdFlag = true"  @click="showYymdFlag = true" 
                        label="用药目的" density="compact" hide-details width="120px"  @keydown.enter.prevent="enterRowYymd" @keydown.up.prevent="selectUpRowYymd" @keydown.down.prevent="selectDownRowYymd"
                         style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearYymd" ></v-text-field>
                    <div style="position: fixed;width:200px;z-index:999;">
                        <v-data-table v-show="showYymdFlag" :search="yymd"  :headers="yymdHeaders" :items="yymdList"  fixed-header  no-data-text="找不到数据" 
                            :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                            density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                            <template v-slot:item="{ item }">
                                <tr @click="selectYymd(item)" :class="{highlighted:selectedYymd === item}" :ref="item.fyymdname">
                                    <td v-for="column in yymdHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <div style="margin-top:5px;">
                    <!-- 滴速 -->
                    <v-text-field label="滴速" type="number" :loading="loading" density="compact" hide-details width="68px" style="display: inline-block;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: super;">滴</div>
                    <!-- 医师嘱托 -->
                    <v-text-field label="医师嘱托" :loading="loading" density="compact" hide-details width="200px" style="display: inline-block; margin-left:20px;" ></v-text-field>
                    <!-- 医嘱备注 -->
                    <div style="margin-left:20px;display: inline-block;vertical-align:top;width:200px;">
                        <v-text-field v-model="yzbz" :loading="loading" @focus="showYzbzFlag = true"  @click="showYzbzFlag = true" 
                            label="医嘱备注" density="compact" hide-details width="200px"  @keydown.enter.prevent="enterRowYzbz" @keydown.up.prevent="selectUpRowYzbz" @keydown.down.prevent="selectDownRowYzbz"
                            style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearYzbz" ></v-text-field>
                        <div style="position: fixed;width:200px;z-index:999;">
                            <v-data-table v-show="showYzbzFlag" :search="yzbz"  :headers="yzbzHeaders" :items="yzbzList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                                density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectYzbz(item)" :class="{highlighted:selectedYzbz === item}" :ref="item.fmemo">
                                        <td v-for="column in yzbzHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </div>
                <div style="margin-top:5px;">
                    <!-- 执行科室 -->
                    <div style="display: inline-block;vertical-align:top;width:200px;">
                        <v-text-field v-model="zxks" :loading="loading" @focus="showZxksFlag = true"  @click="showZxksFlag = true" 
                            label="执行科室" density="compact" hide-details width="200px"  @keydown.enter.prevent="enterRowZxks" @keydown.up.prevent="selectUpRowZxks" @keydown.down.prevent="selectDownRowZxks"
                            style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearZxks" ></v-text-field>
                        <div style="position: fixed;width:200px;z-index:999;">
                            <v-data-table v-show="showZxksFlag" :search="zxks"  :headers="zxksHeaders" :items="zxksList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                                density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectZxks(item)" :class="{highlighted:selectedZxks === item}" :ref="item.fksname">
                                        <td v-for="column in zxksHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                    <!-- 给药执行科室 -->
                    <div style="display: inline-block;vertical-align:top;width:200px;">
                        <v-text-field v-model="gyzxks" :loading="loading" @focus="showGyZxksFlag = true"  @click="showGyZxksFlag = true" 
                            label="给药执行科室" density="compact" hide-details width="200px"  @keydown.enter.prevent="enterRowZxks" @keydown.up.prevent="selectUpRowZxks" @keydown.down.prevent="selectDownRowZxks"
                            style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearZxks" ></v-text-field>
                        <div style="position: fixed;width:200px;z-index:999;">
                            <v-data-table v-show="showGyZxksFlag" :search="gyzxks"  :headers="gyzxksHeaders" :items="gyzxksList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                                density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectGyZxks(item)" :class="{highlighted:selectedGyZxks === item}" :ref="item.fksname">
                                        <td v-for="column in gyzxksHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showMask" @click="closeMask()" class="zhezhao"></div>
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

            isJinJi:false, //紧急
            isBingFaZheng:false, //并发症
            beginTime:'', //开始时间
            yiZhuContent:'', //医嘱内容

            showYiZhuFlag:false,
            yiZhuList:[],
            yiZhuHeaders:[
                {title:'项目编码',key:'fxmbm',width:'60px'},
                {title:'项目名称',key:'fxmname',width:'60px'},
                {title:'是否报销',key:'fsfbx',width:'60px'},
                {title:'规格',key:'fguige',width:'40px'},
                {title:'单价',key:'fprice',width:'40px'},
                {title:'单位',key:'fdanwei',width:'40px'},
                {title:'库存数量',key:'famount',width:'60px'},
                {title:'药房',key:'fyaofang',width:'40px'},
                {title:'厂家',key:'fchangjia',width:'40px'},
                {title:'说明',key:'fshuoming',width:'40px'},
                {title:'项目特性',key:'fxmtx',width:'40px'},
                {title:'类型',key:'fleixing',width:'40px'},
            ],
            selectedYiZhu:{},

            gytj:'', //给药途径
            gytjList:[],
            gytjHeaders:[
                {title:'名称',key:'fxmname',width:'60px'}
            ],
            showGytjFlag:false,
            selectedGytj:null,

            zxpl:'', //执行频率
            zxplList:[],
            zxplHeaders:[
            {title:'名称',key:'fpcname',width:'60px'}
            ],
            showZxplFlag:false,
            selectedZxpl:null,

            yymd:'', //用药目的
            yymdList:[],
            yymdHeaders:[
                {title:'名称',key:'fyymdname',width:'60px'} 
            ],
            showYymdFlag:false,
            selectedYymd:null,

            yzbz:'', //医嘱备注
            yzbzList:[],
            yzbzHeaders:[
                {title:'备注',key:'fmemo',width:'60px'}
            ],
            showYzbzFlag:false,
            selectedYzbz:null,

            zxks:'', //执行科室
            zxksList:[],
            zxksHeaders:[
                {title:'名称',key:'fksname',width:'60px'}
            ],
            showZxksFlag:false,
            selectedZxks:null,

            gyzxks:'', //给药执行科室
            gyzxksList:[],
            gyzxksHeaders:[
                {title:'名称',key:'fksname',width:'60px'}
            ],
            showGyZxksFlag:false,
            selectedGyZxks:null,



        }
    },
    mounted(){
        this.getGeiYaoTuJing();
        this.getZhiXingFenLi();
        this.getYongYaoMuDi();
        this.getYiZhuBeiZhu();
        this.getZhiXingKeShi();
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
                    this.yiZhuList = result.result;
                    this.showYiZhuFlag = true;
				}else{
                    this.yiZhuList = []; 
                    this.showYiZhuFlag = true;
				}
			}
            this.loading = false;
        },
        // 回车获取医嘱内容
        goToGetYiZhuContent(event){
            if(event.keyCode == 13){
				this.getYiZhuContent();
            }
        },
        // 选择医嘱内容
        selectYiZhu(item){
            this.showYiZhuFlag = false;
            console.log(item);
            this.selectedYiZhu = item;
            this.yiZhuContent = item.fxmbm + ' ' + item.fxmname + ' ' + item.fguige;
        },
        //获取给药途径
        async getGeiYaoTuJing(){
            const response = await this.$axios.get('/menzhenyizhu/getGeiYaoTuJing');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.gytjList = result.result;
                }else{
                    this.gytjList = [];
                }
            }
        },
        // 选择给药途径
        selectGytj(item){
            this.showGytjFlag = false;
            this.selectedGytj = item;
            this.gytj = item.fxmname;
        },
        // 回车选择给药途径
        enterRowGytj(){
            if (this.selectedGytj == null){
                if(this.gytjList.length > 0){
                    //过滤后的第一行数据
                    this.selectedGytj = this.gytjList.filter(item => item.fxmname.indexOf(this.gytj) >= 0)[0];
                }
            }else{
                this.gytj = this.selectedGytj.fxmname;
                this.showGytjFlag = false;
            }
        },
        // 向上选择给药途径
        selectUpRowGytj(){
            let list = [];
            if(this.gytj == ''){
                list = this.gytjList;
            }else{
                list = this.gytjList.filter(item => item.fxmname.indexOf(this.gytj) >= 0);
            }
            console.log(list);
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedGytj == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fxmname == this.selectedGytj.fxmname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedGytj = list[currentIndex];
                this.$refs[this.selectedGytj.fxmname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择给药途径
        selectDownRowGytj(){
            let list = [];
            if(this.gytj == ''){
                list = this.gytjList;
            }else{
                list = this.gytjList.filter(item => item.fxmname.indexOf(this.gytj) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedGytj == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fxmname == this.selectedGytj.fxmname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedGytj = list[currentIndex];
                this.$refs[this.selectedGytj.fxmname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除给药途径
        clearGytj(){
            this.gytj = '';
            this.selectedGytj = null;
            this.showGytjFlag = true;
        },
        // 获取执行频率
        async getZhiXingFenLi(){
            const response = await this.$axios.get('/menzhenyizhu/getPinci');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zxplList = result.result;
                }else{
                    this.zxplList = [];
                }
            }
        },
        // 选择执行频率
        selectZxpl(item){
            this.showZxplFlag = false;
            this.selectedZxpl = item;
            this.zxpl = item.fpcname;
        },
        // 回车选择执行频率
        enterRowZxpl(){
            if (this.selectedZxpl == null){
                if(this.zxplList.length > 0){
                    //过滤后的第一行数据
                    this.selectedZxpl = this.zxplList.filter(item => item.fpcname.indexOf(this.zxpl) >= 0)[0];
                }
            }else{
                this.zxpl = this.selectedZxpl.fpcname;
                this.showZxplFlag = false;
            }
        },
        // 向上选择执行频率
        selectUpRowZxpl(){
            let list = [];
            if(this.zxpl == ''){
                list = this.zxplList;
            }else{
                list = this.zxplList.filter(item => item.fpcname.indexOf(this.zxpl) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxpl == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fpcname == this.selectedZxpl.fpcname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedZxpl = list[currentIndex];
                this.$refs[this.selectedZxpl.fpcname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择执行频率
        selectDownRowZxpl(){
            let list = [];
            if(this.zxpl == ''){
                list = this.zxplList;
            }else{
                list = this.zxplList.filter(item => item.fpcname.indexOf(this.zxpl) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxpl == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fpcname == this.selectedZxpl.fpcname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedZxpl = list[currentIndex];
                this.$refs[this.selectedZxpl.fpcname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }       
        },
        // 清除执行频率
        clearZxpl(){
            this.zxpl = '';
            this.selectedZxpl = null;
            this.showZxplFlag = true;
        },
        //关闭遮罩
        closeMask(){
            this.showJiBingFlag = false;
            this.showYiZhuFlag = false;
            this.showGytjFlag = false;
            this.showZxplFlag = false;
            this.showYymdFlag = false;
            this.showYzbzFlag = false;
            this.showZxksFlag = false;
        },
        // 获取用药目的
        async getYongYaoMuDi(){
            const response = await this.$axios.get('/menzhenyizhu/getYongYaoMuDi');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.yymdList = result.result;
                }else{
                    this.yymdList = [];
                }
            }
        },
        // 选择用药目的
        selectYymd(item){
            this.showYymdFlag = false;
            this.selectedYymd = item;
            this.yymd = item.fyymdname;
        },
        // 回车选择用药目的
        enterRowYymd(){
            if (this.selectedYymd == null){
                if(this.yymdList.length > 0){
                    //过滤后的第一行数据
                    this.selectedYymd = this.yymdList.filter(item => item.fyymdname.indexOf(this.yymd) >= 0)[0];
                }
            }else{
                this.yymd = this.selectedYymd.fyymdname;
                this.showYymdFlag = false;
            }
        },
        // 向上选择用药目的
        selectUpRowYymd(){
            let list = [];
            if(this.yymd == ''){
                list = this.yymdList;
            }else{
                list = this.yymdList.filter(item => item.fyymdname.indexOf(this.yymd) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYymd == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fyymdname == this.selectedYymd.fyymdname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedYymd = list[currentIndex];
                this.$refs[this.selectedYymd.fyymdname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择用药目的
        selectDownRowYymd(){
            let list = [];
            if(this.yymd == ''){
                list = this.yymdList;
            }else{
                list = this.yymdList.filter(item => item.fyymdname.indexOf(this.yymd) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYymd == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fyymdname == this.selectedYymd.fyymdname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedYymd = list[currentIndex];
                this.$refs[this.selectedYymd.fyymdname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除用药目的
        clearYymd(){
            this.yymd = '';
            this.selectedYymd = null;
            this.showYymdFlag = true;
        },
        // 获取医嘱备注
        async getYiZhuBeiZhu(){
            const response = await this.$axios.get('/menzhenyizhu/getYiZhuBeiZhu');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.yzbzList = result.result;
                }else{
                    this.yzbzList = [];
                }
            }
        },
        // 选择医嘱备注
        selectYzbz(item){
            this.showYzbzFlag = false;
            this.selectedYzbz = item;
            this.yzbz = item.fmemo;
        },
        // 回车选择医嘱备注
        enterRowYzbz(){
            if (this.selectedYzbz == null){
                if(this.yzbzList.length > 0){
                    //过滤后的第一行数据
                    this.selectedYzbz = this.yzbzList.filter(item => item.fmemo.indexOf(this.yzbz) >= 0)[0];
                }
            }else{
                this.yzbz = this.selectedYzbz.fmemo;
                this.showYzbzFlag = false;
            }
        },
        // 向上选择医嘱备注
        selectUpRowYzbz(){
            let list = [];
            if(this.yzbz == ''){
                list = this.yzbzList;
            }else{
                list = this.yzbzList.filter(item => item.fmemo.indexOf(this.yzbz) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYzbz == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fmemo == this.selectedYzbz.fmemo);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedYzbz = list[currentIndex];
                this.$refs[this.selectedYzbz.fmemo].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择医嘱备注
        selectDownRowYzbz(){
            let list = [];
            if(this.yzbz == ''){
                list = this.yzbzList;
            }else{
                list = this.yzbzList.filter(item => item.fmemo.indexOf(this.yzbz) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYzbz == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fmemo == this.selectedYzbz.fmemo);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedYzbz = list[currentIndex];
                this.$refs[this.selectedYzbz.fmemo].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除医嘱备注
        clearYzbz(){
            this.yzbz = '';
            this.selectedYzbz = null;
            this.showYzbzFlag = true;
        },
        // 获取执行科室
        async getZhiXingKeShi(){
            const response = await this.$axios.get('/menzhenyizhu/getZhiXingKeShi');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zxksList = result.result;
                }else{
                    this.zxksList = []; 
                }
            }
        },
        // 选择执行科室
        selectZxks(item){
            this.showZxksFlag = false;
            this.selectedZxks = item;
            this.zxks = item.fksname;   
        },
        // 回车选择执行科室
        enterRowZxks(){
            if (this.selectedZxks == null){  
                if(this.zxksList.length > 0){
                    //过滤后的第一行数据
                    this.selectedZxks = this.zxksList.filter(item => item.fksname.indexOf(this.zxks) >= 0)[0];
                }
            }else{
                this.zxks = this.selectedZxks.fksname;
                this.showZxksFlag = false;
            }
        },
        // 向上选择执行科室
        selectUpRowZxks(){
            let list = [];
            if(this.zxks == ''){
                list = this.zxksList;
            }else{
                list = this.zxksList.filter(item => item.fksname.indexOf(this.zxks) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxks == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fksname == this.selectedZxks.fksname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedZxks = list[currentIndex];
                this.$refs[this.selectedZxks.fksname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择执行科室
        selectDownRowZxks(){
            let list = [];
            if(this.zxks == ''){
                list = this.zxksList;
            }else{
                list = this.zxksList.filter(item => item.fksname.indexOf(this.zxks) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxks == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fksname == this.selectedZxks.fksname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedZxks = list[currentIndex];
                this.$refs[this.selectedZxks.fksname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }   
        },
        // 清除执行科室
        clearZxks(){
            this.zxks = '';
            this.selectedZxks = null;
            this.showZxksFlag = true;
        },
        // 获取给药执行科室
        async getGeiYaoZhiXingKeShi(){
            const response = await this.$axios.get('/menzhenyizhu/getGeiYaoZhiXingKeShi');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.gyksList = result.result;
                }else{
                    this.gyksList = [];
                }
            }
        },
        



    },
    computed:{
        showMask(){
            if (this.showJiBingFlag || this.showYiZhuFlag || this.showGytjFlag || this.showZxplFlag
                || this.showYymdFlag || this.showYzbzFlag || this.showZxksFlag
            ){
                return true;
            }else{
                return false;
            }
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
.ghcell{width:300px;display: inline-block;vertical-align:middle;}
.highlighted{background-color: #cceeff}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;height: 30px;
}
.hover-bg-blue:hover{background-color: #cceeff}
.zhezhao{position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);}
:deep(.v-field) {  --v-field-padding-start:6px;  --v-field-padding-end:6px;}
:deep(.v-field.v-field--appended){--v-field-padding-end:0}
:deep(.v-field--appended){padding-inline-end:0;}
:deep(input){font-size:14px;}
</style>

