<template>
	 

	<div style="width: 100vw;padding:0;height: 93vh;">
		<div>
			<v-btn @click="showJianYiGuaHao = !showJianYiGuaHao">挂号</v-btn>
			<v-btn >接诊</v-btn>
			<v-btn >新开医嘱</v-btn>
			<v-btn >修改医嘱</v-btn>
			<v-btn >删除医嘱</v-btn>
			<v-btn >发送医嘱</v-btn>
			<v-btn >回退医嘱</v-btn>
		</div>
		<div>
			<div style="width:20vw;display: inline-block;">
				<v-text-field label="姓名" density="compact" hide-details width="13vw" variant="underlined" style="display: inline-block;vertical-align: bottom;"></v-text-field>
				<v-btn  size="small" >搜索</v-btn>
			</div>
			<div style="display: inline-block;">
				<v-data-table :headers="personInfoHeaders" :items="personInfoList" 
					:items-per-page="1"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;width: 80vw;height: 100%;" >
				</v-data-table>
			</div>
		</div>
		
		<div style="position: relative;width: 100%;padding:0;height: 700px;">
			<VueDragResize :isActive="HZActive" :isDraggable="false" :parentLimitation="true" :sticks="['bm','mr','br']" 
				:z="HZZIndex" :minh="330" :minw="300"  :w="300" :h="330"
				@activated="HZKuangActive" @resizing="HZKuangResize">
				<div style="font-size:20px;height: 40px;">
					<span style="font-weight:bold;vertical-align: super;">候诊列表</span>
					<v-btn size="small" style="margin-left:10px;vertical-align: super;">刷新</v-btn>
					<div style="display: inline-block;margin-left: 8px;" >
						<v-select density="compact" variant="underlined" hide-details hide-no-data hide-spin-buttons v-model="keshi" :items="keshiList" label="科室" style="width:120px;margin-top:5px;"></v-select>
					</div>
				</div>
				<v-data-table :headers="houzhenHeaders" :items="houzhenList" 
					:items-per-page="100"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-width: 300px;" :height="houzhenHeight">
					<template v-slot:item="{ item }">
						<tr :class="{'highlighted':selectedHouZhen === item  }" @click="selectHouZhen(item)">
							<td v-for="column in houzhenHeaders">{{ item[column.key] }}</td>
						</tr>
					</template>
				</v-data-table>
			</VueDragResize>

			<VueDragResize :isActive="JZActive" :isDraggable="false" :parentLimitation="true" :sticks="['mr','tm','tr']" 
				:z="JZZIndex" :minh="350" :minw="300"  :w="300" :h="350" :y="340"  
				@activated="JZKuangActive" @resizing="JZKuangResize">
				<div style="font-size:20px;height: 40px;">
					<span style="font-weight:bold;vertical-align: super;">就诊列表</span>
					<v-btn size="small" style="margin-left:10px;vertical-align: super;">刷新</v-btn>
				</div>
				<v-data-table :headers="jiuzhenHeaders" :items="jiuzhenList" 
					:items-per-page="100"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-width: 300px;min-height: 260px;" :height="jiuzhenHeight">
					<template v-slot:item="{ item }">
						<tr :class="{'highlighted':selectedJiuZhen === item  }" @click="selectJiuZhen(item)">
							<td v-for="column in jiuzhenHeaders">{{ item[column.key] }}</td>
						</tr>
					</template>
				</v-data-table>
			</VueDragResize>

			<VueDragResize :isActive="MainActive" :isDraggable="false" :parentLimitation="true" :sticks="['ml']" 
				:z="MainZIndex" :minh="windowHeight-140" :minw="windowWidth-305"  :w="windowWidth-305" :h="windowHeight-140" :x="305" :y="0"
				@activated="MainKuangActive" >
				<div style="font-size:20px;height: 40px;">
					<v-chip-group v-model="selectedTag" selected-class="text-primary">
						<v-chip value="0">医嘱</v-chip>
						<v-chip value="1">开发中</v-chip>
						<v-chip value="2">开发中</v-chip>
					</v-chip-group>
				</div>
				<v-data-table v-show="selectedTag == '0'" :headers="yiZhuHeaders" :items="yiZhuLiist" 
					:items-per-page="100"  sticky :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  density="compact" hide-default-footer
					style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-height: 260px;width:100%" >
					<template v-slot:item="{ item }">
						<tr :class="{'highlighted':selectedYiZhu === item  }" @click="selectYiZhu(item)">
							<td v-for="column in yiZhuHeaders" style="white-space: normal;">{{ item[column.key] }}</td>
						</tr>
					</template>
				</v-data-table>
			</VueDragResize>



		</div>
		
		<JianYiGuaHao :show="showJianYiGuaHao">
			
		</JianYiGuaHao>
	</div>
		
				
		
</template>
  
