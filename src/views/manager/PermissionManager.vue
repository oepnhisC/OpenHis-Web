<template>
	<v-container style="width:100%;margin:0;max-width: 100%;">
		<v-row>
            <v-col><v-btn  @click="refresh()" :loading="loading"  size="x-large">刷新</v-btn></v-col>
            <v-col><v-btn  @click="goToAddPermission()" :loading="loading"  size="x-large">选中的接口加入权限库</v-btn></v-col>
        </v-row>
		<v-row>
			<v-col>
				<v-data-table :headers="allAPIheaders" :items="allAPIList"  
					:items-per-page="200"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 350px;" >
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
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 350px;" >
					<template v-slot:item="{ item }">
					<tr :class="{'highlighted':selectedPermission === item }" 
						@click="selectPermission(item)" style="white-space: nowrap;">
						<td>{{ item.pername }}</td>
						<td>{{ item.perpath }}</td>
					</tr>
					</template>
				</v-data-table>
			</v-col>
		</v-row>

		<v-row>
			<v-col>
				<v-data-table :headers="roleHeaders" :items="roleList"  
					:items-per-page="200"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 350px;" >
					<template v-slot:item="{ item }">
					<tr :class="{'highlighted':selectedRole === item }" 
						@click="selectRole(item)" style="white-space: nowrap;">
						<td>{{ item.rolename }}</td>
					</tr>
					</template>
				</v-data-table>
			</v-col>
			<v-col>
				<v-row>
					<v-btn :loading="loading"  size="large" @click="goToAddRole()">添加角色</v-btn>
					<v-btn :loading="loading"  size="large" @click="addPermissionToRole()" style="margin-left:10px">为角色添加权限</v-btn>
				</v-row>
				<v-row>
					<v-data-table :headers="rolePerHeaders" :items="rolePerList"  
						:items-per-page="200"   :loading="loading" loading-text="正在加载中"
						no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 280px;margin-top:20px" >
						<template v-slot:item="{ item }">
						<tr :class="{'highlighted':selectedRolePer === item }" 
							@click="selectRolePer(item)" style="white-space: nowrap;">
							<td>{{ item.pername }}</td>
							<td>{{ item.perpath }}</td>
						</tr>
						</template>
					</v-data-table>
				</v-row>
			</v-col>
		</v-row>

		<v-dialog v-model="dialog" width="400">
            <v-card max-width="400" title="添加权限">
                <v-text-field label="API路径" v-model="apiPath" required hide-details readonly ></v-text-field>
                <v-text-field label="权限名称" v-model="perName" required hide-details clearable ></v-text-field>
                <v-alert density="compact" title="失败" type="error"  v-show="errFlag">{{ errmsg }}</v-alert>
                <template v-slot:actions>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="确定" @click="addPermission()" color="success" prepend-icon="mdi-check-circle"></v-btn>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="取消" @click="cancelAddPermission()" color="red"   prepend-icon="mdi-cancel"></v-btn>    
                </template>
            </v-card>
        </v-dialog>

		<v-dialog v-model="roleDialog" width="400">
            <v-card max-width="400" title="添加角色">
                <v-text-field label="角色名称" v-model="roleName" required hide-details  ></v-text-field>
                <v-alert density="compact" title="失败" type="error"  v-show="errFlag">{{ errmsg }}</v-alert>
                <template v-slot:actions>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="确定" @click="addRole()" color="success" prepend-icon="mdi-check-circle"></v-btn>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="取消" @click="cancelAddRole()" color="red"   prepend-icon="mdi-cancel"></v-btn>    
                </template>
            </v-card>
        </v-dialog>

		<v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
		<v-snackbar v-model="successFlag"  color="success" >操作成功!!!</v-snackbar>
	</v-container>
</template>


<script>

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
			roleHeaders: [
				{ title: '角色名称',key:'rolename' },
			],
			roleList: [],
			roleDialog: false,
			roleName: '',
			selectedPermission: null,
			selectedRole: null,
			rolePerHeaders: [
				{ title: '权限名称',key:'pername' },
				{ title: 'API路径' ,key:'perpath' },
			],
			rolePerList: [],

			selectedRolePer: null,
		}
	},
	mounted() {
		this.$emit('setbreadcrumbs',this.items);
        this.$emit('setTitle','权限管理');
		this.getPermissionList();
		this.getAllAPIList();
		this.getRoleList();
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
					this.cancelAddPermission();
                    this.getPermissionList();
                } else{
					this.errFlag = true;
					this.errmsg = result.result;
                }
            }
            this.loading = false;

		},
		// 去添加权限
		goToAddPermission(){

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
		// 取消添加权限
		cancelAddPermission(){
			this.apiPath = '';
			this.perName = '';
			this.dialog = false;
		},
		// 刷新
		refresh() {
			this.getPermissionList();
			this.getAllAPIList();
			this.getRoleList();
			this.selectedPermission = null;
			this.selectedRole = null;
			this.selectedItem = null;

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

		// 获取角色列表
		async getRoleList() {
            this.loading = true;
            const response = await this.$axios.get('/permissionManger/getRoleList');
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.roleList = result.result;
                } else{
                    this.roleList = [];
                    console.log(result);
                }
            }
            this.loading = false;
		},
		// 去添加角色
		goToAddRole(){
			this.roleName = '';
			this.roleDialog = true;
		},
		// 取消添加角色
		cancelAddRole(){
			this.roleName = '';
			this.roleDialog = false;
		},
		// 添加角色
		async addRole() {
			if(this.roleName == ''){
				this.errFlag = true;
				this.errmsg = '角色名称不能为空';
				return;
			}

			this.loading = true;
            const response = await this.$axios.post('/permissionManger/addRole',{name:this.roleName});
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.successFlag = true;
					this.cancelAddRole();
                    this.getRoleList();
                } else{
					this.errFlag = true;
					this.errmsg = result.result;
                }
            }
            this.loading = false;
		},
		// 为角色添加权限
		async addPermissionToRole() {
			if(this.selectedPermission == null){
				this.warningFlag = true;
				this.warningmsg = '请先选择一个权限';
				return;
			}
			if(this.selectedRole == null){
				this.warningFlag = true;
				this.warningmsg = '请先选择一个角色';
				return;
			}

			this.loading = true;
            const response = await this.$axios.post('/permissionManger/addPermissionToRole',{PermissionID:this.selectedPermission.perid,RoleID:this.selectedRole.roleid});
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.successFlag = true;
					this.selectedPermission = null;
					this.getRolePermissionList();
                } else{
					this.warningFlag = true;
					this.warningmsg = result.result;
                }
            }
            this.loading = false;

		},

		// 选择权限
		selectPermission(item) {
			console.log(item);
			this.selectedPermission = item;
		},
		// 选择角色
		selectRole(item) {
			console.log(item);
			this.selectedRole = item;
			this.getRolePermissionList();
		},

		// 获取角色权限列表
		async getRolePermissionList() {
            this.loading = true;
            const response = await this.$axios.post('/permissionManger/getRolesPermission',{id:this.selectedRole.roleid});
            if (response.data){
				let result = response.data;
				console.log(result); 
                if(result.code == 0){
                    this.rolePerList = result.result;
                } else{
                    this.rolePerList = [];
                    console.log(result);
                }
            }
            this.loading = false;
		},

		// 选择角色权限
		selectRolePer(item) {
			console.log(item);
			this.selectedRolePer = item;
		},


  	}
}

</script>


<style scoped>
.highlighted{background-color: #cceeff}
</style>