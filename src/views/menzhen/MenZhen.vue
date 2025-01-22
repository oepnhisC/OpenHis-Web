<template>
	 

	<div style="width: 100vw;padding:0;height: 93vh;">
		<div>
			<v-btn @click="showJianYiGuaHao = !showJianYiGuaHao">挂号</v-btn>
			<v-btn >更多功能正在开发中...</v-btn>
		</div>
		<div>
			<!-- 搜索病人 -->
			<div style="width:20vw;display: inline-block;vertical-align: bottom;padding-bottom:3px;">
				<VueDatePicker v-model="guahaoTime" format="yyyy-MM-dd"  locale="zh-cn" day-picker range
                        :enable-time-picker="false" text-input select-text="确定" cancel-text="取消" class="ghcell" 
						style="width:250px;--dp-input-padding:3px;margin-bottom:5px" ></VueDatePicker>
				<v-text-field v-model="searchContent" @keydown="handleKeydown"
					label="姓名、门诊号、卡号、拼音五笔首写字母" density="compact" hide-details width="15vw"
				 	variant="underlined" style="display: inline-block;vertical-align: bottom;margin-left:5px;"></v-text-field>
				<v-btn @click="chaXunBingRen()" size="small" style="margin-left:10px;">搜索</v-btn>
				<div style="position: fixed;width:800px;z-index:999;">
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
							<tr :class="{'highlighted':selectedBingRen === item  }" @click="selectBingRen(item)">
								<td v-for="column in guahaoHeaders">{{ item[column.key] }}</td>
							</tr>
						</template>
					</v-data-table-virtual>
				</div>
				<div v-show="showGuaHaoList" @click="showGuaHaoList = false" style="position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);"></div>
			</div>
			<!-- 病人信息 -->
			<div style="display: inline-block;">
				<v-data-table :headers="personInfoHeaders" :items="personInfoList" 
					:items-per-page="1"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;width: 80vw;height: 100%;" >
					<template v-slot:headers>
						<tr>
							<th v-for="column in personInfoHeaders" :key="column.key">
								<div :style="{width:column.width}">{{column.title}}</div>
							</th>
						</tr>
					</template>
					<template v-slot:item="{ item }">
						<tr><td v-for="column in personInfoHeaders">{{ item[column.key] }}</td></tr>
					</template>
				</v-data-table>
			</div>
		</div>
		
		
		<div style="position: relative;width: 100%;padding:0;height: 700px;">
			<!-- 候诊列表 -->
			<VueDragResize :isActive="HZActive" :isDraggable="false" :parentLimitation="true" :sticks="['bm','mr','br']" 
				:z="HZZIndex" :minh="330" :minw="300"  :w="300" :h="330"
				@activated="HZKuangActive" @resizing="HZKuangResize">
				<div style="font-size:20px;height: 40px;">
					<span style="font-weight:bold;vertical-align: super;">候诊列表</span>
					<v-btn size="small" style="margin-left:10px;vertical-align: super;" @click="getHouZhenList()">刷新</v-btn>
					<div style="display: inline-block;margin-left: 8px;" >
						<v-select density="compact" variant="underlined" hide-details hide-no-data hide-spin-buttons 
						v-model="keshi" :items="keshiList" label="科室" @update:modelValue="selectKeshi"
						style="width:120px;margin-top:5px;"></v-select>
					</div>
				</div>
				<v-data-table :headers="houzhenHeaders" :items="houzhenList" :filter-keys="['fjzks','fys']" :search="searchHouZhen"
					:items-per-page="100"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer 
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-width: 300px;" :height="houzhenHeight">
					<template v-slot:headers>
						<tr>
							<th v-for="column in houzhenHeaders" :key="column.key">
								<div :style="{width:column.width}">{{column.title}}</div>
							</th>
						</tr>
					</template>
					<template v-slot:item="{ item }">
						<tr :class="{'highlighted':selectedHouZhen === item  }" @click="selectHouZhen(item)">
							<td v-for="column in houzhenHeaders">{{ item[column.key] }}</td>
						</tr>
					</template>
				</v-data-table>
			</VueDragResize>

			<!-- 就诊列表 -->
			<VueDragResize :isActive="JZActive" :isDraggable="false" :parentLimitation="true" :sticks="['mr','tm','tr']" 
				:z="JZZIndex" :minh="300" :minw="300"  :w="300" :h="300" :y="340"  
				@activated="JZKuangActive" @resizing="JZKuangResize">
				<div style="font-size:20px;height: 40px;">
					<span style="font-weight:bold;vertical-align: super;">就诊列表</span>
					<v-btn size="small" style="margin-left:10px;vertical-align: super;" @click="getJiuZhenList()">刷新</v-btn>
				</div>
				<v-data-table :headers="jiuzhenHeaders" :items="jiuzhenList" :filter-keys="['fjzks','fys']" :search="searchJiuZhen"
					:items-per-page="100"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-width: 300px;" :height="jiuzhenHeight">
					<template v-slot:headers>
						<tr>
							<th v-for="column in jiuzhenHeaders" :key="column.key">
								<div :style="{width:column.width}">{{column.title}}</div>
							</th>
						</tr>
					</template>
					<template v-slot:item="{ item }">
						<tr :class="{'highlighted':selectedJiuZhen === item  }" @click="selectJiuZhen(item)">
							<td v-for="column in jiuzhenHeaders">{{ item[column.key] }}</td>
						</tr>
					</template>
				</v-data-table>
			</VueDragResize>

			
			<VueDragResize :isActive="MainActive" :isDraggable="false" :parentLimitation="true" :sticks="['ml']" 
				:z="MainZIndex" :minh="windowHeight-150" :minw="windowWidth-305"  :w="windowWidth-305" :h="windowHeight-150" :x="305" :y="0"
				@activated="MainKuangActive" @resizing="MainKuangResize">
				<div style="font-size:20px;height: 40px;background-color: #fff;">
					<v-chip-group v-model="selectedTag" selected-class="text-primary">
						<v-chip value="0">医嘱</v-chip>
						<v-chip value="1">更多功能正在开发中...</v-chip>
					</v-chip-group>
				</div>
				<!-- 医嘱列表 -->
				<v-data-table v-show="selectedTag == '0'" :headers="yiZhuHeaders"  :items="yiZhuLiist" :group-by="yiZhuGroupBy"
					:items-per-page="100"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  hide-default-footer  :show-expand="true"
					style="font-size:12px;border:1px solid #e0e0e0;width:100%;" :height="MainHeight">
					<template  #group-header="{ item, columns, toggleGroup, isGroupOpen }">
						<tr  :ref="(el) => {if (!isGroupOpen(item)) toggleGroup(item);}">
							<td colspan="100%"><span>{{ item.value }}</span></td>
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
						<tr :class="{'highlighted':selectedYiZhu === item  }" @click="selectYiZhu(item)">
							<td v-for="column in yiZhuHeaders" style="">
								<div :style="{width:column.width}">{{ item[column.key] }}</div>
							</td>
						</tr>
					</template>
				</v-data-table>
			</VueDragResize>



		</div>
		<v-snackbar v-model="warningFlag"  color="warning" ><v-icon icon="mdi-alert"></v-icon> {{ warningmsg }}</v-snackbar>
		<JianYiGuaHao :show="showJianYiGuaHao"></JianYiGuaHao>
	</div>
		
				
		
