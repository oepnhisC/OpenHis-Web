<template>
	<v-container style="width:100%;margin:0;max-width: 100%;">
		<v-row>
            <v-col><v-btn  @click="" :loading="loading"  size="x-large">刷新</v-btn></v-col>
            <v-col><v-btn  @click="addPermission()" :loading="loading"  size="x-large">选中的接口加入权限库</v-btn></v-col>
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
					</tr>
					</template>
				</v-data-table>
			</v-col>
			<v-col>
				<v-data-table :headers="permissionHeaders" :items="permissionList"  
					:items-per-page="200"   :loading="loading" loading-text="正在加载中"
					no-data-text="暂无数据"  sticky  dense style=" font-size:12px;height: 450px;" >
					<!-- <template v-slot:item="{ item }">
					<tr :class="{'highlighted':selectedItem === item }" 
						@click="selectRow(item)" style="white-space: nowrap;">
						<td>{{ item.url }}</td>
					</tr>
					</template> -->
				</v-data-table>
			</v-col>
		</v-row>
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

			],
			permissionList: [],
			loading: false,
			selectedItem: null,
			allAPIheaders: [
				{ title: 'api路径' },
			],
			allAPIList: [],
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
		addPermission() {
			console.log(this.selectedItem);
			


		},
  	}
}

</script>


<style scoped>
.highlighted{background-color: #cceeff}
</style>