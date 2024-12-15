<template>
	<v-container style="width:100%;margin:0;max-width: 100%;">
		<v-row>
            <v-col><v-btn  @click="refresh()" :loading="loading"  size="x-large">刷新</v-btn></v-col>
            <v-col><v-btn  @click="goToAdd()" :loading="loading"  size="x-large">选中的接口加入权限库</v-btn></v-col>
        </v-row>
		<v-row>
			<v-col>
				<v-data-table :headers="allAPIheaders" :items="allAPIList"  
					:items-per-page="200"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 450px;" >
					<template v-slot:item="{ item }">
					<tr :class="{'highlighted':selectedItem === item }" 
						@click="selectRow(item)" style="white-space: nowrap;">
						<td>{{ item.url }}</td>
						<td>{{ addedPermission(item.url) }}</td>
					</tr>
					</template>
				</v-data-table>
			</v-col>
			<v-col>
				<v-data-table :headers="permissionHeaders" :items="permissionList"  
					:items-per-page="200"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 450px;" >
				</v-data-table>
			</v-col>
		</v-row>

		<v-dialog v-model="dialog" width="400">
            <v-card max-width="400" title="添加权限">
                <v-text-field label="API路径" v-model="apiPath" required hide-details readonly ></v-text-field>
                <v-text-field label="权限名称" v-model="perName" required hide-details clearable ></v-text-field>
                <v-alert density="compact" title="失败" type="error"  v-show="errFlag">{{ errmsg }}</v-alert>
                <template v-slot:actions>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="确定" @click="addPermission()" color="success" prepend-icon="mdi-check-circle"></v-btn>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="取消" @click="cancelAdd()" color="red"   prepend-icon="mdi-cancel"></v-btn>    
                </template>
            </v-card>
        </v-dialog>
		<v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
		<v-snackbar v-model="successFlag"  color="success" >操作成功!!!</v-snackbar>
	</v-container>
</template>


<script>
import { ref } from 'vue';


export default {
	name: 'PermissionManager',
	data() {
    return {
			items: [
				{ title: "首页", to:'/' ,replace:true,disabled:false},
				{ title: "管理员功能", to:'/HISManager' ,replace:true,disabled:false},
				{ title: "权限管理"},
			],
			permissionHeaders:[
				{ title: '权限名称',key:'pername' },
				{ title: 'API路径' ,key:'perpath' },
			],
			permissionList: [],
			loading: false,
			selectedItem: null,
			allAPIheaders: [
				{ title: 'API路径' },
				{ title: '状态' },
			],
			allAPIList: [],
			dialog: false,
			apiPath: '',
			perName: '',
			errFlag: false,
			errmsg: '',
			warningFlag: false,
			warningmsg: '',
			successFlag: false,
		}
	},
	mounted() {
		this.$emit('setbreadcrumbs',this.items);
        this.$emit('setTitle','权限管理');
		this.getPermissionList();
		this.getAllAPIList();

	},
  	methods: {
		// 获取所有api列表
		async getAllAPIList() {
            this.loading = true;
            const response = await this.$axios.get('/permissionManger/getAllAPI');
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.allAPIList = result.result;
                }else{
                    this.allAPIList = [];
                    console.log(result);
                }
            }
            this.loading = false;
        },


		// 获取权限列表
		async getPermissionList() {
            this.loading = true;
            const response = await this.$axios.get('/permissionManger/getPermissionList');
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.permissionList = result.result;
                } else{
                    this.permissionList = [];
                    console.log(result);
                }
            }
            this.loading = false;
        },
		// 选择行
		selectRow(item) {
			console.log(item);
			this.selectedItem = item;
		},
		// 新增权限
		async addPermission() {
			console.log(this.selectedItem);
			if(this.selectedItem == null){
				this.errFlag = true;
				this.errmsg = '请先选择一个接口';
				return;
			}
			if(this.perName == ''){
				this.errFlag = true;
				this.errmsg = '权限名称不能为空';
				return;
			}

			this.loading = true;
            const response = await this.$axios.post('/permissionManger/addPermission',{url:this.selectedItem.url,name:this.perName});
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.successFlag = true;
					this.cancelAdd();
                    this.getPermissionList();
                } else{
					this.errFlag = true;
					this.errmsg = result.result;
                }
            }
            this.loading = false;


		},
		goToAdd(){

			if(this.selectedItem == null){
				this.warningFlag = true;
				this.warningmsg = '请先选择一个接口';
				return;
			}

			if (this.addedPermission(this.selectedItem.url) == '已添加'){
				this.warningFlag = true;
				this.warningmsg = '该接口已添加权限';
				return;
			}

			this.apiPath = this.selectedItem.url;
			this.dialog = true;
		},
		cancelAdd(){
			this.apiPath = '';
			this.perName = '';
			this.dialog = false;
		},
		// 刷新
		refresh() {
			this.getPermissionList();
			this.getAllAPIList();
		},
		// 判断是否已经添加权限
		addedPermission(url){
			for(let i=0;i<this.permissionList.length;i++){
				if(this.permissionList[i].perpath == url){
					return '已添加';
				}
			}
			return '';
		},
  	}
}

</script>


<style scoped>
.highlighted{background-color: #cceeff}
</style>