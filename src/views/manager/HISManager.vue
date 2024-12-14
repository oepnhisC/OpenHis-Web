<template>
    <div>
        <v-container style="width:100%;margin:0;max-width: 100%;">
          
            <v-row no-gutters>
                <v-col><v-btn @click="this.$router.replace('/UserManage');" size="x-large">用户管理</v-btn></v-col>
                <v-col><v-btn @click="this.$router.replace('/PermissionManager');" size="x-large">权限管理</v-btn></v-col>
                <v-col><v-btn size="x-large">更多功能正在开发中...</v-btn></v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

export default {
    name: 'HISManager',
    data() {
        return {
            items: [
                { title: "首页", to:'/' ,replace:true,disabled:false},
                { title: "管理员功能"},
            ],
        }
    },
    mounted() {
        this.$emit('setbreadcrumbs',this.items);
        this.$emit('setTitle','管理员功能');
    },
    methods: {
       
    },
    watch: {
    }
}

</script>