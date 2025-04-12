<template>
    <div style="margin-top:10px;">
        <div style="display: inline-block;margin-left:20px;height:48px"> 
            <v-radio-group inline v-model="flag" style="margin-left:80px;">
                <v-radio label="门诊" value="1"></v-radio>
                <v-radio label="住院" value="2" ></v-radio>
            </v-radio-group>
        </div>
        <div style="display: inline-block; margin-left:40px;">
            <!-- 时间 -->
            <div style="display:inline-block;vertical-align: text-bottom;margin-left:180px;">
                <span style="display:inline-block;vertical-align: middle;font-size:22px;">{{ flag === '1'?'就诊时间：':'入院时间：' }}</span>
                <VueDatePicker v-model="searchTime" format="yyyy-MM-dd"  
                            locale="zh-cn" day-picker range auto-apply
                            :enable-time-picker="false" text-input select-text="确定" cancel-text="取消" 
                            style="width:250px;--dp-input-padding:10px;display:inline-block;" ></VueDatePicker>
            </div>
            <!-- 门诊搜索框 -->
            <div v-show="flag === '1'" style="display:inline-block;margin-left:30px;">
                <v-text-field label="姓名、门诊号、卡号、拼音首写字母" v-model="searchContent"  @keydown.enter.prevent="chaXunBingRen()" :loading="loading"
                            density="compact" hide-details append-icon="mdi-magnify" clearable
                              style="width:300px;" @click:append="chaXunBingRen()"></v-text-field>
                <div style="position: fixed;width:800px;z-index:999;left:30%">
					<v-data-table-virtual v-show="showGuaHaoList"  :headers="guahaoHeaders" :items="guahaoList"  fixed-header  no-data-text="暂无数据" 
						density="compact"   style="white-space: nowrap;font-size:12px;z-index:999" height="400">
						<template v-slot:headers>
							<tr>
								<th v-for="column in guahaoHeaders" :key="column.key">
									<div :style="{width:column.width}">{{column.title}}</div>
								</th>
							</tr>
						</template>
						<template v-slot:item="{ item }">
							<tr class="highlight_hover" @click="selectBingRen(item)">
								<td v-for="column in guahaoHeaders">{{ item[column.key] }}</td>
							</tr>
						</template>
					</v-data-table-virtual>
				</div>
				<div v-show="showGuaHaoList" @click="showGuaHaoList = false" style="position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);"></div>
            </div>
            <!-- 住院搜索框 -->
            <div v-show="flag === '2'" style="display:inline-block;margin-left:30px;">
                <v-text-field label="姓名、住院号、拼音首写字母" v-model="searchContent"  @keydown.enter.prevent="chaXunZhuYuanBingRen()" :loading="loading"
                            density="compact" hide-details append-icon="mdi-magnify" clearable
                              style="width:300px;" @click:append="chaXunZhuYuanBingRen()"></v-text-field>
                <div style="position: fixed;width:800px;z-index:999;left:30%">
					<v-data-table-virtual v-show="showZhuYuanChaXunFlag"  :headers="zhuYuanHeaders" :items="zhuYuanChaXunList"  fixed-header  no-data-text="暂无数据" 
						density="compact"   style="white-space: nowrap;font-size:12px;z-index:999" height="400">
						<template v-slot:headers>
							<tr>
								<th v-for="column in zhuYuanHeaders" :key="column.key">
									<div :style="{width:column.width}">{{column.title}}</div>
								</th>
							</tr>
						</template>
						<template v-slot:item="{ item }">
							<tr class="highlight_hover" @click="selectZhuYuan(item)">
								<td v-for="column in zhuYuanHeaders">{{ item[column.key] }}</td>
							</tr>
						</template>
					</v-data-table-virtual>
				</div>
				<div v-show="showZhuYuanChaXunFlag" @click="showZhuYuanChaXunFlag = false" style="position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);"></div>
            </div>
        </div>
        <!-- 门诊 -->
        <div v-show="flag === '1'">
            <!-- 就诊列表 -->
            <div style="display:inline-block;width:300px;vertical-align: top;">
                <div style="font-size:20px;height: 40px;">
                    <span style="font-weight:bold;vertical-align: super;">门诊患者列表</span>
                    <v-btn size="small" style="margin-left:10px;vertical-align: super;" @click="getJiuZhenList()" prepend-icon="mdi-refresh" :loadding="loading">刷新</v-btn>
                </div>
                <div style="font-size:14px;"><span style="font-weight:bold;vertical-align: super;">(仅显示2日内挂号病人,超出范围需单独查询)</span></div>
                <v-data-table :headers="jiuzhenHeaders" :items="jiuzhenList" :filter-keys="['fjzks','fys']" :search="searchJiuZhen"
                    :items-per-page="100"   :loading="loading" loading-text="正在加载中" fixed-header
                    no-data-text="暂无数据"  density="compact" hide-default-footer
                    style="font-size:12px;border:1px solid #e0e0e0;" :height="windowSize.height - 200 + 'px'" >
                    <template v-slot:headers>
                        <tr>
                            <th v-for="column in jiuzhenHeaders" :key="column.key">
                                <div :style="{width:column.width}">{{column.title}}</div>
                            </th>
                        </tr>
                    </template>
                    <template v-slot:item="{ item }">
                        <tr :class="{'highlighted':selectedJiuZhen === item }" @click="selectJiuZhen(item)">
                            <td v-for="column in jiuzhenHeaders"
                            :class="jiuzhenColor(item,column.key)">{{ item[column.key] }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
            
            <div style="display:inline-block;margin-left:8px;" :style="{'width':windowSize.width - 320 + 'px'}">
                <!-- 病人信息 -->
                <div>
                    <v-data-table :headers="personInfoHeaders" :items="personInfoList" 
                        :items-per-page="1"  sticky :loading="loading" loading-text="正在加载中"
                        no-data-text="暂无数据"  density="compact" hide-default-footer
                        style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;width: 100%;" >
                        <template v-slot:headers>
                            <tr>
                                <th v-for="column in personInfoHeaders" :key="column.key">
                                    <div :style="{width:column.width}">{{column.title}}</div>
                                </th>
                            </tr>
                        </template>
                        <template v-slot:item="{ item }">
                            <tr><td v-for="column in personInfoHeaders" :class="{'zifeicolor':item[column.key]=='自费','tebingcolor':item[column.key]=='特种病门诊','dingdiancolor':item[column.key]=='定点'}"
                                >{{ item[column.key] }}</td></tr>
                        </template>
                    </v-data-table>
                </div>
                <!-- 医嘱列表 -->
                <div style="margin-top:8px">
                    <v-data-table  :headers="yiZhuHeaders"  :items="yiZhuLiist" :group-by="yiZhuGroupBy"
                        :items-per-page="100"   :loading="loading" loading-text="正在加载中"
                        no-data-text="暂无数据"  hide-default-footer  :show-expand="true"
                        style="font-size:12px;border:1px solid #e0e0e0;width:100%;" :height="windowSize.height - 215 + 'px'">
                        <template  #group-header="{ item, columns, toggleGroup, isGroupOpen }">
                            <tr  :ref="(el) => {if (!isGroupOpen(item)) toggleGroup(item);}">
                                <td colspan="100%">
                                    <v-btn @click="fenXi(item)" prepend-icon="mdi-poll" color="teal-lighten-3" size="small" style="margin-right:10px;" :loadding="loading">分析</v-btn>
                                    <span style="font-size:14px">{{ item.value }}</span>
                                </td>
                            </tr>
                        </template>
                        <template v-slot:headers>
                            <tr>
                                <th v-for="column in yiZhuHeaders" :key="column.key">
                                    <div :style="{width:column.width}">{{column.title}}</div>
                                </th>
                            </tr>
                        </template>
                        <template v-slot:item="{ item }">
                            <tr :class="{'highlighted':selectedYiZhu === item  }" >
                                <td v-for="column in yiZhuHeaders" style="">
                                    <div :style="{width:column.width}">{{ item[column.key] }}</div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
              
            </div>
        </div>
        <!-- 住院 -->
        <div v-show="flag === '2'">
            <!-- 住院病人列表 -->
            <div style="display:inline-block;width:300px;vertical-align: top;">
                <div style="font-size:20px;height: 40px;">
                    <span style="font-weight:bold;vertical-align: super;">住院患者列表</span>
                    <v-btn size="small" style="margin-left:10px;vertical-align: super;" @click="getZhuYuanList()" prepend-icon="mdi-refresh" :loadding="loading">刷新</v-btn>
                </div>
                <div style="font-size:14px;"><span style="font-weight:bold;vertical-align: super;">(仅显示30日内入院病人,超出范围需单独查询)</span></div>
                <v-data-table :headers="zhuYuanHeaders" :items="zhuYuanList" 
                    :items-per-page="100"   :loading="loading" loading-text="正在加载中" fixed-header
                    no-data-text="暂无数据"  density="compact" hide-default-footer
                    style="font-size:12px;border:1px solid #e0e0e0;" :height="windowSize.height - 200 + 'px'" >
                    <template v-slot:headers>
                        <tr>
                            <th v-for="column in zhuYuanHeaders" :key="column.key">
                                <div :style="{width:column.width}">{{column.title}}</div>
                            </th>
                        </tr>
                    </template>
                    <template v-slot:item="{ item }">
                        <tr :class="{'highlighted':selectedZhuYuan === item }" @click="selectZhuYuan(item)">
                            <td v-for="column in zhuYuanHeaders"
                            :class="jiuzhenColor(item,column.key)">{{ item[column.key] }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </div>

            <div style="display:inline-block;margin-left:8px;" :style="{'width':windowSize.width - 320 + 'px'}">
                <!-- 病人信息 -->
                <div>
                    <v-data-table :headers="zhuYuanHeaders" :items="zhuYuanBingRenXinXi" 
                        :items-per-page="1"  sticky :loading="loading" loading-text="正在加载中"
                        no-data-text="暂无数据"  density="compact" hide-default-footer
                        style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;width: 100%;" >
                        <template v-slot:headers>
                            <tr>
                                <th><div>操作</div></th>
                                <th><div>触发场景</div></th>
                                <th v-for="column in zhuYuanHeaders" :key="column.key">
                                    <div :style="{width:column.width}">{{column.title}}</div>
                                </th>
                            </tr>
                        </template>
                        <template v-slot:item="{ item }">
                            <tr>
                                <td><v-btn @click="fenXiZhuYuan()" prepend-icon="mdi-poll" color="teal-lighten-3" size="small" style="margin-right:10px;" :loadding="loading">分析</v-btn></td>
                                <td>
                                    <v-select :items="zhuYuanTrigScenList" v-model="zhuYuanTrigScen" hide-details
                                    style="display:inline-block;vertical-align: middle;"></v-select>
                                </td>
                                <td v-for="column in zhuYuanHeaders" >{{ item[column.key] }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
                <!-- 住院诊断信息 -->
                <div style="margin-top:8px">
                    <v-data-table  :items="zhuYuanZhenDuanList" :headers="zhuYuanZhenDuanHeaders" 
                        :items-per-page="100"   :loading="loading" loading-text="正在加载中" 
                        no-data-text="暂无数据"  density="compact" hide-default-footer
                        style="font-size:12px;border:1px solid #e0e0e0;" >
                        <template v-slot:headers>
                            <tr style="background-color:#f5f5f5;">
                                <th v-for="column in zhuYuanZhenDuanHeaders" :key="column.key">
                                    <div :style="{width:column.width}">{{column.title}}</div>
                                </th>
                            </tr>
                        </template>
                        <template v-slot:item="{ item }">
                            <tr>
                                <td >{{ item['inout_dise_type'] === '1'?'入院诊断':'出院诊断' }}</td>
                                <td >{{ item['maindise_flag'] === '1'?'主':'次' }}</td>
                                <td>{{ item['dias_srt_no'] }}</td>
                                <td>{{ item['dise_name'] }}</td>
                                <td>{{ item['dise_codg'] }}</td>
                                <td>{{ item['dise_date'] }}</td>
                                <td>{{ item['ficdbm'] }}</td>
                                <td>{{ item['fzhenduan'] }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
                <!-- 住院医嘱列表 -->
                <div style="margin-top:8px">
                    <v-data-table   :items="zhuYuanChuFangList" :headers="zhuYuanChuFangHeaders" 
                        :items-per-page="50"   :loading="loading"  fixed-header loading-text="正在加载中"
                        no-data-text="暂无数据"  
                        style="font-size:12px;border:1px solid #e0e0e0;width:100%;height:500px" 
                        :header-props="{    style: { backgroundColor: '#f5f5f5' }  }">
                        <template v-slot:headers style="background-color:#f5f5f5;">
                            <tr style="background-color:#f5f5f5;">
                                <th v-for="column in zhuYuanChuFangHeaders" :key="column.key">
                                    <div :style="{width:column.width}">{{column.title}}</div>
                                </th>
                            </tr>
                        </template>
                        <template v-slot:item="{ item }">
                            <tr>
                                <td>{{ shouFeiLeiXing(item['chrg_type']) }}</td>
                                <td >{{ item['long_drord_flag'] === '1'?'长嘱':'临嘱' }}</td>
                                <td >{{ item['grpno'] }}</td>
                                <td>{{ item['hilist_code'] }}</td>
                                <td>{{ item['hosplist_name'] }}</td>
                                <td>{{ item['hosplist_code'] }}</td>
                                <td>{{ item['cnt'] }}</td>
                                <td>{{ item['sumamt'] }}</td>
                                <td>{{ item['drord_dr_name'] }}</td>
                                <td>{{ item['drord_bhvr']==='1'?'是':'否' }}</td>
                                <td>{{ item['rx_id'] }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
            </div>

        </div>
        <!-- 违规信息 -->
        <v-dialog v-model="showVolaXinXi" width="90%"  persistent>
            <div style="background-color: #fff;">
                <v-data-table :items="volaList" :headers="volaHeaders"  
                        :items-per-page="300"   :loading="loading" loading-text="正在加载中"
                        no-data-text="暂无数据"  hide-default-footer
                        style="font-size:12px;border:1px solid #e0e0e0;width:100%;height:600px;">
                    <template v-slot:headers>
                        <tr>
                            <th><div>处理方式</div></th>
                            <th><div style="width:200px;">处理原因</div></th>
                            <th v-for="column in volaHeaders" :key="column.key">
                                <div :style="{width:column.width}">{{column.title}}</div>
                            </th>
                        </tr>
                    </template>
                    <template v-slot:item="{ item }">
                        <tr >
                            <td>
                                <div style="width:120px;">
                                    <v-radio-group  v-model="item.dspo_way">
                                        <v-radio label="继续执行" value="1" ></v-radio>
                                        <v-radio label="返回修改" value="2"></v-radio>
                                    </v-radio-group>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <v-textarea v-model="item.dspo_way_rea" :auto-grow="true" :rows="3" hide-details 
                                    style="font-size:12px;width:100%;"   :disabled="item.dspo_way==='2'"
                                    :label="'选择继续执行时必填,还可以输入'+(500-item.dspo_way_rea.length)+'字'"></v-textarea>
                                </div>
                            </td>
                            <td v-for="column in volaHeaders" style="">
                                <div :style="{width:column.width}">{{ item[column.key] }}</div>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
                <div style="margin:10px 0;text-align:center;">
                    <v-btn @click="feedback()" color="primary" prepend-icon="mdi-chat">反馈</v-btn>
                    <!-- <v-btn @click="showVolaXinXi = false" prepend-icon="mdi-close" color="error" >关闭</v-btn> -->
                </div>
            </div>
        </v-dialog>
        <v-snackbar v-model="warningFlag"  color="warning" ><v-icon icon="mdi-alert"></v-icon> {{ warningmsg }}</v-snackbar>
        <v-snackbar v-model="successFlag"  color="success" ><v-icon icon="mdi-check"></v-icon> {{ successmsg }}</v-snackbar>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns';
import { useWindowSize } from "@vueuse/core";
import { mapState } from 'vuex';

export default {
    name: "ShiQianFenXi",
    components: {
		VueDatePicker,
	},
    computed: {
		...mapState(['userInfo']),
	},
    data() {
        return {
            windowSize: useWindowSize(),
            items: [
                { title: "首页", to:'/' ,replace:true,disabled:false},
                { title: "医保辅助功能",to:'/yibaofuzhu',replace:true,disabled:false },
                {title:'事前分析'}
            ],
            flag: "1",
            searchContent: "",
            searchTime:[],
            loading: false,
            showGuaHaoList:false,
            //挂号信息
            guahaoHeaders :[
				{ title:'门诊号',key:'fmzh',width:'80px' },
				{ title:'挂号时间',key:'fghsj',width:'80px' },
				{ title:'病人类别',key:'fbrlb',width:'80px' },
				{ title:'姓名',key:'fname',width:'80px' },
				{ title:'性别',key:'fsex',width:'80px' },
				{ title:'年龄',key:'fage',width:'80px' },
				{ title:'挂号科室',key:'fghks',width:'80px' },
				{ title:'挂号医生',key:'fghys',width:'80px' },
			],
			guahaoList:[],
			selectedBingRen:null,

            //个人信息
            personInfoHeaders:[
				{title:'姓名',key:'fname',width:'40px'},
				{title:'门诊号',key:'fmzh',width:'40px'},
				{title:'性别',key:'fsex',width:'40px'},
				{title:'年龄',key:'fage',width:'40px'},
				{title:'病人类别',key:'fbrlb',width:'60px'},
				{title:'身份证号',key:'fsfz',width:'40px'},
				{title:'今日挂号',key:'fjtgh',width:'40px'},
				{title:'联系电话',key:'fphone',width:'40px'},
				{title:'住址',key:'faddress',width:'40px'},
				{title:'会员卡号',key:'fhykh',width:'70px'},
				{title:'会员余额',key:'fyyye',width:'70px'},
				{title:'出生日期',key:'fbirthday',width:'40px'},
				{title:'备注',key:'fbz',width:'40px'},
				{title:'传染病',key:'fcrb',width:'40px'},
				{title:'症状体征',key:'fzz',width:'60px'},
				{title:'并发症',key:'fbfz',width:'40px'},
			],
			personInfoList: [],

            searchJiuZhen:"",
            jiuzhenList: [],
			selectedJiuZhen: null,
			jiuzhenHeaders: [
				{title:'门诊号',key:'fmzh',width:'40px'},
				{title:'姓名',key:'fname',width:'50px'},
                { title:'挂号时间',key:'fghsj',width:'80px' },
				{title:'性别',key:'fsex',width:'30px'},
				{title:'年龄',key:'fage',width:'50px'},
				{title:'医生',key:'fys',width:'50px'},
				{title:'就诊科室',key:'fjzks',width:'50px'},
				{title:'就诊状态',key:'fjzzt',width:'50px'},
				{title:'就诊次数',key:'fjzcs',width:'50px'},
				{title:'就诊ID',key:'fjzid',width:'50px'},
				{title:'病人ID',key:'fbrid',width:'50px'},
			],

            //医嘱信息
            yiZhuLiist:[],
			yiZhuHeaders:[
				{ title:'紧急',key:'fjjbz',width:'46px' },
				{ title:'状态',key:'FStatus',width:'70px'},
				{ title:'开始时间',key:'fkszxsj',width:'80px' },
				{ title:'医嘱内容',key:'fyz2',width:'180px' },
				{title:'执行科室',key:'fzxks',width:'80px'},
				{title:'总量',key:'fcount',width:'46px'},
				{title:'单位',key:'fdw',width:'46px'},
				{title:'皮试',key:'fps',width:'46px'},
				{title:'用法',key:'fyf',width:'80px'},
				{title:'医师嘱托',key:'fyszt',width:'100px'},
				{title:'检查部位',key:'fjcbw',width:'100px'},
				{title:'标本部位',key:'fbbbw',width:'100px'},
				{title:'医嘱备注',key:'fzy',width:'100px'},
				{title:'附加执行',key:'fgyks',width:'100px'},
				{title:'开嘱医师',key:'fkzys',width:'100px'},
				{title:'执行性质',key:'fzxxz',width:'100px'},
				{title:'用药目的',key:'fyymd',width:'100px'},
				{title:'计价特性',key:'fjjtx',width:'100px'},
				{title:'执行时间方案',key:'fzxsjfa',width:'100px'},
				{title:'开嘱科室',key:'fkzks',width:'100px'},
				{title:'开嘱时间',key:'fkzsj',width:'100px'},
				{title:'并发症',key:'fbfz',width:'100px'},
				{title:'医嘱单ID',key:'fyzdid',width:'100px'},
			],
            selectedYiZhu:null,
            yiZhuGroupBy:[
				{key:'groupID',order:'desc'},
			],

            warningFlag:false,
			warningmsg:'',

            // 违规信息
            volaList : [  ],
            volaHeaders : [
                { title:'违规内容',key:'vola_cont',width:'150px'},
                { title:'违规依据',key:'vola_evid',width:'300px'},
                { title:'严重程度',key:'sev_deg',width:'80px'},
                { title:'违规金额',key:'vola_amt',width:'80px'},
            ],

            successFlag:false,
			successmsg:'',

            showVolaXinXi:false,

            //住院人员列表
            zhuYuanList:[],
            zhuYuanHeaders:[
                {title:'住院号',key:'fzyh',width:'70px'},
                {title:'住院科室',key:'fzyks',width:'50px'},
                {title:'姓名',key:'fname',width:'50px'},
                {title:'性别',key:'fsex',width:'30px'},
                {title:'年龄',key:'fage',width:'35px'},
                {title:'入院日期',key:'fryrq',width:'80px'},
                {title:'出院日期',key:'fcyrq',width:'80px'},
                {title:'状态',key:'fstatus',width:'50px'},
                {title:'病区',key:'fzybq',width:'50px'},
                {title:'住院ID',key:'fzyid',width:'50px'},
            ],
            selectedZhuYuan:null,
            //住院人员查询列表
            zhuYuanChaXunList:[],
            showZhuYuanChaXunFlag:false,

            //住院病人信息
            zhuYuanBingRenXinXi:[],

            //住院诊断信息
            zhuYuanZhenDuanList:[],
            zhuYuanZhenDuanHeaders:[
                {title:'诊断类别',key:'inout_dise_type',width:'70px'},
                {title:'主次',key:'maindise_flag',width:'50px'},
                {title:'次序',key:'dias_srt_no',width:'50px'},
                {title:'医保版诊断',key:'dise_name',width:'100px'},
                {title:'医保版编码',key:'dise_codg',width:'100px'},
                {title:'诊断日期',key:'dise_date',width:'100px'},
                {title:'诊断',key:'fzhenduan',width:'100px'},
                {title:'icd编码',key:'ficdbm',width:'100px'},
            ],

            //住院处方信息
            zhuYuanChuFangList:[],
            zhuYuanChuFangHeaders:[
                {title:'收费类型',key:'chrg_type',width:'80px'},
                {title:'长临嘱',key:'long_drord_flag',width:'80px'},
                {title:'组号',key:'grpno',width:'80px'},
                {title:'医保目录代码',key:'hilist_code',width:'80px'},
                {title:'医院目录名称',key:'hosplist_name',width:'80px'},
                {title:'医院目录代码',key:'hosplist_code',width:'80px'},
                {title:'数量',key:'cnt',width:'50px'},
                {title:'总金额',key:'sumamt',width:'50px'},
                {title:'医生',key:'drord_dr_name',width:'50px'},
                {title:'出院带药',key:'drord_bhvr',width:'80px'},
                {title:'处方ID',key:'rx_id',width:'50px'},
            ],
            //触发场景 1门诊挂号;2门诊收费登记;3住院登记;4住院收费登记;5住院执行医嘱；6门诊结算;7门诊预结算;8住院结算;9住院预结算;
            zhuYuanTrigScen:"4" , 
            zhuYuanTrigScenList:[
                { title:"住院收费登记",value:"4"},
                { title:"住院执行医嘱",value:"5"},
                { title:"住院预结算",value:"9"},
                { title:"住院结算",value:"8"},
            ],

        }
    },
    async mounted() {
        this.$emit('setTitle','事前分析');
        this.$emit('setbreadcrumbs',this.items);
        await this.getJiuZhenList();
        await this.getZhuYuanList();

        // 设置默认时间
		let today = new Date();
		let year = today.getFullYear();
		let month = today.getMonth() + 1;
		let day = today.getDate();
		let lastWeek = new Date(today.getTime() - 31 * 24 * 60 * 60 * 1000);
		this.searchTime = [lastWeek.getFullYear() + '-' + (lastWeek.getMonth() + 1) + '-' + lastWeek.getDate(), year + '-' + month + '-' + day];

        this.searchJiuZhen = this.userInfo.name;

    },
    methods: {
        //搜索门诊病人
		async chaXunBingRen(){

            if(this.loading){
                return;
            }

            if(this.searchContent.length < 1){
                this.warningFlag = true;
                this.warningmsg = '请输入搜索内容';
                return;
            }
            this.loading = true;
            let begintime = format(new Date(this.searchTime[0]), 'yyyy-MM-dd 00:00:00');
            let endtime = format(new Date(this.searchTime[1]) , 'yyyy-MM-dd 23:59:59');
            const response = await this.$axios.post('/menzhen/chaXunBingRen',
                            {beginTime:begintime,endTime:endtime,content:this.searchContent,mzh:this.searchContent.padStart(10,'0')});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.guahaoList = result.result;
                    this.showGuaHaoList = true;
                }else{
                    this.guahaoList = [];
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
        },
        //选择门诊病人
		selectBingRen(item){
			this.selectedBingRen = item;
			this.showGuaHaoList = false;
			this.getBingRenXinXi(item.fghid);
			this.getYiZhuList(item.fghid,item.fryid);
			this.selectedYiZhu = null;
			
		},
        // 获取门诊病人列表
		async getJiuZhenList(){

			this.loading = true;
            const response = await this.$axios.post('/menzhen/getJiuZhenList');
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.jiuzhenList = result.result;
                } else{
					this.jiuzhenList = [];
                }
            }
            this.loading = false;
		},
		//就诊列表颜色
		jiuzhenColor(item,key){
			if(key == 'fmzh'){
				switch(item.fbrlb){
					case '自费': return 'zifeicolor';
					case '特种病门诊': return 'tebingcolor';
					case '定点' : return 'dingdiancolor';
				}
			
			}
		},
        // 选择门诊病人
		selectJiuZhen(item){

            if(this.loading){
                return;
            }
			if(this.selectedJiuZhen === item){
				return ;
			}
            console.log(item);
			this.selectedJiuZhen = item;
			this.getBingRenXinXi(item.fjzid);
			this.getYiZhuList(item.fjzid,item.fbrid);

		},
        // 获取门诊病人详细信息
		async getBingRenXinXi(fjzid){
			
			const response = await this.$axios.post('/menzhen/getBingRenXinXi',{jzid:fjzid});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
					this.personInfoList = result.result;
				}else{
					this.personInfoList = [];
                    this.warningFlag = true;
                    this.warningmsg = result.result;
				}
			}
		},
        // 获取医嘱列表
		async getYiZhuList(jzid,brid){

           
			this.loading = true;
            const response = await this.$axios.post('/menzhen/getYiZhuList',{jzid:jzid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
					let templist = result.result;
					//设置分组ID
					for(let i=0;i<templist.length;i++){
						templist[i]['groupID'] = '就诊ID：'+templist[i]['fjzid'] + ' 开始时间：'+templist[i]['fkszxsj'];
					}
					this.yiZhuLiist = templist;
                    this.getZhenDuan(jzid,brid);
                } else{
					this.yiZhuLiist = [];
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
		},
        // 获取诊断信息
        async getZhenDuan(jzid,brid){

            this.loading = true;
            const response = await this.$axios.post('/menzhen/getZhenDuan',{jzid:jzid,brid:brid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
					let templist = result.result;
                    for(let j=0;j<this.yiZhuLiist.length;j++){
                        this.yiZhuLiist[j]['fzhenduan'] = [];
                        for(let i=0;i<templist.length;i++){
                            if(this.yiZhuLiist[j]['fyzdid'] == templist[i]['fyzdid'] ){
                                this.yiZhuLiist[j]['fzhenduan'].push(templist[i]) 
                            }
                        }
                    }
                  
					//设置分组ID
					for(let i=0;i<this.yiZhuLiist.length;i++){
                        let zhenduan = "";
                        let zhenDuanList = this.yiZhuLiist[i]['fzhenduan'];
                        for(let j=0;j<zhenDuanList.length;j++){
                            if(zhenDuanList[j]['fzhuci'] == 1){
                                zhenduan += "(主)"+zhenDuanList[j]['fzhenduan']+",  ";
                            }else {
                                zhenduan += "(次)"+zhenDuanList[j]['fzhenduan']+",  ";
                            }
                        }
                        this.yiZhuLiist[i]['groupID'] = '开始时间：'+this.yiZhuLiist[i]['fkszxsj'] + '       诊断：'+zhenduan;
					}
                } else{

                }
            }
        },
        //分析门诊处方
        async fenXi(item){

            if(this.loading){
                return;
            }

            let zdList = item.items[0].raw.fzhenduan;
            if( zdList == undefined || zdList.length == 0){
                this.warningFlag = true;
                this.warningmsg = '无诊断医嘱不需分析';
                return;
            }
            let fsi_diagnose_dtos =[];
            let dscg_main_dise_codg = '';
            let dscg_main_dise_name = '';
            for( let i=0;i<zdList.length;i++){
                let zd ={
                    dise_id:zdList[i].fzhenduan,
                    inout_dise_type:1,
                    maindise_flag:zdList[i].fzhuci == 1?1:0,
                    dias_srt_no:zdList[i].fcixu,
                    dise_codg:zdList[i].fybbm,
                    dise_name:zdList[i].fybzd,
                    dise_date:item.items[0].raw.fkszxsj
                }
                if(zdList[i].fzhuci == 1){
                    dscg_main_dise_codg = zdList[i].fybbm;
                    dscg_main_dise_name = zdList[i].fybzd;
                }
                fsi_diagnose_dtos.push(zd);
            }

            let yzdidList = [];
            for(let i=0;i<item.items.length;i++){
                console.log();
                yzdidList.push(item.items[i].raw.fyzdid);
            }

            let YiZhuXinXi = {
                brid:item.items[0].raw.fbrid,
                jzid:item.items[0].raw.fjzid,
                yzdidList:yzdidList,
                fsi_diagnose_dtos:fsi_diagnose_dtos,
                adm_date:item.items[0].raw.fkszxsj,
                dscg_main_dise_codg:dscg_main_dise_codg,
                dscg_main_dise_name:dscg_main_dise_name,
                dr_codg : item.items[0].raw.fkzysbm,
                adm_dept_codg:item.items[0].raw.fkzksid,
                adm_dept_name:item.items[0].raw.fkzks,
                med_type:this.personInfoList[0].fbrlb == '特种病门诊'?'14':'11',
                insutype:'310',
                brname:this.personInfoList[0].fname,
                gend:this.personInfoList[0].fsex == '男'?'1':'2',
                brdy:this.personInfoList[0].fbirthday,
            };

          
            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/shiQianFenXi',YiZhuXinXi);
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.volaList = result.result.result;
                    if(this.volaList.length == 0){
                        this.successFlag = true;
                        this.successmsg = '恭喜，没有违规';
                    }else{
                        for(let i=0;i<this.volaList.length;i++){
                            this.volaList[i].dspo_way_rea = '';
                            this.volaList[i].dspo_way = '2';
                            switch(this.volaList[i].sev_deg){
                                case '1': this.volaList[i].sev_deg = '明确违规';break;
                                case '2': this.volaList[i].sev_deg = '高度可疑';break;
                                case '3': this.volaList[i].sev_deg = '轻度可疑';break;
                            }
                        }
                        this.showVolaXinXi = true;
                    }
                }else{
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
            
        },
   
        //反馈
        async feedback(){
            console.log(this.volaList);
            for(let i=0;i<this.volaList.length;i++){
                if(this.volaList[i].dspo_way == '1' && this.volaList[i].dspo_way_rea == ''){
                    this.warningFlag = true;
                    this.warningmsg = '第'+(i+1)+'条违规选择‘继续执行’，处理原因不能为空';
                    return;
                }
            }

            let warns = [];
            for(let i=0;i<this.volaList.length;i++){
                let warn = {
                    warn_rslt_id:this.volaList[i].jr_id,
                    dspo_way:this.volaList[i].dspo_way,
                    dspo_way_rea:this.volaList[i].dspo_way_rea
                };
                warns.push(warn);
            }

            let FanKuiXinXi = {
                warn_type:"1",
                warns:warns,
            };
            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/shiQianFenXiFanKui',FanKuiXinXi);
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.successFlag = true;
                    this.successmsg = '反馈成功';
                    this.showVolaXinXi = false;
                }else{
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
        },
        //搜索住院病人
        async chaXunZhuYuanBingRen(){
            if(this.loading){
                return;
            }

            if(this.searchContent.length < 1){
                this.warningFlag = true;
                this.warningmsg = '请输入搜索内容';
                return;
            }
            
            let begintime = format(new Date(this.searchTime[0]), 'yyyy-MM-dd 00:00:00');
            let endtime = format(new Date(this.searchTime[1]) , 'yyyy-MM-dd 23:59:59');
            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/chaXunZhuYuanBingRen',
                            {beginTime:begintime,endTime:endtime,content:this.searchContent});

            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zhuYuanChaXunList = result.result;
                    this.showZhuYuanChaXunFlag = true;
                }else{
                    this.zhuYuanChaXunList = [];
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
        },
        //获取住院人员列表
        async getZhuYuanList(){
           
			this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/getZhuYuanList');
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zhuYuanList = result.result;
                } else{
					this.zhuYuanList = [];
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
        },
        //选择住院人员
        selectZhuYuan(item){
            if(this.loading){
                return;
            }

            if(this.selectedZhuYuan === item){
                return ;
            }

            this.selectedZhuYuan = item;
            this.showZhuYuanChaXunFlag = false;
            this.getZhuYuanBingRenXinXi(item.fzyid,item.fbrid);
            this.getZhuYuanZhenDuan(item.fzyid,item.fbrid);
            this.getZhuYuanChuFangXinXi(item.fzyid,item.fbrid);

        },
        //获取住院病人信息
        async getZhuYuanBingRenXinXi(jzid,brid){
            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/getZhuYuanBingRenXinXi',{jzid:jzid,brid:brid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zhuYuanBingRenXinXi = result.result;
                    this.medfee_sumamt = result.result.medfee_sumamt;
                } else{
                    this.zhuYuanBingRenXinXi = [];
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
        },
        //获取住院诊断信息
        async getZhuYuanZhenDuan(jzid,brid){

            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/getZhuYuanZhenDuan',{jzid:jzid,brid:brid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zhuYuanZhenDuanList = result.result;
                } else{
                    this.zhuYuanZhenDuanList = [];
                }
            }
            this.loading = false;
        },
        //获取住院处方信息
        async getZhuYuanChuFangXinXi(jzid,brid){
            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/getZhuYuanChuFangXinXi',{jzid:jzid,brid:brid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zhuYuanChuFangList = result.result;
                } else{
                    this.zhuYuanChuFangList = [];
                }
            }
            this.loading = false;

        },
        // 收费类型
        shouFeiLeiXing(value){
            switch(value){
                case '01': return '床位费';
                case '02': return '诊察费';
                case '03': return '检查费';
                case '04': return '化验费';
                case '05': return '治疗费';
                case '06': return '手术费';
                case '07': return '护理费';
                case '08': return '卫材费';
                case '09': return '西药费';
                case '10': return '中药饮片费';
                case '11': return '中成药费';
                case '12': return '一般诊疗费';
                case '13': return '挂号费';
                case '14': return '其他费';
            }
        },
        //分析住院
        async fenXiZhuYuan(){
            if(this.loading){
                return;
            }

            if(this.zhuYuanBingRenXinXi.length === 0){
                this.warningFlag = true;
                this.warningmsg = '请选择住院病人';
                return;
            }

            let brxx = this.zhuYuanBingRenXinXi[0];
            let dscg_main_dise_codg = '';
            let dscg_main_dise_name = '';
            for(let i=0;i<this.zhuYuanZhenDuanList.length;i++){
                if(this.zhuYuanZhenDuanList[i].inout_dise_type == 2 && this.zhuYuanZhenDuanList[i].maindise_flag == 1){
                    dscg_main_dise_codg = this.zhuYuanZhenDuanList[i].dise_codg;
                    dscg_main_dise_name = this.zhuYuanZhenDuanList[i].dise_name;
                    break;
                }
            }

            if(dscg_main_dise_codg == '' || dscg_main_dise_name == ''){
                this.warningFlag = true;
                this.warningmsg = '需要填入出院主诊断才能分析';
                return;
            }


            let fsi_order_dtos = this.zhuYuanChuFangList;
            let fsi_diagnose_dtos = this.zhuYuanZhenDuanList;
            let fsi_encounter_dtos = [{
                fsi_diagnose_dtos:fsi_diagnose_dtos,
                fsi_order_dtos:fsi_order_dtos,
                fsi_operation_dtos:[],
                mdtrt_id:brxx.fzyid,
                adm_date:brxx.fryrq,
                dscg_date:brxx.fcyrq?  brxx.fcyrq : "9999-12-31 00:00:00",
                dscg_main_dise_codg:dscg_main_dise_codg,
                dscg_main_dise_name:dscg_main_dise_name,
                dr_codg:brxx.dr_codg,
                adm_dept_codg:brxx.adm_dept_codg,
                adm_dept_name:brxx.fzyks,
                dscg_dept_codg:brxx.adm_dept_codg,
                dscg_dept_name:brxx.fzyks,
                med_mdtrt_type:'2',
                med_type:'21'
            }];

            let patient_dtos = [{
                fsi_encounter_dtos:fsi_encounter_dtos,
                patn_id:brxx.fbrid,
                patn_name:brxx.fname,
                gend:brxx.fsex == '男'?'1':'2',
                brdy:brxx.brdy,
                curr_mdtrt_id:brxx.fzyid
            }];

            let shiQianJson = {
                patient_dtos:patient_dtos,
                trig_scen:this.zhuYuanTrigScen
            }
          
            this.loading = true;
            const response = await this.$axios.post('/shiqianfenxi/fenXiZhuYuan',shiQianJson);
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.volaList = result.result.result;
                    if(this.volaList.length == 0){
                        this.successFlag = true;
                        this.successmsg = '恭喜，没有违规';
                    }else{
                        for(let i=0;i<this.volaList.length;i++){
                            this.volaList[i].dspo_way_rea = '';
                            this.volaList[i].dspo_way = '2';
                            switch(this.volaList[i].sev_deg){
                                case '1': this.volaList[i].sev_deg = '明确违规';break;
                                case '2': this.volaList[i].sev_deg = '高度可疑';break;
                                case '3': this.volaList[i].sev_deg = '轻度可疑';break;
                            }
                        }
                        this.showVolaXinXi = true;
                    }
                }else{
                    this.warningFlag = true;
                    this.warningmsg = result.result;
                }
            }
            this.loading = false;
        },

    },
}
</script>

<style scoped>
.highlighted{background-color: #cceeff}
.zifeicolor{background-color:#c0c0c0}
.tebingcolor{background-color:rgba(255, 0, 0, 0.5)}
.dingdiancolor{background-color:rgba(255, 255, 0, 0.6)}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;
}
.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th{background-color: #f2f2f2 !important;}
:deep(.v-field) {  --v-field-padding-start:6px;  --v-field-padding-end:6px;}
:deep(.v-field.v-field--appended){--v-field-padding-end:0}
:deep(.v-field--appended){padding-inline-end:0;}
:deep(input){font-size:14px;}
:deep(.v-field__input){font-size:14px;}
.highlight_hover:hover{background-color: #cceeff}
</style>