<script>
import VueDragResize from 'vue-drag-resize/src'
import JianYiGuaHao from './JianYiGuaHao.vue';
export default {
	name: 'MenZhen',
	components: {
		VueDragResize,
		JianYiGuaHao,
	},
	data() {
		return {
			items: [
				{ title: "首页", to:'/' ,replace:true,disabled:false},
				{ title: "门诊医生工作站" }
			],

			houzhenHeaders: [
				{title:'门诊号',key:'fmzh'},
				{title:'姓名',key:'fname'},
				{title:'性别',key:'fsex'},
				{title:'年龄',key:'fage'},
				{title:'就诊状态',key:'fjzzt'},
				{title:'医生',key:'fys'},
				{title:'登记时间',key:'fdjsj'},
				{title:'就诊科室',key:'fjzks'},
				{title:'挂号类别',key:'fghlb'},
				{title:'预约时间',key:'fyysj'},
				{title:'预约标志',key:'fyybz'},
				{title:'就诊次数',key:'fjzcs'},
				{title:'就诊ID',key:'fjzid'},
				{title:'病人ID',key:'fbrid'},
				{title:'执行状态',key:'fzxzt'},
			],
			houzhenList: [],
			loading: false,
			selectedHouZhen: null,
			keshiList: [
				{ title: '内科', value: '内科' },
				{ title: '外科', value: '外科' },
			],
			keshi: '内科',

			personInfoHeaders:[
				{title:'姓名',key:'name'},
				{title:'性别',key:'sex'},
				{title:'年龄',key:'age'},
				{title:'身份证号',key:'idCard'},
				{title:'联系电话',key:'tel'},
			],
			personInfoList: [],

			jiuzhenList: [],
			selectedJiuZhen: null,

			jiuzhenHeaders: [
				{title:'门诊号',key:'fmzh'},
				{title:'姓名',key:'fname'},
				{title:'性别',key:'fsex'},
				{title:'年龄',key:'fage'},
				{title:'医生',key:'fys'},
				{title:'就诊科室',key:'fjzks'},
				{title:'就诊状态',key:'fjzzt'},
				{title:'就诊次数',key:'fjzcs'},
				{title:'就诊ID',key:'fjzid'},
				{title:'病人ID',key:'fbrid'},
			],
			windowWidth:window.innerWidth,
			windowHeight:window.innerHeight,
			houzhenHeight:290,
			jiuzhenHeight:310,
			JZZIndex:1,
			HZZIndex:1,
			HZActive:false,
			JZActive:false,
			MainActive:false,
			MainZIndex:1,

			showJianYiGuaHao:false,

			selectedTag:'0',

			yiZhuLiist:[],

			yiZhuHeaders:[
				{ title:'紧急',key:'fjjbz' },
				{ title:'状态',key:'FStatus'},
				{ title:'开始时间',key:'fkszxsj' },
				{ title:'医嘱内容',key:'fyz2' },
				{title:'执行科室',key:'fzxks'},
				{title:'查看报告',key:'fckbg'},
				{title:'皮试',key:'fps'},
				{title:'用法',key:'fyf'},
				{title:'总量',key:'fcount'},
				{title:'单位',key:'fdw'},
				{title:'医师嘱托',key:'fyszt'},
				{title:'检查部位',key:'fjcbw'},
				{title:'标本部位',key:'fbbbw'},
				{title:'医嘱备注',key:'fzy'},
				{title:'附加执行',key:'fgyks'},
				{title:'开嘱医师',key:'fkzys'},
				{title:'执行性质',key:'fzxxz'},

				
			],

			selectedYiZhu:null,



		};
	},
	mounted() {
		this.$emit('setTitle','门诊医生工作站');
		this.$emit('setbreadcrumbs',this.items);
		this.getHouZhenList();
		this.getJiuZhenList();
		console.log(window.innerWidth)
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
			this.selectedJiuZhen = item;
			console.log(item);
			this.getYiZhuList();

		},
		JZKuangActive(){
			this.JZZIndex = 99;
			this.HZZIndex = 1;
			this.JZActive = true;
			this.HZActive = false;
			this.MainActive = false;
			this.MainZIndex = 1;
		},
		HZKuangActive(){
			this.JZZIndex = 1;
			this.HZZIndex = 99;
			this.JZActive = false;
			this.HZActive = true;
			this.MainActive = false;
			this.MainZIndex = 1;
		},
		JZKuangResize(newRect){
			this.jiuzhenHeight = newRect.height - 40
		},
		HZKuangResize(newRect){
			this.houzhenHeight = newRect.height - 40
		},
		MainKuangActive(){
			this.JZZIndex = 1;
			this.HZZIndex = 1;
			this.MainZIndex = 99;
			this.JZActive = false;
			this.HZActive = false;
			this.MainActive = true;
		},

		// 获取医嘱列表
		async getYiZhuList(){
			this.loading = true;
            const response = await this.$axios.post('/menzhen/getYiZhuList',{jzid:this.selectedJiuZhen.fjzid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
					this.yiZhuLiist = result.result;
                } else{
					this.yiZhuLiist = [];
                }
            }
            this.loading = false;
		},
		selectYiZhu(item){
			this.selectedYiZhu = item;
			console.log(item);
		},
		
	}
};
</script>
  

<style scoped>
.highlighted{background-color: #cceeff}
</style>