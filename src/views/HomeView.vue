<template>
  <v-container style="width: 100%;">
    <v-row>
      <v-col><v-btn @click="this.$router.push('/guahao');$emit('setTitle','挂号')">挂号</v-btn></v-col>
      <v-col><v-btn @click="this.$router.push('/menzhen');$emit('setTitle','门诊')">门诊</v-btn></v-col>
      <v-col><v-btn>住院</v-btn></v-col>
      <v-col><v-btn>体检</v-btn></v-col>
      <v-col><v-btn @click="this.$router.push('/shoufei');$emit('setTitle','收费')">收费</v-btn></v-col>
    </v-row>
    <v-row>
      <v-col><v-btn>检验</v-btn></v-col>
      <v-col><v-btn>B超</v-btn></v-col>
      <v-col><v-btn>心电图</v-btn></v-col>
      <v-col><v-btn>放射</v-btn></v-col>
      <v-col><v-btn>报表</v-btn></v-col>
    </v-row>
  </v-container>
</template>


<style scoped>

</style>


<script>

import * as XLSX from 'xlsx'
import _ from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';



export default {
  data: () => ({
    
    }),
  mounted:function(){

  },
  computed:{
   
  },
  methods: {
    

  },

}


</script>
