<template>
    <v-container style="width:100%;margin:0;max-width: 100%;">
        <v-row>
            <v-col align='left' cols="3"><v-text-field v-model="search" append-icon="mdi-magnify" label="从加载数据中查找用户" single-line hide-details  clearable stlye="height: 20px;"></v-text-field></v-col>
            <v-col><v-btn  @click="getUserList" size="x-large">刷新</v-btn></v-col>
            <v-col><v-btn  @click="dialog = true" size="x-large">添加用户</v-btn></v-col>
            <v-col><v-btn  @click="addRoleToUser()" size="x-large">为用户添加角色</v-btn></v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-data-table :headers="headers" :items="userList"  :search="search"
                    :items-per-page="200"  sticky :loading="loading" loading-text="正在加载中"
                    no-data-text="暂无数据"   dense 
                    style="width: 100%;font-size:12px;height: 700px;" >
                    <template v-slot:item="{ item }">
                    <tr :class="{'highlighted':selectedItem === item }" 
                        @click="selectRow(item)" style="white-space: nowrap;">
                        <td>{{ item.fno }}</td>
                        <td>{{ item.fname }}</td>
                    </tr>
                    </template>
                </v-data-table>
            </v-col>
            <v-col>
                <v-data-table :headers="userRoleHeaders" :items="userRoleList" 
                    :items-per-page="200"  sticky :loading="loading" loading-text="正在加载中"
                    no-data-text="暂无数据"    dense 
                    style="width: 100%;font-size:12px;height: 700px;" >
                </v-data-table>
            </v-col>

            <v-col>
                <v-data-table :headers="roleHeaders" :items="roleList"  
					:items-per-page="200"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 700px;" >
					<template v-slot:item="{ item }">
					<tr :class="{'highlighted':selectedRole === item }" 
						@click="selectRole(item)" style="white-space: nowrap;">
						<td>{{ item.rolename }}</td>
					</tr>
					</template>
				</v-data-table>
               
            </v-col>

        </v-row>

        <v-dialog v-model="dialog" width="400">
            <v-card max-width="400" title="添加用户">
                <v-text-field label="编号" v-model="username" required hide-details></v-text-field>
                <v-text-field label="密码" v-model="password" required hide-details></v-text-field>
                <v-text-field label="确认密码" v-model="password2" required hide-details></v-text-field>
                <v-alert density="compact" title="失败" type="error"  v-show="errFlag">{{ errmsg }}</v-alert>
                <template v-slot:actions>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="确定" @click="addUser()" color="success" prepend-icon="mdi-check-circle"></v-btn>
                    <v-btn :loading="loading" size="x-large"  variant="tonal" text="取消" @click="cancelAdd()" color="red"   prepend-icon="mdi-cancel"></v-btn>    
                </template>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="successFlag"  color="success" >操作成功!</v-snackbar>
        <v-snackbar v-model="warningFlag"  color="warning" >{{ warningmsg }}</v-snackbar>
    </v-container>
</template>

<script>


export default {
    name: 'UserManage',
    data() {
        return {
            dialog: false,
            username: '',
            password: '',
            password2: '',

            userList: [],
            headers:[
                {title:'用户编号',key:'fno'},
                {title:'姓名',key:'fname'},
            ],
            items: [
                { title: "首页", to:'/' ,replace:true,disabled:false},
                { title: "管理员功能", to:'/HISManager' ,replace:true,disabled:false},
                { title: "用户管理" }
            ],
            loading: false,
            selectedItem :null,
            search: '',
            successFlag: false,
            errFlag: false,
            errmsg: '',

            userRoleHeaders:[
                {title:'用户拥有的角色',key:'fname'}
            ],
            userRoleList:[],

            roleHeaders:[
                {title:'所有角色名',key:'rolename'},
            ],
            roleList:[],
            selectedRole:null,
            warningFlag: false,
            warningmsg: '',
        }
    },
    mounted() {
        this.$emit('setbreadcrumbs',this.items);
        this.$emit('setTitle','用户管理');
        this.getUserList();
        this.getRoleList();
    },
    methods: {
        async getUserList() {
            this.loading = true;
            const response = await this.$axios.get('/userManger/getUserList');
            if (response.data){
                if(response.data.code == 0){
                    let result = response.data;
                    console.log(result);
                    this.userList = result.result;
                }else{
                    this.userList = [];
                    console.log(response.data);
                }
            }
            this.loading = false;
        },
        // 选择单据
        async selectRow(item) {
            console.log(item);
            this.selectedItem = item;
            this.getUserRoleList();
        },

        // 新增用户
        async addUser() {

            if (this.username == '' || this.password == '' || this.password2 == ''){
                this.errmsg = '请填写完整信息';
                this.errFlag = true;
                return;
            }

            if (this.password != this.password2){
                this.errmsg = '两次密码输入不一致';
                this.errFlag = true;
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/userManger/addUser',{'username':this.username,'password':this.password});
            if (response.data){
                if(response.data.code == 0){
                    this.successFlag = true;
                    this.getUserList();
                    this.cancelAdd();
                }else{
                    console.log(response.data);
                    this.errmsg = response.data.result;
                    this.errFlag = true;
                }
            }
            this.loading = false;
        },

        // 取消新增
        cancelAdd() {
            this.dialog = false;
            this.username = '';
            this.password = '';
            this.password2 = '';
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
        // 选择角色
		selectRole(item) {
			console.log(item);
			this.selectedRole = item;
		},

        // 获取用户角色列表
        async getUserRoleList() {
            this.loading = true;
            const response = await this.$axios.post('/userManger/getUserRoleList',{id:this.selectedItem.fuid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.userRoleList = result.result;
                } else{
                    this.userRoleList = [];
                    console.log(result);
                }
            }
            this.loading = false;
        },

        // 为用户添加角色
        async addRoleToUser() {
            if (this.selectedItem == null){
                this.warningmsg = '请先选择用户';
                this.warningFlag = true;
                return;
            }
            if(this.selectedRole == null){
                this.warningmsg = '请先选择角色';
                this.warningFlag = true;
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/userManger/addRoleToUser',{userid:this.selectedItem.fuid,roleid:this.selectedRole.roleid});
            if (response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.successFlag = true;
                    this.getUserRoleList();
                } else{
                    this.warningmsg = result.result;
                    this.warningFlag = true;
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