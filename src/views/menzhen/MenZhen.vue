<template>
    <div>
      <h1>门诊看病</h1>
      <p>请选择您要看的科室：</p>
      <select v-model="department" @change="fetchDoctors">
        <option disabled value="">请选择一个科室</option>
        <option v-for="dep in departments" :value="dep.id">{{ dep.name }}</option>
      </select>
      <p>医生列表：</p>
      <ul>
        <li v-for="doc in doctors" :key="doc.id">
          {{ doc.name }} - {{ doc.title }}
          <button @click="selectDoctor(doc)">选择医生</button>
        </li>
      </ul>
      <div v-if="selectedDoctor">
        <h2>已选择医生：{{ selectedDoctor.name }}</h2>
        <p>医生简介：{{ selectedDoctor.introduction }}</p>
        <button @click="confirmDoctor">确认医生</button>
      </div>
      <div v-if="patients.length > 0">
        <h2>今日挂号病人列表：</h2>
        <ul>
          <li v-for="patient in patients" :key="patient.id">
            {{ patient.name }} - {{ patient.department }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        department: "",
        departments: [],
        doctors: [],
        selectedDoctor: null,
        patients: []
      };
    },
    mounted() {
      this.fetchDepartments();
    },
    methods: {
      fetchDepartments() {
        // 这里可以调用接口获取科室数据
        this.departments = [
          { id: "1", name: "内科" },
          { id: "2", name: "外科" },
          { id: "3", name: "儿科" }
        ];
      },
      fetchDoctors() {
        // 这里可以调用接口根据科室获取医生数据
        this.doctors = [
          { id: "1", name: "张三", title: "主任医师" },
          { id: "2", name: "李四", title: "副主任医师" },
          { id: "3", name: "王五", title: "主治医师" }
        ];
        this.fetchPatients();
      },
      fetchPatients() {
        // 这里可以调用接口获取今日的挂号病人列表
        this.patients = [
          { id: "1", name: "张三", department: "内科" },
          { id: "2", name: "李四", department: "外科" },
          { id: "3", name: "王五", department: "儿科" }
        ];
      },
      selectDoctor(doctor) {
        this.selectedDoctor = doctor;
      },
      confirmDoctor() {
        // 这里可以处理确认医生的逻辑
        alert("已确认医生：" + this.selectedDoctor.name);
      }
    }
  };
  </script>
  