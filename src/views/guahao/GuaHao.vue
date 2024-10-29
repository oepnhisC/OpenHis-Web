<template>
  <div>
    <h1>挂号页面</h1>
    <form @submit.prevent="submitRegistration">
      <div>
        <label for="name">姓名:</label>
        <input type="text" id="name" v-model="patient.name" required />
      </div>
      <div>
        <label for="age">年龄:</label>
        <input type="number" id="age" v-model="patient.age" required />
      </div>
      <div>
        <label for="gender">性别:</label>
        <select id="gender" v-model="patient.gender" required>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </div>
      <button type="submit">提交挂号</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patient: {
        name: "",
        age: "",
        gender: "",
      },
    };
  },
  methods: {
    submitRegistration() {
      console.log("挂号信息:", this.patient);
      // 在这里添加挂号请求的逻辑
      alert("挂号成功！");
      // 清空表单
      this.patient = {
        name: "",
        age: "",
        gender: "",
      };
    },
  },
};
</script>