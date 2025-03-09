<template>
    <v-dialog v-model="showFlag" persistent width="800px">
        <div style="background-color: #fff;">
            <div>中药处方</div>
            <div>中药处方</div>
            <div>中药处方</div>
            <div>中药处方</div>
            <v-btn @click="showFlag = false">取消</v-btn>
           
        </div>
    </v-dialog>
</template>

<script>

export default {
    name: 'ZhongYaoYiZhu',
    props:{
        show:{
            type:Boolean,
            default:true
        },
    },
    data() {
        return {
            showFlag: false
        }
    },
    watch:{
        show(newVal){
            this.showFlag = true;
        }
    },
}

</script>