</template>
  
<script>
import VueDragResize from 'vue-drag-resize/src'
import JianYiGuaHao from './JianYiGuaHao.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns';
import { mapState } from 'vuex';

export default {
	name: 'MenZhen',
	components: {
		VueDragResize,
		JianYiGuaHao,
		VueDatePicker,
	},

	data() {
		return {
			items: [
				{ title: "首页", to:'/' ,replace:true,disabled:false},
				{ title: "门诊医生工作站" }
			],
			guahaoTime:[],

			houzhenHeaders: [
				{title:'门诊号',key:'fmzh',width:'80px'},
				{title:'姓名',key:'fname',width:'80px'},
				{title:'性别',key:'fsex',width:'80px'},
				{title:'年龄',key:'fage',width:'80px'},
				{title:'就诊状态',key:'fjzzt',width:'80px'},
				{title:'医生',key:'fys',width:'80px'},
				{title:'登记时间',key:'fdjsj',width:'80px'},
				{title:'就诊科室',key:'fjzks',width:'80px'},
				{title:'挂号类别',key:'fghlb',width:'80px'},
				{title:'预约时间',key:'fyysj',width:'80px'},
				{title:'预约标志',key:'fyybz',width:'80px'},
				{title:'就诊次数',key:'fjzcs',width:'80px'},
				{title:'就诊ID',key:'fjzid',width:'80px'},
				{title:'病人ID',key:'fbrid',width:'80px'},
				{title:'执行状态',key:'fzxzt',width:'80px'},
			],
			searchHouZhen:'',
			houzhenList: [],
			loading: false,
			selectedHouZhen: null,
			keshiList: [ ],
			keshi: -1,

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

			jiuzhenList: [],
			selectedJiuZhen: null,

			jiuzhenHeaders: [
				{title:'门诊号',key:'fmzh',width:'40px'},
				{title:'姓名',key:'fname',width:'50px'},
				{title:'性别',key:'fsex',width:'30px'},
				{title:'年龄',key:'fage',width:'50px'},
				{title:'医生',key:'fys',width:'50px'},
				{title:'就诊科室',key:'fjzks',width:'50px'},
				{title:'就诊状态',key:'fjzzt',width:'50px'},
				{title:'就诊次数',key:'fjzcs',width:'50px'},
				{title:'就诊ID',key:'fjzid',width:'50px'},
				{title:'病人ID',key:'fbrid',width:'50px'},
			],
			searchJiuZhen:'',
			windowWidth:window.innerWidth,
			windowHeight:window.innerHeight,
			houzhenHeight:290,
			jiuzhenHeight:275,
			JZZIndex:1,
			HZZIndex:1,
			HZActive:false,
			JZActive:false,
			MainActive:false,
			MainZIndex:1,
			MainHeight:615,

			showJianYiGuaHao:false,

			selectedTag:'0',

			yiZhuLiist:[],

			yiZhuHeaders:[
				{ title:'紧急',key:'fjjbz',width:'46px' },
				{ title:'状态',key:'FStatus',width:'70px'},
				{ title:'开始时间',key:'fkszxsj',width:'80px' },
				{ title:'医嘱内容',key:'fyz2',width:'160px' },
				{title:'执行科室',key:'fzxks',width:'80px'},
				{title:'总量',key:'fcount',width:'46px'},
				{title:'单位',key:'fdw',width:'46px'},
				{title:'查看报告',key:'fckbg',width:'80px'},
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
				
			],

			selectedYiZhu:null,

			yiZhuGroupBy:[
				{key:'groupID',order:'asc'},
			],

			searchContent:'',

			warningFlag:false,
			warningmsg:'',

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
			showGuaHaoList:false,

		};
	},
	computed: {
		...mapState(['keshiID']),
	},
	mounted() {
		console.log('科室ID',this.keshiID)
		this.$emit('setTitle','门诊医生工作站');
		this.$emit('setbreadcrumbs',this.items);
		this.getHouZhenList();
		this.getJiuZhenList();
		this.getKeshi();

		// 设置默认时间
		let today = new Date();
		let year = today.getFullYear();
		let month = today.getMonth() + 1;
		let day = today.getDate();
		let lastWeek = new Date(today.getTime() - 31 * 24 * 60 * 60 * 1000);
		this.guahaoTime = [lastWeek.getFullYear() + '-' + (lastWeek.getMonth() + 1) + '-' + lastWeek.getDate(), year + '-' + month + '-' + day];
	},
	
	methods: {
		// 获取候诊列表
		async getHouZhenList(){
			this.loading = true;
            const response = await this.$axios.post('/menzhen/getHouZhenList');
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.houzhenList = result.result;
                } else{
					this.houzhenList = [];
                }
            }
            this.loading = false;
		},
		selectHouZhen(item){
			this.selectedHouZhen = item;
			console.log(item);
		},
		// 获取就诊列表
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

		selectJiuZhen(item){
			if(this.selectedJiuZhen === item){
				return ;
			}
			this.selectedJiuZhen = item;
			this.getBingRenXinXi(item.fjzid);
			this.getYiZhuList(item.fjzid);


		},
		JZKuangActive(){
			this.JZZIndex = 50;
			this.HZZIndex = 1;
			this.JZActive = true;
			this.HZActive = false;
			this.MainActive = false;
			this.MainZIndex = 1;
		},
		HZKuangActive(){
			this.JZZIndex = 1;
			this.HZZIndex = 50;
			this.JZActive = false;
			this.HZActive = true;
			this.MainActive = false;
			this.MainZIndex = 1;
		},
		JZKuangResize(newRect){
			this.jiuzhenHeight = newRect.height - 25
		},
		HZKuangResize(newRect){
			this.houzhenHeight = newRect.height - 40
		},
		MainKuangActive(){
			this.JZZIndex = 1;
			this.HZZIndex = 1;
			this.MainZIndex = 50;
			this.JZActive = false;
			this.HZActive = false;
			this.MainActive = true;
		},
		MainKuangResize(newRect){
			this.MainHeight = newRect.height - 80
		},

		// 获取医嘱列表
		async getYiZhuList(jzid){
			this.loading = true;
            const response = await this.$axios.post('/menzhen/getYiZhuList',{jzid:jzid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
					let templist = result.result;
					for(let i=0;i<templist.length;i++){
						templist[i]['groupID'] = '就诊ID：'+templist[i]['fjzid'] + ' 开始时间：'+templist[i]['fkszxsj'];
					}
					this.yiZhuLiist = templist;
                } else{
					this.yiZhuLiist = [];
                }
            }
            this.loading = false;
		},
		selectYiZhu(item){
			if(this.selectedYiZhu === item){
				return;
			}
			this.selectedYiZhu = item;
			console.log(item);
		},

		//搜索病人
		async chaXunBingRen(){

			if(this.searchContent.length < 1){
				this.warningFlag = true;
				this.warningmsg = '请输入搜索内容';
				return;
			}
			this.loading = true;
			let begintime = format(new Date(this.guahaoTime[0]), 'yyyy-MM-dd 00:00:00');
			let endtime = format(new Date(this.guahaoTime[1]) , 'yyyy-MM-dd 23:59:59');
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
		//选择病人
		selectBingRen(item){
			console.log(item);
			this.selectedBingRen = item;
			this.showGuaHaoList = false;
			this.getBingRenXinXi(item.fghid);
			this.getYiZhuList(item.fghid);
			this.searchContent = "";
			this.selectedHouZhen = null;
			this.selectedJiuZhen = null;
			this.selectedYiZhu = null;
			
		},
		// 按下回车搜索
		handleKeydown(event){
			if(event.keyCode == 13){
				this.chaXunBingRen();
			}
		},
		// 获取病人详细信息
		async getBingRenXinXi(fjzid){
			
			this.loading = true;
			const response = await this.$axios.post('/menzhen/getBingRenXinXi',{jzid:fjzid});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
					this.personInfoList = result.result;
				}else{
					this.personInfoList = [];
				}
			}
			this.loading = false;
		},

		// 获取员工所属科室
		async getKeshi(item){
			this.loading = true;
			const response = await this.$axios.get('/menzhen/getKeShi');
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
					let haveKeshi = false;
					let templist = result.result;
					for(let i=0;i<templist.length;i++){
						this.keshiList.push({title:templist[i]['fks'],value:templist[i]['fksid']});
						if(templist[i]['fksid'] == this.keshiID){
							console.log(templist[i]['fksid']);
							this.keshi = templist[i]['fksid'];
							haveKeshi = true;
						}
					}
					if(!haveKeshi){
						this.keshi = templist[0]['fksid'];
					}
				}else{
					this.keshiList= [];
				}
			}
			this.loading = false;
		},
		// 选择科室
		selectKeshi(value){
			for(let i=0;i<this.keshiList.length;i++){
				if(this.keshiList[i]['value'] == value){
					this.searchJiuZhen = this.keshiList[i]['title'];
					this.searchHouZhen = this.keshiList[i]['title'];
				}
			}
		}

	}
};
</script>
  

<style scoped>
.highlighted{background-color: #cceeff}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;
}

</style>