<template>
    <v-container style="width:100%;margin:0;max-width: 100%;">
        <v-row>
            <v-col align='left' cols="3"><v-text-field v-model="search" append-icon="mdi-magnify" label="从加载数据中查找" single-line hide-details  clearable stlye="height: 20px;"></v-text-field></v-col>
            <v-col><v-btn  @click="getUserList" size="x-large">刷新</v-btn></v-col>
            <v-col><v-btn  @click="dialog = true" size="x-large">添加用户</v-btn></v-col>
        </v-row>
        <v-data-table :headers="headers" :items="userList"  :search="search"
            :items-per-page="9999"  sticky :loading="loading" loading-text="正在加载中"
            no-data-text="暂无数据" hide-default-footer   dense 
            style="width: 100%;font-size:12px;height: 450px;" >
            <template v-slot:item="{ item }">
            <tr :class="{'highlighted':selectedItem === item }" 
                @click="selectRow(item)" style="white-space: nowrap;">
                <td>{{ item.fno }}</td>
                <td>{{ item.fname }}</td>
            </tr>
            </template>
        </v-data-table>

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
        }
    },
    mounted() {
        this.$emit('setbreadcrumbs',this.items);
        this.$emit('setTitle','用户管理');
        this.getUserList();
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


    },
    
}

</script>

<style scoped>
.highlighted{background-color: #cceeff}
</style>