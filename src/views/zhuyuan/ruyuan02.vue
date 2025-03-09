<template>
    <div class="d-flex justify-space-around">
    <v-container style="width:100%;margin:0;max-width: 100%;">
          <div>
            <v-row>
                
            </v-row>
            <v-row style="height: 80px;">
                <v-col cols="3">
                    <v-row>
                      <VueDatePicker v-model="date" format="yyyy-MM-dd" range locale="zh-cn" day-picker 
                      :enable-time-picker="false" text-input select-text="确定" cancel-text="取消"></VueDatePicker>
                    </v-row>
                    <v-row style="font-size: 12px;margin-top: 10px;" no-gutters><v-col align="center">不建议查询超过2个月的数据，有卡死的风险</v-col></v-row>
                </v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getdatalist()" :loading="loading" size="large">查询</v-btn></v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getToDay()" :loading="loading" size="large">查今日</v-btn></v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getThisWeek()" :loading="loading" size="large">查最近一周</v-btn></v-col>
                <v-col align="center" style="margin-left: 20px;" ><v-btn @click="getThisMonth()" :loading="loading" size="large">查本月</v-btn></v-col>
            </v-row>

    <!-- 确认登记按钮和下拉菜单 -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props">
            确认登记
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items01"
            :key="index"
            :value="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 预约登记按钮和下拉菜单 -->
      <v-btn color="primary">
        预约登记
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(item, index) in items01"
              :key="index"
              :value="index"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <!-- 待入院病人按钮和下拉菜单 -->
      <v-btn id="menu-activator" color="primary">
        待入院病人
      </v-btn>
      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item
            v-for="(item, index) in items01"
            :key="index"
            :value="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn id="people-activator" color="primary">
        人员信息录入
      </v-btn>
      </div>

    <!-- 菜单按钮和下拉菜单 -->
    
    <div>
      <!-- 菜单按钮和下拉菜单 -->
      <v-btn id="cai-activator" color="primary">
        菜单
      </v-btn>
      <v-menu activator="#cai-activator">
        <v-list>
          <v-list-item
            v-for="(item02, index02) in items02"
            :key="index02"
          >
            <v-list-item-title>{{ item02.title }}</v-list-item-title>
            <!-- 子菜单 -->
            <v-menu v-if="item02.submenu?.length > 0" offset-y>
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" @click.stop>
                  <v-list-item-title>更多选项</v-list-item-title>
                </v-list-item>
              </template>
              <v-list>
                <v-list-item
                  v-for="(subItem, subIndex) in item02.submenu"
                  :key="subIndex"
                >
                  <v-list-item-title>{{ subItem }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-row >
    <v-col align='left' cols="3"><v-text-field v-model="search" append-icon="mdi-magnify" label="从加载数据中查找" single-line hide-details  clearable stlye="height: 20px;"></v-text-field></v-col>
                
            </v-row>



    <v-data-table
      :headers="headers"
      :items="fucking_list"
      item-value="key" 
      style="width: 300%; font-size: 12px; height: 600px; overflow: auto; white-space: nowrap;"
      :search="search"
      @click:row="onRowClick"  
    >
      <!-- 无数据时消息 -->
      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="mdi-alert-circle-outline" align="left">
          没有找到数据
        </v-alert>
      </template>


     
      <!-- 动态行渲染 -->
      <template v-slot:item="props">
        <tr :style="getRowStyle(props.item)" @click="onRowClick(props.item)">
          <td 
            v-for="(column, index) in headers" 
            :key="column.key" 
            :style="getCellStyle(props.item, column.key)"
            :class="{'dynamic-background': column.key === '蔡徐坤65'}"
          >
            {{ props.item[column.key] }}
          </td>
        </tr>
      </template>
    </v-data-table>
    
    
    <v-btn @click="openFormDialog" color="primary">病人入院信息录入</v-btn>

    <!---------------------------- 模态框 ------------------------------------------------------------------------------------------------------>
 <!--------------------------------------- 个人信息录入模态框 ------------------------------------------------------------------------------------>
    
 
 <v-dialog v-model="formDialog" max-width="2000px">
      
      <v-card>
        <v-card-title>
          <span class="headline" style="font-size: 25px;">录入病人-入院信息</span>
        </v-card-title>
        <!-- -------------------------表单 标题栏 ---------------------------------->
        <v-card-title style="position: relative; height: 50px;">
          <span class="headline" style="font-size: 25px;  justify-content: flex-end; position: relative; left: 20px;" >个人信息</span>
          <span class="headline" style="font-size: 25px;   justify-content: flex-end; position: relative; left: 510px;" >医保信息</span>
        
          
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form"> 
  <!----------------------------------第一组 ------------------------------------------------------>
            <v-row>
            <v-col cols= "2">
            <v-text-field v-model="newPatient.id_card" label="身份证号" required></v-text-field>
            <v-select
              v-model="newPatient.id_type"
              :items="['居民身份证', '港澳护照或通行证', '台湾居民来往大陆通行证', '外籍护照', '中国护照', '外国人永久居民身份证', '其他有效身份证件']"
              label="证件类型"
              required
            ></v-select>
            <v-select
              v-model="newPatient.gender"
              :items="['男', '女', '其他']"
              label="性别"
              required
            ></v-select>
            <v-text-field v-model="newPatient.name" label="患者姓名" required></v-text-field>
            <v-text-field 
              v-model="newPatient.age" 
              label="年龄" 
              type="number" 
              required 
              append="岁"
            ></v-text-field>
            <v-text-field v-model="newPatient.birth_date" label="出生日期" type="date" required></v-text-field>
            <v-select
              v-model="newPatient.nationality"
              :items="['中国', '中国台湾']"
              label="国籍"
              required
            ></v-select>
            <v-text-field v-model="newPatient.occupation" label="民族" required></v-text-field>
            <v-text-field v-model="newPatient.patient_category" label="病人类别" required></v-text-field>
            <v-text-field v-model="newPatient.fee_category" label="费别" required></v-text-field>
            <v-text-field v-model="newPatient.additional_charges" label="补充费用总额" required></v-text-field>
            </v-col>
            
            <!-- <v-text-field v-model="" label="" required></v-text-field> -->

<!---------------------------------------------------- 第二组 ----------------------------------------->                
                <v-col cols="2">
                <v-text-field
                        v-model="newPatient.disease_name"
                        label="疾病病种"
                        required
                      ></v-text-field>
                      
                      <v-text-field v-model="search02"
                        append-icon="mdi-magnify"
                        label="从加载数据中查找-病种"
                        single-line hide-details clearable style="width: 280px; height: 40px;" @input="onSearchInput"
                      ></v-text-field>
                      <v-col>
                        </v-col>
                      

                      <!-- 使用 v-show 控制数据表格的显示 -->
                      <v-data-table v-show="isDataTableVisible" 
                        :items="bingzhonglist"
                        item-value="key" style="width: 500px; font-size: 12px; height: 200px; overflow: auto; white-space: nowrap;"
                        :search="search02"
                        @click:row="onRowClick"
                      
                        hide-default-footer 
                        > 
                    
                      </v-data-table> 
     
                        <v-select
                            v-model="newPatient.medical_insurance"
                            :items="medicalInsuranceOptions"
                            label="医疗付款"
                            required                           
                          ></v-select>
        
                  <v-text-field v-model="newPatient.height" label="身高" required></v-text-field>
                  <v-text-field v-model="newPatient.weight" label="体重" required></v-text-field>
                  <v-text-field v-model="newPatient.pregnancy_duration" label="怀孕时间" required></v-text-field>
                  <v-text-field v-model="newPatient.baby_birth_weight" label="新生儿出生体重" required></v-text-field>
                  <v-text-field v-model="newPatient.health_card_number" label="健康卡号" required></v-text-field>
                  <v-text-field v-model="newPatient.transfer_medical_institution" label="转院医疗机构" required></v-text-field>
                  <v-text-field v-model="newPatient.transfer_name" label="转院名称" required></v-text-field>
                  <v-text-field v-model="newPatient.allergic_history" label="过敏史" required></v-text-field>
                  
            </v-col>
    <!------------------------------------ 第三组 医保信息模态框 --------------------------------------------------------->
                        <v-col cols="2">      
                            <!------------ 保险机构--------------->
                          <v-select
                            v-model="newPatient.medical_insurance_company"
                            :items="company"
                            label="保险机构"
                            required
                            @update:model-value="changeCompany($event)"
                          ></v-select>
                            <!------------ 分管机构--------------->
                          <v-select
                            v-model="newPatient.department"
                            :items="departments"
                            label="分管机构"
                            required
                            :disabled="newPatient.medical_insurance_company === '广东省省工伤医疗保险接口'"
                          ></v-select>
                          <!------------ 医疗类别--------------->
                          <v-select
                            v-model="newPatient.medical_insurance_category"
                            :items="medicalCategories"
                            label="医疗类别"
                            required
                          ></v-select>
                <v-text-field v-model="newPatient.medical_insurance_number" label="医保卡号" required></v-text-field>
                <v-text-field v-model="newPatient.insurance_card_number" label="保险卡号" required></v-text-field>
                <v-text-field v-model="newPatient.social_security_registration_number" label="社保登记号" required></v-text-field>

                          <!---------------疾病码-------------------->
                          <v-card>
                            <v-container fluid>
                              <v-row>
                                <v-col cols="12">
                                  <v-autocomplete
                                  v-model="newPatient.disease_code"
                                  :items="diseaseCodes"  
                                   
                                  label="普通疾病码"
                                  @focus="getbingma"  
                                  :loading="loading"  
                                 
                                  
                                  ></v-autocomplete>
                                </v-col>

                                <v-col cols="12">
                                  <v-autocomplete
                                    v-model="newPatient.work_injury_disease_code"
                                    :items="workInjuryDiseaseCodes"
                                    density="comfortable"   
                                    label="工伤疾病码"
                                    @update:focused="getgongshangma"
                                  ></v-autocomplete>
                                </v-col>

                                
                              </v-row>
                            </v-container>
                          </v-card>
                



                </v-col>
                </v-row>

            

        
<!-- ------------------------------------------------ 医保信息模态框 ----------------------------------------------------------------------------- -->

                  <v-row>
                  <v-col cols="2">
                    <v-card-title>
                      <span class="headline" style="font-size: 25px;">住院信息</span>
                    </v-card-title>
                  
                  <v-text-field v-model="newPatient.medical_insurance_number" label="医保卡号" required></v-text-field>
        
        <v-select
              v-model="newPatient.medical_insurance_company"
              :items="['广东省省工伤医疗保险接口', '广东省江门市医疗保险接口（2020）']"
              label="保险机构"
              required
              ></v-select>

              </v-col>
              </v-row>
       
      


    <!---------------------------住院信息模态框--------------------------------------------------------------------------------->

    <v-select
              v-model="newPatient.hosipital_department"
              :items="hosipital_department"
              label="住院科室"
              required
            ></v-select>
            <v-select
              v-model="newPatient.status"
              :items="patientStatuses"
              label="病人状态"
              required
              
            ></v-select>
    <!------------------------ 模态框结束 ------------------------------------------------------------------------------>
    <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeFormDialog">取消</v-btn>
          <v-btn color="primary" @click="submitPatientInfo">提交</v-btn>
          <v-btn color="primary" @click="submitPatientInfo">保存</v-btn>
          <div>选中的行: {{ selectedRows }}</div>
        </v-card-actions>
      </v-form>
    </v-card-text>
      </v-card>
    </v-dialog>
    </v-container>
    </div>
  </template>
  
  <script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {format} from 'date-fns'

  export default {
    components: {
      VueDatePicker
    },
    data: () => ({
      dialog: false,
    }),
    data() {
      return {
        headers: [    
                    {title:'就诊ID',key:'蔡徐坤0', rowrap:true},
                    {title:'登记类型',key:'蔡徐坤16', rowrap:true},
                    {title:'病人ID',key:'蔡徐坤2', rowrap:true},
                    {title:'病人状态',key:'蔡徐坤65', rowrap:true},
                    {title:'精准扶贫',key:'蔡徐坤168', rowrap:true},
                    {title:'会员卡',key:'蔡徐坤3', rowrap:true},                    
                    {title:'住院号',key:'蔡徐坤7', rowrap:true},
                    {title:'床号',key:'蔡徐坤37', rowrap:true},
                    {title:'姓名',key:'蔡徐坤9', rowrap:true},
                    {title:'曾用名',key:'蔡徐坤114', rowrap:true},
                    {title:'性别',key:'蔡徐坤108', rowrap:true},
                    {title:'年龄',key:'蔡徐坤56', rowrap:true},
                    {title:'年龄单位',key:'蔡徐坤67', rowrap:true},                    
                    {title:'病人类别',key:'蔡徐坤18', rowrap:true},
                    {title:'费别',key:'蔡徐坤19', rowrap:true},
                    {title:'医疗付款方式',key:'蔡徐坤17', rowrap:true},
                    {title:'押金总额',key:'蔡徐坤156', rowrap:true},
                    {title:'入院诊断',key:'蔡徐坤167', rowrap:true},
                    {title:'费用总额',key:'蔡徐坤157', rowrap:true},
                    {title:'押金余额',key:'蔡徐坤158', rowrap:true},
                    {title:'医保号',key:'蔡徐坤116', rowrap:true},
                    {title:'担保人',key:'蔡徐坤6', rowrap:true},
                    {title:'报警值',key:'蔡徐坤4', rowrap:true},
                    {title:'信用额度',key:'蔡徐坤5', rowrap:true}, 
                    {title:'险类',key:'蔡徐坤115', rowrap:true},
                    {title:'监护人',key:'蔡徐坤89', rowrap:true},
                    {title:'监护人证件类型',key:'蔡徐坤161', rowrap:true},
                    {title:'监护人证件号码',key:'蔡徐坤162', rowrap:true},
                    {title:'介绍人',key:'蔡徐坤110', rowrap:true},
                    {title:'入院时间',key:'蔡徐坤23', rowrap:true},
                    {title:'有效日期',key:'蔡徐坤100', rowrap:true},
                    {title:'入院病区',key:'蔡徐坤21', rowrap:true},
                    {title:'入院科室',key:'蔡徐坤109', rowrap:true},
                    {title:'住院病区',key:'蔡徐坤35', rowrap:true},
                    {title:'住院科室',key:'蔡徐坤111', rowrap:true},
                    //{title:'护理等级',key:'蔡徐坤23', rowrap:true}, 没有数据
                    {title:'次数',key:'蔡徐坤31', rowrap:true},
                    {title:'电话',key:'蔡徐坤85', rowrap:true},
                    {title:'移动电话',key:'蔡徐坤86', rowrap:true},
                    {title:'联系人',key:'蔡徐坤27', rowrap:true},
                    {title:'联系人电话',key:'蔡徐坤93', rowrap:true},
                    {title:'入院病况',key:'蔡徐坤24', rowrap:true},
                    {title:'入院方式',key:'蔡徐坤25', rowrap:true},
                    {title:'住院目的',key:'蔡徐坤29', rowrap:true},
                    {title:'出生日期',key:'蔡徐坤11', rowrap:true},
                    {title:'身高',key:'蔡徐坤63', rowrap:true},
                    {title:'社区',key:'蔡徐坤159', rowrap:true},
                    {title:'体重',key:'蔡徐坤61', rowrap:true},
                    {title:'入院时体重',key:'蔡徐坤62', rowrap:true},
                    {title:'出生地址',key:'蔡徐坤70', rowrap:true},
                    {title:'籍贯',key:'蔡徐坤71', rowrap:true},
                    {title:'民族',key:'蔡徐坤14', rowrap:true},
                    {title:'学历',key:'蔡徐坤13', rowrap:true},
                    {title:'职业',key:'蔡徐坤59', rowrap:true},
                    {title:'身份',key:'蔡徐坤15', rowrap:true},
                    {title:'常住地址',key:'蔡徐坤84', rowrap:true},
                    {title:'身份证号',key:'蔡徐坤12', rowrap:true},
                    {title:'证件类型',key:'蔡徐坤160', rowrap:true},
                    {title:'其他证件',key:'蔡徐坤163', rowrap:true},
                    {title:'工作单位',key:'蔡徐坤76', rowrap:true}, 
                    {title:'登记人',key:'蔡徐坤103', rowrap:true},
                    {title:'健康卡号',key:'蔡徐坤72', rowrap:true},
                    {title:'转院医疗机构',key:'蔡徐坤64', rowrap:true},
                    {title:'备注',key:'蔡徐坤105', rowrap:true},
                ],
        fucking_list: [
         
        ],
        search: '',
        search02: '',
        isDataTableVisible: false, // 控制数据表格的可见性 bingzhonglist: [], // 数据列表
       loading: false,
       selectedRow: null, // 用于存储当前点击的行
       selectedRows33: null, // 用于存储当前选择的行
       
       errorMessage: '',
       successMessage: '',
       date: [],
       items22: [
           { title: "首页", to:'/' ,replace:true,disabled:false},
          { title: "病人入院管理" }
                ],
      // -------------模态框相关数据------------------------------------------------------------------------------------------------------------------------------------       
      formDialog: false, // 控制模态框的显示状态
      valid: true, // 表单验证状态
      newPatient: {
          
        // 病人个人信息
          id_card: '',   // 身份证号
          id_type: '',   // 证件类型
          name: '',   // 姓名
          age: null,  // 年龄
          gender: '',    // 性别
          birth_date: '',   // 出生日期
          nationality: '',   // 民族
          occupation: '',   // 职业
          patient_category: '',   // 病人类别
          fee_category: '',   // 费别
          disease_name: '',      // 疾病病种
          medical_insurance: '',   // 医疗付款
          height: '',   // 身高
          weight: '',   // 体重
          pregnancy_duration: '',   // 怀孕时间
          baby_birth_weight: '',   // 新生儿出生体重
          health_card_number: '',   // 健康卡号
          transfer_medical_institution: '',   // 转院医疗机构
          transfer_name: '',   // 转院名称
          additional_charges: '',   // 补充费用总额
          allergic_history: '',   // 过敏史
        


          admission_date: '',   // 入院日期
          contact_number: '',   // 联系电话
          address: '',   // 地址
          department: '',   // 住院科室
          status: '',   // 病人状态
          // 医保信息
          medical_insurance_company: '',
          department: '',
          medical_insurance_category: '', // 此处初始化为空
          disease_code: '', // 疾病编码
          work_injury_disease_code: '', // 工伤编码
          
          
          
      },
      diseaseCodes: [], // 疾病编码列表
      workInjuryDiseaseCodes: [], // 工伤编码列表
      company: ['广东省省工伤医疗保险接口', '广东省江门市医疗保险接口（2020）', ''],
      departments: [], // 分管机构
      medicalCategories: [], // 假设这里是您的医疗类别数据
      //medicalCategories: ['普通住院', '工伤住院'], // 默认医疗类别包含两个选项
      jige: [],
      bingzhonglist: [], // 疾病病种列表
      filteredBingzhonglist: [], // 过滤后的疾病病种列表
      
          loading: false,
          errorMessages: [],
        
      patientStatuses: ['预约', 
                '在院',
                '出院',
                '转科',
                '预出院',
                '离院',
                '取消'], // 病人状态列表
      hosipital_department: [
                '住院一区',
                '住院二区',
                '住院三区（新）',
                '颐养一区',
                '颐养二区',
                '颐健一区',
                '老年病区'  // 住院科室列表
      ],

      medicalInsuranceOptions: [
                '城镇职工基本医疗保险',
                '城镇居民基本医疗保险',
                '新型农村合作医疗保险',
                '贫困救助',
                '商业医疗保险',
                '全公费',
                '全自费',
                '其他'  // 医疗付款方式列表
      ],
      departments: [
                '',
                '工伤如果有需要，填空值',
                '广州市',
                '深圳市',
                '珠海市',
                '汕头市',
                '佛山市',   
                '韶关市',
                '肇庆市',
                '湛江市',
                '江门市',
                '茂名市',
                '惠州市',
                '梅州市',
                '汕尾市',
                '河源市',
                '阳江市',
                '清远市',
                '东莞市',
                '中山市',
                '潮州市',
                '揭阳市',
                '云浮市',
                '江门市市本级'

                          // 分管机构
          ], 
      items01 :([
      { title: '所有病区' },
      { title: '住院一区' },
      { title: '住院二区' },
      { title: '住院三区（新）' },
      { title: '颐养一区' },
      { title: '颐养二区' },
      { title: '颐健一区' },
      { title: '老年病区' },

    ]),
        items02 :([
      {
        title: '人员信息',
        submenu: ['新增人员', '修改人员', '删除人员'],
      },
      {
        title: '选项2',
        submenu: ['子选项2-1', '子选项2-2'],
      },
      {
        title: '选项3',
        submenu: [],
      },
      {
        title: '选项4',
        submenu: ['子选项4-1'],
      },   
    ]),
      //------------------------------------------------------------------------------------------------------------------------
   
      };
     },
    
 //-----------------------------------------------------------------------------------------------------------------------------     
      
    
  mounted() {
        this.$emit('setbreadcrumbs',this.items22);
    },
    computed: {
      // 转换 headers 格式，适应 v-data-table 的需求
      formattedHeaders() {
        return this.headers.map(header => ({
          text: header.title,
          value: header.key,
          align: 'start',  // 可选，设置对齐方式
          sortable: true,    // 可选，是否可以排序
          limitedBingzhonglist() {
          return this.bingzhonglist.slice(0, 5);  // Only take the first 5 items }
          },
        }));
      },
    },
    mounted() {
    this.getbingzhonglist();  // 组件挂载时自动获取病种列表
  },
    methods: {
      filterOnlyCapsText (value, query, item) {
        return value != null &&
          query != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(query) !== -1
      },
      async getdatalist() {
      this.loading = true; // 设置加载状态为 true
      try {
          let begintime = format(new Date(this.date[0]), 'yyyy-MM-dd 00:00:00');
          let endtime = format(new Date(this.date[1]), 'yyyy-MM-dd 23:59:59');
          
          console.log(`请求开始时间: ${begintime}, 结束时间: ${endtime}`); // 调试日志

          const response = await this.$axios.post('/zhuyuan/getdata', {
              begintime: begintime,
              endtime: endtime
          });
        

          console.log(response); // 输出整个响应以进行调试
          console.log(response.data); // 输出数据以进行调试
          console.log(response.data.code); // 输出状态码以进行调试
    

            if (response.data && response.data.code === 0) {
              this.fucking_list = response.data.result;  // 更新 UI 数据
              this.successMessage = "数据获取成功！"; // 添加成功消息
              console.log("数据获取成功!!:", this.dataList); // 输出数据以进行调试
          } else if (response.data && response.data.code === 1) {
              // 处理未查询到相关信息的情况
              console.warn("未查询到相关信息");
              this.errorMessage = "未查询到相关信息，请检查条件。"; // 用户友好的错误信息
          } else {
              console.error("获取数据失败:", response.data ? response.data.msg : "未知错误");
              this.errorMessage = response.data ? response.data.msg : "未知错误";  // 显示错误信息
          }
      } catch (error) {
          console.error("请求遇到错误:", error);  // 记录错误信息
          // 更详细的错误处理
        if (error.response) {
            console.error("响应错误:", error.response.data);
              this.errorMessage = error.response.data ? error.response.data.msg : "请求失败，未知错误";
          } else if (error.request) {
              console.error("请求未得到响应:", error.request);
              this.errorMessage = "请求未得到响应，请检查网络连接";
          } else {
              console.error("发生了一个错误:", error.message);
              this.errorMessage = error.message;
          }
      } finally {
          this.loading = false; // 重置加载状态
      }
    },
  
      // 获取今日
      async getToDay() {
                let today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let day = today.getDate();

                today.setDate(today.getDate() + 1);
                
                this.date = [year + '-' + month + '-' + day, today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()];
                await this.getdatalist();
            },
            // 获取最近一周
            async getThisWeek() {
                let today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let day = today.getDate();
                let lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                this.date = [lastWeek.getFullYear() + '-' + (lastWeek.getMonth() + 1) + '-' + lastWeek.getDate(), year + '-' + month + '-' + day];
                await this.getdatalist();
                
            },
            // 获取本月
            async getThisMonth() {
                let today = new Date();
                // 获取本月的第一天
                let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                // 获取下个月的第一天，然后减去一天，获得本月的最后一天
                let endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                this.date = [startOfMonth.getFullYear() + '-' + (startOfMonth.getMonth() + 1) + '-' + startOfMonth.getDate()
                , endOfMonth.getFullYear() + '-' + (endOfMonth.getMonth() + 1) + '-' + endOfMonth.getDate()];
                 await this.getdatalist();  
            },
            onRowClick(item) {
            // 如果点击的是同一行，取消选中，否则选中当前行
            console.log('Selected row:', item);  // 检查点击的行
            this.selectedRow = this.selectedRow === item ? null : item;
            
          },
          getRowStyle(item) {
            console.log(this.selectedRow, item);  // 打印比较结果，确保是正确的
            // 根据选中行的状态，返回不同的背景色
            return {
              // 鼠标悬停时，背景色变化
              // 选中时字体颜色变化
              color: this.selectedRow === item ? 'white' : 'black',
              
                
              backgroundColor: this.selectedRow === item ? '#4819f3' : 'transparent'+ ' !important', // 选中行的背景色 important 解决样式覆盖问题  强调优先级别
              cursor: 'pointer' // 鼠标指针样式
            };
          },
          getCellStyle(item, key) {
            // 判断 '蔡徐坤65' 列的数据，动态改变背景颜色
            if (key === '蔡徐坤65') {
              const statusColors = {
                '预约': 'yellow',
                '在院': 'lightgreen',
                '出院': 'lightcoral',
                '转科': 'lightblue',
                '预出院': 'lightgray',
                '离院': 'lightpink',
                '取消': 'lightgrey'
              };
              
              return {
                backgroundColor: statusColors[item[key]] || ''
              };
            }
            return {}; // 对于其他列，返回默认样式
          },
          // 打开模态框
                openFormDialog() {
                  this.formDialog = true;
                  this.$refs.form.reset(); // 重置表单
                  this.valid = true; // 表单有效性
                },
                // 关闭模态框
                closeFormDialog() {
                  this.formDialog = false;
                },
                // 提交病人信息
                async submitPatientInfo() {
                  if (this.valid) {
                    try {
                      const response = await this.$axios.post('/zhuyuan/addpatient', this.newPatient);
                      if (response.data && response.data.code === 0) {
                        this.successMessage = "病人信息录入成功！"; // 添加成功消息
                        this.closeFormDialog(); // 关闭模态框
                        this.getdatalist(); // 刷新数据列表
                      } else {
                        this.errorMessage = response.data.msg; // 显示错误信息
                      }
                    } catch (error) {
                      console.error("请求遇到错误:", error);  // 记录错误信息
                      // 更详细的错误处理
                    }
                  }
                },
  //----------------------------------------疾病病种 选项列表--------------------------------------------------------------------------
  //-------------------------------渲染----------------------------------------------------------------------------------------------
          onRowClick(item33) {
            // 如果点击的是同一行，取消选中，否则选中当前行
            console.log('Selected row:', item33);  // 检查点击的行
            this.selectedRow33 = this.selectedRow33 === item33 ? null : item33;
            
          },
          getRowStyle(item33) {
            console.log(this.selectedRow33, item33);  // 打印比较结果，确保是正确的
            // 根据选中行的状态，返回不同的背景色
            return {
              // 鼠标悬停时，背景色变化
              // 选中时字体颜色变化
              color: this.selectedRow33 === item33 ? 'white' : 'black',
              
                
              backgroundColor: this.selectedRow33 === item33 ? '#4819f3' : 'transparent'+ ' !important', // 选中行的背景色 important 解决样式覆盖问题  强调优先级别
              cursor: 'pointer' // 鼠标指针样式
            };
          },
          onSearchInput() {
            // 当输入框有输入时，显示数据表格 this.isDataTableVisible = this.search02.length > 0; // 如果有输入则显示数据表格
            this.isDataTableVisible = this.search02.length > 0; // 如果有输入则显示数据表格
            //取消选中输入框时，隐藏
            if (this.search02.length === 0) {
              this.selectedRow33 = null;
            }
          },
          
          //-------------------------------------------------------------------------------------------------------------
      async getbingzhonglist() {
      this.loading = true;  // 开始加载
      this.errorMessages = [];  // 清空之前的错误消息

      try {
        //  ！！！！！！！！！！！开发阶段注释掉， 使用此功能时请取消注释！！！！！！！！！！！！！！！！！！
        // 发送 POST 请求
        // const response = await this.$axios.post('/zhuyuan/getbingzhong', {
        //   可以根据需要传递的参数，修改请求体
        // });

        // 处理响应数据
        if (response.data && response.data.code === 0) {
          this.bingzhonglist = response.data.result;  // 更新 UI 数据
          console.log(this.bingzhonglist);  // 输出以进行调试
        } else {
          // 如果响应代码不是 0，认为是请求失败，显示错误信息
          this.errorMessages.push('无法获取病种数据');
        }
      } catch (error) {
        // 捕获任何错误并显示
        console.error("获取病种数据失败", error);
        this.errorMessages.push('网络错误，请稍后再试');
      } finally {
        // 无论成功还是失败，都结束加载状态
        this.loading = false;
      }
    },
    getDiseaseNames() {
      return this.bingzhonglist.map(item => item.name);
    },
    //-----------------------------------工伤医保显示-----------------------------------------------------------------------------------------

  
      // 保险公司选择改变时触发
    changeCompany($event) {
      if (!$event) {
         // 没有选择保险公司时，显示空白选项
        this.newPatient.medical_insurance_category = '';  // 重置医疗类别为默认空值
      } else if ($event === '广东省省工伤医疗保险接口') {
        
        this.newPatient.medical_insurance_category = '工伤住院';  // 自动选中工伤住院
      } else {
        
        this.newPatient.medical_insurance_category = '普通住院';  // 默认选中普通住院
      }
    },
    //----------------------普通疾病编码---------------------------------------------------------------------------------------------------------
    // 选择疾病编码时触发
    async getbingma() {
      this.loading = true;  // 开始加载
      this.errorMessages = [];  // 清空之前的错误消息

      try {
      
        const response = await this.$axios.post('/zhuyuan/bingma', {
          
        });

        // 处理响应数据
        if (response.data && response.data.code === 0) {
          // 
          let bingma = response.data.result;  // 更新 UI 数据
          // 在bingma中取出"医保版2#0名称"放入 diseaseCodes 里面的title
          let bingma_name = bingma.filter(item => item.title === '医保版2#0名称');
          this.diseaseCodes = bingma_name;  // 更新 UI 数据
          console.log(this.diseaseCodes);  // 输出以进行调试
        } else {
          // 如果响应代码不是 0，认为是请求失败，显示错误信息
          this.errorMessages.push('无法获取病码数据');
        }
      } catch (error) {
        // 捕获任何错误并显示
        console.error("获取病码数据失败", error);
        this.errorMessages.push('网络错误，请稍后再试');
      } finally {
        // 无论成功还是失败，都结束加载状态
        this.loading = false;
      }
    },
    //------------------------------------工伤疾病编码--------------------------------------------------------------
    async getgongshangma() {
      this.loading = true;  // 开始加载
      this.errorMessages = [];  // 清空之前的错误消息

      try {
      
        const response = await this.$axios.post('/zhuyuan/gongshangma', {
          });

        // 处理响应数据
        if (response.data && response.data.code === 0) {  
          this.workInjuryDiseaseCodes = response.data.result;  // 更新 UI 数据
          console.log(this.workInjuryDiseaseCodes);  // 输出以进行调试
        } else {
          // 如果响应代码不是 0，认为是请求失败，显示错误信息
          this.errorMessages.push('无法获取工伤病码数据');
        }
      } catch (error) {
        // 捕获任何错误并显示
        console.error("获取工伤病码数据失败", error);
        this.errorMessages.push('网络错误，请稍后再试');
      } finally {
        // 无论成功还是失败，都结束加载状态
        this.loading = false;
      }
    },


         
      


    
      
 
    //--------模态框验证规则----------------------------------------------------------------------------------------------
    openFormDialog() {
      this.formDialog = true;
      // 重置表单数据
      this.resetForm();
    },
    closeFormDialog() {
      this.formDialog = false;
    },
    resetForm() {
      this.newPatient = {
        name: '',
        age: null,
        gender: '',
        admission_date: '',
        contact_number: '',
        address: '',
        department: '',
        status: ''
      };
      this.valid = true; // 重置表单验证状态
    },
    submitPatientInfo() {
      if (this.valid) {
        // 发送 POST 请求
        this.$axios.post('/zhuyuan/addpatient', this.newPatient)
         .then(response => {
            if (response.data && response.data.code === 0) {
              this.successMessage = "病人信息录入成功！"; // 添加成功消息
              this.closeFormDialog(); // 关闭模态框
              this.getdatalist(); // 刷新数据列表
            } else {
              this.errorMessage = response.data.msg; // 显示错误信息
            }
          })
         .catch(error => {
            console.error("请求遇到错误:", error);  // 记录错误信息
            // 更详细的错误处理
          });
      }
    },
  },
};
  // watch: {
  //   // 监听保险公司变化
  //   'newPatient.medical_insurance_company': function(newValue) {
  //     console.log('保险公司变化:', newValue);  // 输出当前选择的保险公司

  //     // 根据选择的保险公司更新医疗类别
  //     if (!newValue) {
  //       this.medicalCategories = [' '];  // 没有选择保险公司时，显示空白选项
  //       this.newPatient.medical_insurance_category = '';  // 重置医疗类别为默认空值
  //     } else if (newValue === '广东省省工伤医疗保险接口') {
  //       this.medicalCategories = ['工伤住院'];  // 只显示工伤住院
  //       this.newPatient.medical_insurance_category = '工伤住院';  // 自动选中工伤住院
  //     } else {
  //       this.medicalCategories = ['普通住院'];  // 只显示普通住院
  //       this.newPatient.medical_insurance_category = '普通住院';  // 默认选中普通住院
  //     }
  //     console.log('更新后的医疗类别:', this.newPatient.medical_insurance_category);  // 输出更新后的医疗类别
  //     console.log('当前可选医疗类别:', this.medicalCategories);  // 输出当前可选医疗类别
  //   }
  // }

  




</script>

<style scoped>
.top-left-corner {
   /* 使用绝对定位 */
  top: 10px;         /* 距离顶部10像素 */
  left: 5px;        /* 距离左边10像素 */
  width: 50px;     /* 宽度100像素 */
}
/* .highlighted-status {
  background-color: #ffeb3b;
  color: #d32f2f;
} */
.dynamic-background {
  background-color: #4819f3; /* 自定义的背景色 */
}
tr {
  transition: background-color  0.3s ease;
  /* 鼠标悬停时，背景色变化 */
}

</style>
