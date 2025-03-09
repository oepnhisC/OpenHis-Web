<template>
<v-dialog v-model="showFlag" persistent fullscreen>
    <div style="padding:0;margin:0;width: 100%;height: 100%;background-color: #fff; " >
        <div style="border-bottom: 1px solid #e0e0e0;">
            <div style="display:inline-block;width:20%;font-size:28px;vertical-align: bottom;text-align:center">新开医嘱</div>
            <!-- 病人信息 -->
            <div style="display: inline-block;width:80%;height: 28px;">
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'姓名：'+ bingRen.fname }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'门诊号：'+ bingRen.fmzh }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'性别：'+ bingRen.fsex }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'年龄：'+ bingRen.fage }}</div>
                <div style="display: inline-block;vertical-align: super;margin-right: 30px;">{{'病人类别：'+ bingRen.fbrlb }}</div>
            </div>
        </div>
        <div style="margin-top:5px;height:278px;border-bottom: 1px solid #e0e0e0;">
            <!-- 医嘱单诊断 -->
            <div style="display: inline-block;vertical-align:top;width:350px;">
                <div style="text-align: center;">当前医嘱单诊断</div>
                <v-data-table :headers="zhenDuanHeaders" :items="zhenDuanList" 
                    :items-per-page="50"  sticky :loading="loading" loading-text="正在加载中"
                    no-data-text="暂无数据"  density="compact" hide-default-footer 
                    style="border:1px solid #e0e0e0;white-space: nowrap;height: 252px;font-size:12px;">
                    <template v-slot:headers>
                        <tr>
                            <th><div>操作</div></th>
                            <th><div>主次</div></th>
                            <th><div>次序</div></th>
                            <th v-for="column in zhenDuanHeaders" :key="column.key"><div :style="{width:column.width}">{{column.title}}</div></th>
                        </tr>
                    </template>
                    <template v-slot:item="{ item,index }">
                        <tr>
                            <td><v-btn @click="deleteZhenDuan(item)" color="error" size="x-small">删除</v-btn></td>
                            <td><v-btn @click="setZhuDuanZhu(item)" :color="item.fzybz == '1'?'success' :''" size="x-small">{{ item.fzybz=='1'?'主' :'次' }}</v-btn></td>
                            <td>{{ index + 1 }}</td>
                            <td v-for="column in zhenDuanHeaders">{{ item[column.key] }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
            <!-- 医嘱明细 -->
            <div style="display: inline-block;margin-left:5px;">
                <!-- 搜索疾病 -->
                <div style="display: inline-block;vertical-align:top;">
                    <v-text-field v-model="searchJiBingContent" @keydown.enter.prevent="searchJiBing" @keydown.up.prevent="selectUpJiBing" @keydown.down.prevent="selectDownJiBing" 
                    :loading="loading" label="疾病编码、名称" density="compact" hide-details width="200px"
                         style="display: inline-block;vertical-align: top;"></v-text-field>
                    <v-btn @click="getICD10Code()" :loading="loading" >搜索</v-btn>
                    <div style="position: fixed;width:800px;z-index:999;">
                        <v-data-table v-show="showJiBingFlag"  :headers="jiBingHeaders" :items="jiBingList"  fixed-header  no-data-text="找不到数据" 
                              :items-per-page="50" :items-per-page-text="'条/页'" 
                            density="compact"   style="white-space: nowrap;font-size:12px;z-index:999" height="500px">
                            <template v-slot:headers>
                                <tr>
                                    <th v-for="column in jiBingHeaders" :key="column.key">
                                        <div :style="{width:column.width}">{{column.title}}</div>
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:item="{ item }">
                                <tr @click="selectJiBing(item)" :ref="item.ficdbm" :class="{highlighted:selectedJiBing === item}">
                                    <td v-for="column in jiBingHeaders" >{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <!-- 紧急 并发症 -->
                <div style="display: inline-block;">
                    <v-checkbox v-model="isJinJi" label="紧急" style="display: inline-block;height:20px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                    <v-checkbox v-model="isBingFaZheng" label="并发症" style="display: inline-block;height:20px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                </div>
                <!-- 开始时间 工伤-->
                <div style="vertical-align: top;height:35px">
                    <VueDatePicker v-model="kszxsj" format="yyyy-MM-dd HH:mm:ss"  auto-apply enable-seconds time-picker-inline
                        locale="zh-cn"  text-input  class="ghcell" placeholder="开始时间"
                        style="width:200px;--dp-input-padding:3px;margin-bottom:5px;display:inline-block;vertical-align: top;" ></VueDatePicker>
                    <v-checkbox v-model="isGongShang"  label="因工伤" style="display: inline-block;height:20px;margin-left:70px;" color="primary" hide-spin-buttons hide-details density="compact"></v-checkbox>
                </div>
                <!-- 医嘱内容 -->
                <div>
                    <v-textarea ref="yiZhuContent" :rules="[]"  @keydown.enter.prevent="goToGetYiZhuContent" @keydown.up.prevent="selectUpYiZhuContent" @keydown.down.prevent="selectDownYiZhuContent"
                     label="医嘱内容" v-model="yiZhuContent" :loading="loading"  @keydown.esc.stop="showYiZhuFlag = false"
                    rows="3" row-height="20" style="width:300px;display:inline-block;vertical-align:middle" no-resize hide-details
                    clearable ></v-textarea>
                    <v-btn @click="getYiZhuContent()" :loading="loading"  size="large">搜索</v-btn>
                    <div style="position: fixed;width:80%;left:10%;z-index:999;">
                        <v-data-table v-show="showYiZhuFlag"  :headers="yiZhuHeaders" :items="yiZhuList"  fixed-header  no-data-text="找不到数据" 
                              :items-per-page="50" :items-per-page-text="'条/页'" 
                            density="compact"   style="font-size:12px;z-index:999" height="500px">
                            <template v-slot:headers>
                                <tr>
                                    <th v-for="column in yiZhuHeaders" :key="column.key">
                                        <div :style="{width:column.width}">{{column.title}}</div>
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:item="{ item }">
                                <tr @click="selectYiZhu(item)" :ref="item.fxmbm" :class="{highlighted:selectedYiZhu === item}">
                                    <td v-for="column in yiZhuHeaders">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <!-- 给药途径 -->
                <div style="margin-top:5px;display:inline-block;vertical-align:top;width:220px;">
                    <v-text-field ref="gytj"  v-model="gytj" :loading="loading" @focus="showGytjFlag = true"  @click="showGytjFlag = true" 
                        label="给药途径" density="compact" hide-details width="220px"  @keydown.enter.prevent="enterRowGytj" @keydown.up.prevent="selectUpRowGytj" @keydown.down.prevent="selectDownRowGytj"
                         style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearGytj" ></v-text-field>
                    <div style="position: fixed;width:300px;z-index:999;">
                        <v-data-table v-show="showGytjFlag" :search="gytj"  :headers="gytjHeaders" :items="gytjList"  fixed-header  no-data-text="找不到数据" 
                            :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                            density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                            <template v-slot:item="{ item }">
                                <tr @click="selectGytj(item)" :class="{highlighted:selectedGytj === item}" :ref="item.fxmname">
                                    <td v-for="column in gytjHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <!-- 执行频率 -->
                <div style="margin-top:5px;margin-left:10px;display: inline-block;vertical-align:top;width:180px;">
                    <v-text-field ref="zxpl"  v-model="zxpl" :loading="loading" @focus="showZxplFlag = true"  @click="showZxplFlag = true" 
                        label="执行频率" density="compact" hide-details width="180px"  @keydown.enter.prevent="enterRowZxpl" @keydown.up.prevent="selectUpRowZxpl" @keydown.down.prevent="selectDownRowZxpl"
                         style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearZxpl" ></v-text-field>
                    <div style="position: fixed;width:200px;z-index:999;">
                        <v-data-table v-show="showZxplFlag" :search="zxpl"  :headers="zxplHeaders" :items="zxplList"  fixed-header  no-data-text="找不到数据" 
                            :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                            density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                            <template v-slot:item="{ item }">
                                <tr @click="selectZxpl(item)" :class="{highlighted:selectedZxpl === item}" :ref="item.fpcname">
                                    <td v-for="column in zxplHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <!-- 剂量 天数 总量 滴速-->
                <div style="margin-top:5px;vertical-align:top;">
                    <v-text-field ref="jiliang" v-model="jiliang" @keydown.up="addJiLiang" @keydown.down="jianJiLiang"  @keydown.enter="$refs['tianshu'].focus()"
                        label="剂量" :loading="loading" density="compact" hide-details width="58px" style="display: inline-block;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: text-bottom;width:15px;">
                        <v-icon @click="addJiLiang()" icon="mdi-arrow-up-thick" class="zengjia" size="x-small"></v-icon>
                        <v-icon @click="jianJiLiang()"  icon="mdi-arrow-down-thick" class="jianshao" size="x-small" ></v-icon>
                    </div>
                    <div style="display: inline-block;vertical-align: super;">{{ jldw }}</div>
                    <v-text-field ref="tianshu" v-model="tianshu" @keydown.up="addTianShu" @keydown.down="jianTianShu"  @keydown.enter="disuFlag?$refs['yszt'].focus():$refs['disu'].focus()"
                        label="天数" :loading="loading" density="compact" hide-details width="58px" style="display: inline-block;margin-left:20px;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: text-bottom;width:15px;">
                        <v-icon @click="addTianShu()" icon="mdi-arrow-up-thick" class="zengjia" size="x-small"></v-icon>
                        <v-icon @click="jianTianShu()"  icon="mdi-arrow-down-thick" class="jianshao" size="x-small" ></v-icon>
                    </div>
                    <div style="display: inline-block;vertical-align: super;">日</div>
                    <v-text-field v-model="zongliang" label="总量"  variant="plain"  readonly :loading="loading" density="compact" hide-details width="58px" style="display: inline-block;margin-left:20px;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: super;">{{ mzdw }}</div>
                    <v-text-field ref="disu" v-model="disu"  @keydown.enter="$refs['yszt'].focus()"
                        label="滴速" :disabled="disuFlag"  :loading="loading" density="compact" hide-details width="58px" style="display: inline-block;margin-left:20px;" ></v-text-field>
                    <div style="display: inline-block;vertical-align: super;">滴</div>
                </div>

            </div>
            <div style="display: inline-block;margin-left:10px;vertical-align: top;height: 100%;width:1px">
                <v-divider vertical style="height: 100%;"></v-divider>
            </div>
            <!-- 医嘱明细2 -->
            <div style="display: inline-block;margin-left:15px;vertical-align: top;">
                <!-- 给药次数 -->
                <v-text-field v-model="gycs" label="给药次数" variant="plain" readonly :loading="loading" density="compact" hide-details width="88px" style="margin-top:5px;display: inline-block;vertical-align:top;" ></v-text-field>
                <v-select v-model="zxxz" label="执行性质" :items="zxxzList" :loading="loading" density="compact" hide-details width="100px" style="display: inline-block;vertical-align:top;"></v-select>
                <!-- 用药目的 -->
                <div style="margin-left:20px;display: inline-block;vertical-align:top;width:120px;">
                    <v-text-field v-model="yymd" :loading="loading" @focus="showYymdFlag = true"  @click="showYymdFlag = true" 
                        label="用药目的" density="compact" hide-details width="120px"  @keydown.enter.prevent="enterRowYymd" @keydown.up.prevent="selectUpRowYymd" @keydown.down.prevent="selectDownRowYymd"
                         style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearYymd" ></v-text-field>
                    <div style="position: fixed;width:200px;z-index:999;">
                        <v-data-table v-show="showYymdFlag" :search="yymd"  :headers="yymdHeaders" :items="yymdList"  fixed-header  no-data-text="找不到数据" 
                            :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                            density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                            <template v-slot:item="{ item }">
                                <tr @click="selectYymd(item)" :class="{highlighted:selectedYymd === item}" :ref="item.fyymdname">
                                    <td v-for="column in yymdHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <div style="margin-top:5px;height:40px">
                    
                    <!-- 医师嘱托 -->
                    <v-text-field ref="yszt" v-model="yszt"   @keydown.enter="$refs['saveTemp'].$el.focus()" label="医师嘱托" :loading="loading" density="compact" hide-details width="200px" style="display: inline-block;" ></v-text-field>
                    <!-- 医嘱备注 -->
                    <div style="margin-left:20px;display: inline-block;vertical-align:top;width:200px;">
                        <v-text-field v-model="yzbz" :loading="loading" @focus="showYzbzFlag = true"  @click="showYzbzFlag = true" 
                            label="医嘱备注" density="compact" hide-details width="200px"  @keydown.enter.prevent="enterRowYzbz" @keydown.up.prevent="selectUpRowYzbz" 
                            @keydown.down.prevent="selectDownRowYzbz" 
                            style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearYzbz" ></v-text-field>
                        <div style="position: fixed;width:200px;z-index:999;">
                            <v-data-table v-show="showYzbzFlag" :search="yzbz"  :headers="yzbzHeaders" :items="yzbzList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                                density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectYzbz(item)" :class="{highlighted:selectedYzbz === item}" :ref="item.fmemo">
                                        <td v-for="column in yzbzHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </div>
                <div style="margin-top:5px;">
                    <!-- 执行科室 -->
                    <div style="display: inline-block;vertical-align:top;width:200px;">
                        <v-text-field v-model="zxks" :disabled="zxksFlag" :loading="loading" @focus="showZxksFlag = true"  @click="showZxksFlag = true" 
                            label="执行科室" density="compact" hide-details width="200px"  @keydown.enter.prevent="enterRowZxks" @keydown.up.prevent="selectUpRowZxks" @keydown.down.prevent="selectDownRowZxks"
                            style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearZxks" ></v-text-field>
                        <div style="position: fixed;width:200px;z-index:999;">
                            <v-data-table v-show="showZxksFlag" :search="zxks"  :headers="zxksHeaders" :items="zxksList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                                density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectZxks(item)" :class="{highlighted:selectedZxks === item}" :ref="item.fksname">
                                        <td v-for="column in zxksHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                    <!-- 给药执行科室 -->
                    <div style="display: inline-block;vertical-align:top;width:200px;margin-left:20px;">
                        <v-text-field v-model="gyzxks" :loading="loading" @focus="showGyZxksFlag = true"  @click="showGyZxksFlag = true" 
                            label="给药执行科室" density="compact" hide-details width="200px"  @keydown.enter.prevent="enterRowGyZxks" @keydown.up.prevent="selectUpRowGyZxks" @keydown.down.prevent="selectDownRowGyZxks"
                            style="display: inline-block;vertical-align: top;"  clearable @click:clear="clearGyZxks" ></v-text-field>
                        <div style="position: fixed;width:200px;z-index:999;">
                            <v-data-table v-show="showGyZxksFlag" :search="gyzxks"  :headers="gyzxksHeaders" :items="gyzxksList"  fixed-header  no-data-text="找不到数据" 
                                :items-per-page="100"  hide-default-footer  hide-default-header  :loading="loading" 
                                density="compact"   style="font-size:14px;z-index:999;max-height: 300px;" >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectGyZxks(item)" :class="{highlighted:selectedGyZxks === item}" :ref="item.fksname">
                                        <td v-for="column in gyzxksHeaders" class="hover-bg-blue">{{ item[column.key] }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </div>
                <!-- 开嘱科室 开嘱医生-->
                <div style="margin-top:10px;">
                    <v-text-field v-model="kzks"  :loading="loading"  label="开嘱科室" variant="plain" readonly density="compact" hide-details width="200px" style="display: inline-block;vertical-align: top;"  ></v-text-field>
                    <v-text-field v-model="kzys"  :loading="loading"  label="开嘱医生" variant="plain" readonly density="compact" hide-details width="200px" style="display: inline-block;vertical-align: top;margin-left:20px;"  ></v-text-field>
                </div>

                <div style="margin-top:20px;">
                    <v-btn ref="saveTemp" @click="saveTemp()" prepend-icon="mdi-clock-plus" size="x-large">暂时保存</v-btn>
                    <v-btn @click="sureYiZhu()" size="x-large" prepend-icon="mdi-content-save" color="primary">确认医嘱</v-btn>
                </div>
            </div>

        </div>
        <!-- 暂存医嘱明细 -->
        <div style="margin-top:10px;">
            <v-data-table :headers="yiZhuContentHeaders" :items="yiZhuContentList"
                :items-per-page="100"   :loading="loading" loading-text="正在加载中"
                no-data-text="暂无数据"  hide-default-footer
                style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-width: 300px;">
                <template v-slot:headers>
                    <tr>
                        <th v-for="column in yiZhuContentHeaders" :key="column.key">
                            <div :style="{width:column.width}">{{column.title}}</div>
                        </th>
                    </tr>
                </template>
                <template v-slot:item="{ item }">
                    <tr>
                        <td v-for="column in yiZhuContentHeaders">{{ item[column.key] }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <!-- 暂存费用明细 -->
        <div style="margin-top:10px;">
            <v-data-table :headers="feiYongHeaders" :items="feiYongList"
            :items-per-page="100"   :loading="loading" loading-text="正在加载中"
            no-data-text="暂无数据"  hide-default-footer
            style="font-size:12px;white-space: nowrap;border:1px solid #e0e0e0;min-width: 300px;">
            <template v-slot:headers>
                <tr>
                    <th v-for="column in feiYongHeaders" :key="column.key">
                        <div :style="{width:column.width}">{{column.title}}</div>
                    </th>
                </tr>
            </template>
            <template v-slot:item="{ item }">
                <tr>
                    <td v-for="column in feiYongHeaders">{{ item[column.key] }}</td>
                </tr>
            </template>
        </v-data-table>
        </div>
        <div v-show="showMask" @click="closeMask()" class="zhezhao"></div>
        <div>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
            <v-btn @click="showFlag = false" color="error">取消</v-btn>
        </div>
    </div>
    <v-snackbar v-model="warningFlag"  color="warning" ><v-icon icon="mdi-alert"></v-icon> {{ warningmsg }}</v-snackbar>
    <v-snackbar v-model="successFlag"  color="success" ><v-icon icon="mdi-check"></v-icon> 操作成功！！！！</v-snackbar>
    <ZhongYaoYiZhu :show="showZhongYao"></ZhongYaoYiZhu>
</v-dialog>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import Decimal from 'decimal.js';
import { mapState } from 'vuex';
import dayjs from 'dayjs'
import ZhongYaoYiZhu from './ZhongYaoYiZhu.vue';

export default {
    name: 'MenZhenYiZhu',
    components:{
        VueDatePicker,ZhongYaoYiZhu
    },
    props:{
        show:{
            type:Boolean,
            default:true
        },
        bingRen:{
            type:Object,
            required:true
        },
        keshiId:{
            type:Number,
            required:true
        },
        keshi:{
            type:String,
            required:true
        }
    },
    data() {
        return {
            warningFlag:false,
            warningmsg:'',
            successFlag:false,

            showFlag: false,
         
            personInfo :{
                fname:'',
                fmzh:'',
                fsex:'',
                fage:'',
                fbrlb:'',
            },

            loading:false,
            searchJiBingContent:'55',

            zhenDuanList:[],
            zhenDuanHeaders:[
                {title:'编码',key:'ficdbm',width:'40px'},
                {title:'名称',key:'ficdmc',width:'40px'},
                // {title:'灰码',key:'fhuima',width:'40px'},
                {title:'医保版编码',key:'fybbbm',width:'60px'},
                {title:'医保版名称',key:'fybbmc',width:'40px'},
            ],

            showJiBingFlag:false,
            jiBingList:[],
            jiBingHeaders:[
                {title:'编码',key:'ficdbm',width:'40px'},
                {title:'名称',key:'ficdmc',width:'40px'},
                // {title:'灰码',key:'fhuima',width:'40px'},
                {title:'医保版编码',key:'fybbbm',width:'40px'},
                {title:'医保版名称',key:'fybbmc',width:'40px'},
            ],
            selectedJiBing:null,

            isJinJi:false, //紧急
            isBingFaZheng:false, //并发症
            isGongShang:false,//工伤
            kszxsj:'', //开始时间
            yiZhuContent:'', //医嘱内容

            showYiZhuFlag:false,
            yiZhuList:[],
            yiZhuHeaders:[
                {title:'项目编码',key:'fxmbm',width:'60px'},
                {title:'项目名称',key:'fxmname',width:'60px'},
                {title:'是否报销',key:'fsfbx',width:'60px'},
                {title:'规格',key:'fguige',width:'40px'},
                {title:'单价',key:'fprice',width:'40px'},
                {title:'单位',key:'fdanwei',width:'40px'},
                {title:'库存数量',key:'famount',width:'60px'},
                {title:'药房',key:'fyaofang',width:'40px'},
                {title:'厂家',key:'fchangjia',width:'40px'},
                {title:'说明',key:'fshuoming',width:'40px'},
                {title:'项目特性',key:'fxmtx',width:'40px'},
                {title:'类型',key:'fleixing',width:'40px'},
            ],
            selectedYiZhu:null,

            

            gytj:'', //给药途径
            gytjList:[],
            gytjHeaders:[
                {title:'名称',key:'fxmname',width:'60px'}
            ],
            showGytjFlag:false,
            selectedGytj:null,

            zxpl:'', //执行频率
            zxplList:[],
            zxplHeaders:[
            {title:'名称',key:'fpcname',width:'60px'}
            ],
            showZxplFlag:false,
            selectedZxpl:null,

            jiliang:0, //剂量
            jiliangStep:1,//剂量步长
            jldw : 'mg', //剂量单位
            tianshu:1, //天数
            tianshuStep:1, //天数步长
            mzdw : '片', //门诊单位
            disu:0,//滴速
            disuFlag:true, //滴速是否禁用

            lsid:1, //临时医嘱ID
            zuhao:1,//组号
            fhybxz:0, //符合医保限制
            yppcid:0, //药品批次ID

            zxxz : '0', //执行性质
            zxxzList:[
                {title:'正常',value:'0'},
                {title:'自备药',value:'1'},
                {title:'离院带药',value:'2'},
                {title:'院外配药',value:'4'},
                {title:'外配处方',value:'5'},
                {title:'合并症费',value:'6'},
                {title:'术后补录',value:'8'},
            ],

            yymd:'', //用药目的
            yymdList:[],
            yymdHeaders:[
                {title:'名称',key:'fyymdname',width:'60px'} 
            ],
            showYymdFlag:false,
            selectedYymd:null,

            yszt:'', //医生嘱托

            yzbz:'', //医嘱备注
            yzbzList:[],
            yzbzHeaders:[
                {title:'备注',key:'fmemo',width:'60px'}
            ],
            showYzbzFlag:false,
            selectedYzbz:null,

            zxks:'', //执行科室
            zxksList:[],
            zxksHeaders:[
                {title:'名称',key:'fksname',width:'60px'}
            ],
            showZxksFlag:false,
            selectedZxks:null,
            zxksFlag:false, //执行科室是否禁用

            gyzxks:'', //给药执行科室
            gyzxksList:[],
            gyzxksHeaders:[
                {title:'名称',key:'fksname',width:'60px'}
            ],
            showGyZxksFlag:false,
            selectedGyZxks:null,

            kzks:'xx科', //开嘱科室
            kzys:'某某', //开嘱医生

            yzdid :'', //医嘱单ID
            // fubiaoid : '',//医嘱附表ID

            //当前医嘱单
            yizhudan:{
                id:'',
                xingzhi:'',
                leixing:'',
            },
            //所有医嘱单
            yiZhuDanList:[],

            yiZhuContentList:[],
            yiZhuContentHeaders:[
                {title:'医嘱ID',key:'lsid',width:'60px'},
                {title:'医嘱相关ID',key:'lsxgid',width:'60px'},
                {title:'附表ID',key:'fubiaoid',width:'60px'},
                {title:'紧急',key:'jjbz',width:'60px'},
                {title:'组号',key:'zuhao',width:'60px'},
                {title:'开始时间',key:'kszxsj',width:'60px'},
                {title:'医嘱内容',key:'yizhu',width:'60px'},
                {title:'总量',key:'shuliang',width:'60px'},
                {title:'单位',key:'danwei',width:'60px'},
                {title:'用法',key:'yongfa',width:'60px'},
                {title:'医生嘱托',key:'yszt',width:'60px'},
                {title:'医嘱备注',key:'yzbz',width:'60px'},
                {title:'检查部位',key:'jcbw',width:'60px'},
                {title:'符合医保限制',key:'fhybxz',width:'90px'},
                {title:'医嘱单ID',key:'yzdid',width:'60px'},
                {title:'滴速单位',key:'dsdw',width:'60px'},
                {title:'次序',key:'cixu',width:'60px'},
                {title:'治疗类型',key:'zllx',width:'60px'},
                {title:'医疗项目ID',key:'ylxmid',width:'60px'},
                {title:'收费项目ID',key:'sfxmid',width:'60px'},
                {title:'天数',key:'tianshu',width:'60px'},
                {title:'剂量',key:'jiliang',width:'60px'},
                {title:'用量',key:'yongliang',width:'60px'},
                {title:'单量',key:'danliang',width:'60px'},
                {title:'执行科室',key:'zxks',width:'60px'},
                {title:'执行频率',key:'zxpc',width:'60px'},
                {title:'频次',key:'plcs',width:'60px'},
                {title:'间隔',key:'pljg',width:'60px'},
                {title:'给药途径',key:'gytjbz',width:'60px'},
                {title:'执行性质',key:'gyxz',width:'60px'},
                {title:'药品批次ID',key:'yppcid',width:'60px'},
            ],

            feiYongList:[],
            feiYongHeaders:[
                {title:'数量',key:'yzsl',width:'60px'},
                {title:'单价',key:'danjia',width:'60px'},
                {title:'收费项目ID',key:'xmid',width:'60px'},
                {title:'收费项目名',key:'sfxm',width:'60px'},
                {title:'基本单位单价',key:'jbdwdj',width:'100px'},
                {title:'总量',key:'zongliang',width:'60px'},
                {title:'执行科室ID',key:'zxksid',width:'60px'},
                {title:'费用记录ID',key:'fyjlid',width:'60px'},
                {title:'单据ID',key:'djid',width:'60px'},
                {title:'附表ID',key:'fubiaoid',width:'60px'},
                {title:'医嘱单ID',key:'yzdid',width:'60px'},
                {title:'药品批次ID',key:'yppcid',width:'60px'},
                {title:'成本价',key:'cbj',width:'60px'},
                {title:'套餐ID',key:'tcid',width:'60px'},
                {title:'诊疗收费对照数量',key:'sfdzsl',width:'100px'},
                {title:'从属标志',key:'csbz',width:'60px'},
                {title:'费用性质',key:'fyxz',width:'60px'},
                {title:'收费方式',key:'sffs',width:'60px'},
                {title:'符合医保限制',key:'fhybxz',width:'100px'},
                {title:'医保项目编码',key:'ybbm',width:'100px'},
                {title:'医保项目名称',key:'ybmc',width:'60px'},
            ],

            showZhongYao:false,
        }
    },
    mounted(){
        this.getGeiYaoTuJing();
        this.getZhiXingFenLi();
        this.getYongYaoMuDi();
        this.getYiZhuBeiZhu();
        this.getZhiXingKeShi();
        this.getGeiYaoZhiXingKeShi();
    },
    methods: {
        //搜索疾病编码
        async getICD10Code(){
            if(this.loading){
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/menzhenyizhu/getICD10Code',{content:this.searchJiBingContent});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
                    this.jiBingList = result.result;
                    this.showJiBingFlag = true;

				}else{
                    this.jiBingList = []; 
                    this.showJiBingFlag = true;
				}
			}
            this.loading = false;
        },
        // 按回车搜索疾病
        searchJiBing(){
            if(!this.showJiBingFlag){
                this.getICD10Code();
            }else{
                if (this.selectedJiBing == null){
                    if(this.jiBingList.length > 0){
                        this.selectedJiBing = this.jiBingList[0];
                    }
                }else{
                    this.selectJiBing(this.selectedJiBing);
                }
            }
        },
        //向上选择疾病
        selectUpJiBing(){
            if(!this.showJiBingFlag){
                return;
            }
            let list = this.jiBingList;
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedJiBing == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.ficdid == this.selectedJiBing.ficdid);
                    if(currentIndex > 0){
                        currentIndex --;
                    }
                }
                this.selectedJiBing = list[currentIndex];
                this.$refs[this.selectedJiBing.ficdbm].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        //向下选择疾病
        selectDownJiBing(){
            if(!this.showJiBingFlag){
                return;
            }
            let list = this.jiBingList;
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedJiBing == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.ficdid == this.selectedJiBing.ficdid);
                    if(currentIndex < list.length-1){
                        currentIndex ++;
                    }
                }
                this.selectedJiBing = list[currentIndex];
                this.$refs[this.selectedJiBing.ficdbm].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 添加选中的疾病
        selectJiBing(item){
            this.showJiBingFlag = false;
            let zditem = {...item};
            for(let i=0;i<this.zhenDuanList.length;i++){
                if(this.zhenDuanList[i].ficdbm == zditem.ficdbm){
                    return;
                }
            }
            //默认第一个诊断为主诊断
            if(this.zhenDuanList.length == 0){
                zditem.fzybz = '1';
            }else{
                zditem.fzybz = '2';
            }
            this.zhenDuanList.push(zditem);
            this.selectedJiBing = null;
        },
        // 设置主次诊断
        setZhuDuanZhu(item){
            for(let i=0;i<this.zhenDuanList.length;i++){
                if(this.zhenDuanList[i].ficdbm == item.ficdbm){
                    this.zhenDuanList[i].fzybz = '1';
                }else{
                    this.zhenDuanList[i].fzybz = '2';
                }
            }
        },
        // 删除诊断
        deleteZhenDuan(item){
            for(let i=0;i<this.zhenDuanList.length;i++){
                if(this.zhenDuanList[i].ficdbm == item.ficdbm){
                    this.zhenDuanList.splice(i,1);
                    break;
                }
            }
        },
        // 获取医嘱内容
        async getYiZhuContent(){
            if(this.loading){
                return;
            }
            if(this.yiZhuContent.trim() == ''){
                return;
            }
            this.loading = true;
            const response = await this.$axios.post('/menzhenyizhu/getYiZhuContent',{content:this.yiZhuContent,keshiId:this.keshiId});
			if (response.data){
				let result = response.data;
				console.log(result);
				if(result.code == 0){
                    this.yiZhuList = result.result;
                    this.showYiZhuFlag = true;
				}else{
                    this.yiZhuList = []; 
                    this.showYiZhuFlag = true;
				}
			}
            this.loading = false;
        },
        // 回车获取医嘱内容
        goToGetYiZhuContent(event){
            if(!this.showYiZhuFlag){
                this.getYiZhuContent();
            }else{
                if (this.selectedYiZhu == null){
                    if(this.yiZhuList.length > 0){
                        this.selectedYiZhu = this.yiZhuList[0];
                    }
                }else{
                    this.selectYiZhu(this.selectedYiZhu);
                }
            }
        
        },
        //向上选择医嘱内容
        selectUpYiZhuContent(){
            if(!this.showYiZhuFlag){
                return;
            }
            let list = this.yiZhuList;
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYiZhu == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fxmbm == this.selectedYiZhu.fxmbm);
                    if(currentIndex > 0){
                        currentIndex --;
                    }
                }
                this.selectedYiZhu = list[currentIndex];
                this.$refs[this.selectedYiZhu.fxmbm].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        //向下选择医嘱内容
        selectDownYiZhuContent(){
            if(!this.showYiZhuFlag){
                return;
            }
            let list = this.yiZhuList;
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYiZhu == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fxmbm == this.selectedYiZhu.fxmbm);
                    if(currentIndex < list.length-1){
                        currentIndex ++;
                    }
                }
                this.selectedYiZhu = list[currentIndex];
                this.$refs[this.selectedYiZhu.fxmbm].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 选择医嘱内容
        selectYiZhu(item){
            this.showYiZhuFlag = false;
            console.log(item);
            this.selectedYiZhu = item;
            this.yiZhuContent = item.fxmbm + ' ' + item.fxmname + ' ' + item.fguige;
            this.zxksFlag = false;
            switch(item.flxbm){
                case 'L':this.yizhudan.xingzhi  = '9'; this.yizhudan.leixing  = '10'; this.yizhudan.id = this.yzdid-6; break; 
                case '1':
                case '2':
                    this.yizhudan.xingzhi = '1'; this.yizhudan.leixing = '1'; this.yizhudan.id = this.yzdid-4; 
                    this.getYaoPinGuiGe();this.guDingYaoFang(item);   break;
                case '3':
                    this.yizhudan.xingzhi = '2';this.yizhudan.leixing = '1';this.yizhudan.id = this.yzdid-3; 
                    this.guDingYaoFang(item);this.showZhongYao = !this.showZhongYao;return;

            }
            this.$refs['gytj'].focus();
            
        },
        // 固定执行科室为药房
        guDingYaoFang(item){
            this.selectedZxks = {fksid:item.fyfid,fksname:item.fyaofang};
            this.zxks = item.fyaofang;
            this.zxksFlag = true;
        },
        //获取药品规格
        async getYaoPinGuiGe(){
            const response = await this.$axios.post('/menzhenyizhu/getYaoPinGuiGe',{id:this.selectedYiZhu.fsfxmid});
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    let data = result.result[0];
                    this.jldw = data.fjldw;
                    this.jiliang = data.fjiliang;
                    this.jiliangStep = data.fjiliang;
                    this.mzdw = data.fmzdw;
                }else{

                }
            }
        },

        //获取给药途径
        async getGeiYaoTuJing(){
            const response = await this.$axios.get('/menzhenyizhu/getGeiYaoTuJing');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.gytjList = result.result;
                }else{
                    this.gytjList = [];
                }
            }
        },
        // 选择给药途径
        selectGytj(item){
            this.showGytjFlag = false;
            this.selectedGytj = item;
            this.selectedGytj.fubiaoid = 0;
            this.gytj = item.fxmname;
            if(item.fzxfl == 2){
                this.disuFlag = false;
            }else{
                this.disuFlag = true;
            }
            this.$refs['zxpl'].focus();
        },
        // 回车选择给药途径
        enterRowGytj(){
            if (this.selectedGytj == null){
                if(this.gytjList.length > 0){
                    //过滤后的第一行数据
                    this.selectedGytj = this.gytjList.filter(item => item.fxmname.indexOf(this.gytj) >= 0)[0];
                }
            }else{
                // this.gytj = this.selectedGytj.fxmname;
                // this.showGytjFlag = false;
                this.selectGytj(this.selectedGytj);
            }
        },
        // 向上选择给药途径
        selectUpRowGytj(){
            let list = [];
            if(this.gytj == ''){
                list = this.gytjList;
            }else{
                list = this.gytjList.filter(item => item.fxmname.indexOf(this.gytj) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedGytj == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fxmname == this.selectedGytj.fxmname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedGytj = list[currentIndex];
                this.$refs[this.selectedGytj.fxmname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择给药途径
        selectDownRowGytj(){
            let list = [];
            if(this.gytj == ''){
                list = this.gytjList;
            }else{
                list = this.gytjList.filter(item => item.fxmname.indexOf(this.gytj) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedGytj == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fxmname == this.selectedGytj.fxmname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedGytj = list[currentIndex];
                this.$refs[this.selectedGytj.fxmname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除给药途径
        clearGytj(){
            this.gytj = '';
            this.selectedGytj = null;
            this.showGytjFlag = true;
        },
        // 获取执行频率
        async getZhiXingFenLi(){
            const response = await this.$axios.get('/menzhenyizhu/getPinci');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zxplList = result.result;
                }else{
                    this.zxplList = [];
                }
            }
        },
        // 选择执行频率
        selectZxpl(item){
            this.showZxplFlag = false;
            this.selectedZxpl = item;
            this.zxpl = item.fpcname;
        },
        // 回车选择执行频率
        enterRowZxpl(){
            if (this.selectedZxpl == null){
                if(this.zxplList.length > 0){
                    //过滤后的第一行数据
                    this.selectedZxpl = this.zxplList.filter(item => item.fpcname.indexOf(this.zxpl) >= 0)[0];
                }
            }else{
                this.zxpl = this.selectedZxpl.fpcname;
                this.showZxplFlag = false;
                this.$refs['jiliang'].focus();
            }
        },
        // 向上选择执行频率
        selectUpRowZxpl(){
            let list = [];
            if(this.zxpl == ''){
                list = this.zxplList;
            }else{
                list = this.zxplList.filter(item => item.fpcname.indexOf(this.zxpl) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxpl == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fpcname == this.selectedZxpl.fpcname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedZxpl = list[currentIndex];
                this.$refs[this.selectedZxpl.fpcname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择执行频率
        selectDownRowZxpl(){
            let list = [];
            if(this.zxpl == ''){
                list = this.zxplList;
            }else{
                list = this.zxplList.filter(item => item.fpcname.indexOf(this.zxpl) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxpl == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fpcname == this.selectedZxpl.fpcname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedZxpl = list[currentIndex];
                this.$refs[this.selectedZxpl.fpcname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }       
        },
        // 清除执行频率
        clearZxpl(){
            this.zxpl = '';
            this.selectedZxpl = null;
            this.showZxplFlag = true;
        },
        //关闭遮罩
        closeMask(){
            this.showJiBingFlag = false;
            this.showYiZhuFlag = false;
            this.showGytjFlag = false;
            this.showZxplFlag = false;
            this.showYymdFlag = false;
            this.showYzbzFlag = false;
            this.showZxksFlag = false;
            this.showGyZxksFlag = false;
        },
        //增加剂量
        addJiLiang(){
            if (this.jiliang == ''){
                this.jiliang = 0;
            }
            const a = new Decimal(this.jiliang);
            const b = new Decimal(this.jiliangStep);
            this.jiliang = a.plus(b).toNumber();
            
        },
        //减少剂量
        jianJiLiang(){
            if (this.jiliang == ''){
                this.jiliang = 0;
            }
            if(this.jiliang > this.jiliangStep){
                const a = new Decimal(this.jiliang);
                const b = new Decimal(this.jiliangStep);
                this.jiliang = a.minus(b).toNumber();
            }
        },
        // 增加天数
        addTianShu(){
            if (this.tianshu == ''){
                this.tianshu = 0;
            }
            const a = new Decimal(this.tianshu);
            const b = new Decimal(this.tianshuStep);
            this.tianshu = a.plus(b).toNumber();

        },
        // 减少天数
        jianTianShu(){
            if (this.tianshu == ''){
                this.tianshu = 0;
            }
            if(this.tianshu > this.tianshuStep){
                const a = new Decimal(this.tianshu);
                const b = new Decimal(this.tianshuStep);
                this.tianshu = a.minus(b).toNumber();
            }
        },
       
        // 获取用药目的
        async getYongYaoMuDi(){
            const response = await this.$axios.get('/menzhenyizhu/getYongYaoMuDi');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.yymdList = result.result;
                }else{
                    this.yymdList = [];
                }
            }
        },
        // 选择用药目的
        selectYymd(item){
            this.showYymdFlag = false;
            this.selectedYymd = item;
            this.yymd = item.fyymdname;
        },
        // 回车选择用药目的
        enterRowYymd(){
            if (this.selectedYymd == null){
                if(this.yymdList.length > 0){
                    //过滤后的第一行数据
                    this.selectedYymd = this.yymdList.filter(item => item.fyymdname.indexOf(this.yymd) >= 0)[0];
                }
            }else{
                this.yymd = this.selectedYymd.fyymdname;
                this.showYymdFlag = false;
            }
        },
        // 向上选择用药目的
        selectUpRowYymd(){
            let list = [];
            if(this.yymd == ''){
                list = this.yymdList;
            }else{
                list = this.yymdList.filter(item => item.fyymdname.indexOf(this.yymd) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYymd == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fyymdname == this.selectedYymd.fyymdname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedYymd = list[currentIndex];
                this.$refs[this.selectedYymd.fyymdname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择用药目的
        selectDownRowYymd(){
            let list = [];
            if(this.yymd == ''){
                list = this.yymdList;
            }else{
                list = this.yymdList.filter(item => item.fyymdname.indexOf(this.yymd) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYymd == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fyymdname == this.selectedYymd.fyymdname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedYymd = list[currentIndex];
                this.$refs[this.selectedYymd.fyymdname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除用药目的
        clearYymd(){
            this.yymd = '';
            this.selectedYymd = null;
            this.showYymdFlag = true;
        },
        // 获取医嘱备注
        async getYiZhuBeiZhu(){
            const response = await this.$axios.get('/menzhenyizhu/getYiZhuBeiZhu');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.yzbzList = result.result;
                }else{
                    this.yzbzList = [];
                }
            }
        },
        // 选择医嘱备注
        selectYzbz(item){
            this.showYzbzFlag = false;
            this.selectedYzbz = item;
            this.yzbz = item.fmemo;
        },
        // 回车选择医嘱备注
        enterRowYzbz(){
            if (this.selectedYzbz == null){
                if(this.yzbzList.length > 0){
                    //过滤后的第一行数据
                    this.selectedYzbz = this.yzbzList.filter(item => item.fmemo.indexOf(this.yzbz) >= 0)[0];
                }
            }else{
                this.yzbz = this.selectedYzbz.fmemo;
                this.showYzbzFlag = false;
            }
        },
        // 向上选择医嘱备注
        selectUpRowYzbz(){
            let list = [];
            if(this.yzbz == ''){
                list = this.yzbzList;
            }else{
                list = this.yzbzList.filter(item => item.fmemo.indexOf(this.yzbz) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYzbz == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fmemo == this.selectedYzbz.fmemo);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedYzbz = list[currentIndex];
                this.$refs[this.selectedYzbz.fmemo].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择医嘱备注
        selectDownRowYzbz(){
            let list = [];
            if(this.yzbz == ''){
                list = this.yzbzList;
            }else{
                list = this.yzbzList.filter(item => item.fmemo.indexOf(this.yzbz) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedYzbz == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fmemo == this.selectedYzbz.fmemo);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedYzbz = list[currentIndex];
                this.$refs[this.selectedYzbz.fmemo].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除医嘱备注
        clearYzbz(){
            this.yzbz = '';
            this.selectedYzbz = null;
            this.showYzbzFlag = true;
        },
        // 获取执行科室
        async getZhiXingKeShi(){
            const response = await this.$axios.get('/menzhenyizhu/getZhiXingKeShi');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.zxksList = result.result;
                }else{
                    this.zxksList = []; 
                }
            }
        },
        // 选择执行科室
        selectZxks(item){
            this.showZxksFlag = false;
            this.selectedZxks = item;
            this.zxks = item.fksname;   
        },
        // 回车选择执行科室
        enterRowZxks(){
            if (this.selectedZxks == null){  
                if(this.zxksList.length > 0){
                    //过滤后的第一行数据
                    this.selectedZxks = this.zxksList.filter(item => item.fksname.indexOf(this.zxks) >= 0)[0];
                }
            }else{
                this.zxks = this.selectedZxks.fksname;
                this.showZxksFlag = false;
            }
        },
        // 向上选择执行科室
        selectUpRowZxks(){
            let list = [];
            if(this.zxks == ''){
                list = this.zxksList;
            }else{
                list = this.zxksList.filter(item => item.fksname.indexOf(this.zxks) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxks == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fksname == this.selectedZxks.fksname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedZxks = list[currentIndex];
                this.$refs[this.selectedZxks.fksname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择执行科室
        selectDownRowZxks(){
            let list = [];
            if(this.zxks == ''){
                list = this.zxksList;
            }else{
                list = this.zxksList.filter(item => item.fksname.indexOf(this.zxks) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedZxks == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fksname == this.selectedZxks.fksname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedZxks = list[currentIndex];
                this.$refs[this.selectedZxks.fksname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }   
        },
        // 清除执行科室
        clearZxks(){
            this.zxks = '';
            this.selectedZxks = null;
            this.showZxksFlag = true;
        },
        // 获取给药执行科室
        async getGeiYaoZhiXingKeShi(){
            const response = await this.$axios.get('/menzhenyizhu/getGeiYaoZhiXingKeShi');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.gyzxksList = result.result;
                }else{
                    this.gyzxksList = [];
                }
            }
        },
        // 选择给药执行科室
        selectGyZxks(item){
            this.showGyZxksFlag = false;
            this.selectedGyZxks = item;
            this.gyzxks = item.fksname;
        },
        // 回车选择给药执行科室
        enterRowGyZxks(){
            if (this.selectedGyZxks == null){
                if(this.gyzxksList.length > 0){
                    //过滤后的第一行数据
                    this.selectedGyZxks = this.gyzxksList.filter(item => item.fksname.indexOf(this.gyzxks) >= 0)[0];
                }
            }else{
                this.gyzxks = this.selectedGyZxks.fksname;
                this.showGyZxksFlag = false;
            }
        },
        // 向上选择给药执行科室
        selectUpRowGyZxks(){
            let list = [];
            if(this.gyzxks == ''){
                list = this.gyzxksList;
            }else{
                list = this.gyzxksList.filter(item => item.fksname.indexOf(this.gyzxks) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedGyZxks == null){
                    currentIndex = 0;
                }else {
                    currentIndex = list.findIndex(item => item.fksname == this.selectedGyZxks.fksname);
                    if(currentIndex > 0){
                        currentIndex = currentIndex-1;
                    }
                }
                this.selectedGyZxks = list[currentIndex];
                this.$refs[this.selectedGyZxks.fksname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 向下选择给药执行科室
        selectDownRowGyZxks(){
            let list = [];
            if(this.gyzxks == ''){
                list = this.gyzxksList;
            }else{
                list = this.gyzxksList.filter(item => item.fksname.indexOf(this.gyzxks) >= 0);
            }
            if(list.length > 0){
                let currentIndex = 0;
                if (this.selectedGyZxks == null){
                    currentIndex = 0;
                }
                else{
                    currentIndex = list.findIndex(item => item.fksname == this.selectedGyZxks.fksname);
                    if(currentIndex < list.length-1){
                        currentIndex = currentIndex+1;
                    }
                }
                this.selectedGyZxks = list[currentIndex];
                this.$refs[this.selectedGyZxks.fksname].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        },
        // 清除给药执行科室
        clearGyZxks(){
            this.gyzxks = '';
            this.selectedGyZxks = null;
            this.showGyZxksFlag = true;
        },
        // 获取医保限制
        async getYiBaoXianZhi(id){
            const response = await this.$axios.post('/menzhenyizhu/getYiBaoXianZhi',{id:id});
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    
                }else{
                    
                }
            }
        },
        // 获取医嘱单ID
        async getYiZhuDanID(){
            const response = await this.$axios.get('/menzhenyizhu/getYiZhuDanID');
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    this.yzdid = result.result.yzdid;
                    // this.fubiaoid = result.result.fubiaoid;
                }else{
                    this.yzdid = '';
                    // this.fubiaoid = '';
                }
            }
        },
        //清空内容
        clearContent(){
            this.selectedYiZhu = null;
            this.selectedGytj = null;
            this.selectedZxks = null;
            this.selectedZxpl = null;
            this.jiliang = 0;
            this.tianshu = 1;
            this.disu = '';
            this.zxks = '';
            this.gyzxks = '';
            this.yiZhuContent='';
            this.gytj='';
            this.zxpl = '';
            this.yszt = '';
            this.yzbz = '';
            this.zxxz = '0';
            this.zuhao = 1;
            this.fhybxz = 0;
        },
        // 保存临时数据
        async saveTemp(){

            if(this.loading){
                return;
            }
            if(this.yizhudan.leixing == '1' && this.zhenDuanList.length == 0 ){
                this.warningFlag = true;
                this.warningmsg = '诊断不能为空';
                return;
            }
            if(this.yizhudan.id == ''){
                this.warningFlag = true;
                this.warningmsg = '无医嘱单ID';
                return;
            }
            if(this.selectedYiZhu == null){
                this.warningFlag = true;
                this.warningmsg = '未选择医嘱';
                return;
            }
            if(this.yizhudan.leixing == '1' && this.selectedGytj == null){
                this.warningFlag = true;
                this.warningmsg = '未选择给药途径';
                return;
            }
            if(this.yizhudan.leixing == '1' && this.selectedZxpl == null){
                this.warningFlag = true;
                this.warningmsg = '未选择执行频率';
                return;
            }
            if(this.selectedZxks == null){
                this.warningFlag = true;
                this.warningmsg = '未选择执行科室';
                return;
            }

            let yizhu_temp = {
                yizhudan:[],
                zhenduan:[],
                yizhucontent:[],
                shoufeixiangmu:[],
                shenqingdan:[],
                shoushurenyuan:[],
                guahaobingli:[],
                brid:this.bingRen.fbrid,
                jzid:this.bingRen.fjzid,
                kzksid:this.keshiId,
            }

            // 医嘱单
            let yizhudan_item = {
                id : this.yizhudan.id,
                xingzhi : this.yizhudan.xingzhi,
                leixing: this.yizhudan.leixing,
            }
            yizhu_temp.yizhudan.push(yizhudan_item);

            // 诊断
            for(let i=0;i<this.zhenDuanList.length;i++){
                let zhenduan_item = {
                    yzdid : this.yizhudan.id,
                    zdcx : i+1,
                    jbid: this.zhenDuanList[i].ficdid,
                    jbname: this.zhenDuanList[i].ficdmc,
                    zcbz: this.zhenDuanList[i].fzybz
                }
                yizhu_temp.zhenduan.push(zhenduan_item);
            }

            //医嘱内容
            yizhu_temp.yizhucontent = [...this.yiZhuContentList];

            if(this.selectedGytj != null){ //给药途径加入医嘱内容
                let yizhucontent_gytj = {
                    lsid:-this.lsid,
                    lsxgid:0,
                    yzdid: this.yizhudan.id,
                    dsdw: this.selectedGytj.fzxfl == '2'?'滴':'',
                    sbbs:this.isGongShang?'1':'0',
                    cixu:0,
                    state:1,
                    zllx:this.selectedGytj.fflid,
                    ylxmid:this.selectedGytj.fxmid,
                    bbbw:'',
                    jcbw:'', 
                    sfxmid:0,
                    tianshu:this.tianshu,
                    jiliang:0,
                    yongliang:"",
                    danliang:0,
                    shuliang:this.gycs,
                    yizhu : this.selectedGytj.fxmname,
                    yszt: this.yszt,
                    zxksid : this.userInfo.keshiID ,
                    zxpc : this.selectedZxpl.fpcname ,
                    plcs : this.selectedZxpl.fpinci  ,
                    pljg : this.selectedZxpl.fjgzq,
                    jgdw : this.selectedZxpl.fjgdw,
                    gytjbz : 1, 
                    jjbz : this.isJinJi ? 1 : 0, 
                    kszxsj : dayjs(this.kszxsj).format('YYYY-MM-DD HH:mm:ss'),
                    zxzzsj:"9999-12-30 00:00:00",
                    yzbz:this.yzbz,
                    gyksid:this.selectedGyZxks == null? '':this.selectedGyZxks.fksid,
                    gyxz : this.zxxz,
                    zuhao : this.zuhao,
                    disu : this.disu,
                    zlfaid:0,
                    ypyf:'',
                    fhybxz : this.fhybxz,
                    yppcid : this.yppcid,
                    fubiaoid:0,
                    bfzbz:this.isBingFaZheng?1:0,
                }
                yizhu_temp.yizhucontent.push(yizhucontent_gytj);
            }

            let yizhucontent_item = {
                lsid:this.lsid,
                lsxgid:-this.lsid,
                yzdid: this.yizhudan.id,
                dsdw: this.selectedGytj.fzxfl == '2'?'滴':'',
                sbbs:this.isGongShang?'1':'0',
                cixu:1,
                state:1,
                zllx:this.selectedYiZhu.flxbm,
                ylxmid:this.selectedYiZhu.fxmid,
                bbbw:'',
                jcbw:'', 
                sfxmid:this.selectedYiZhu.fsfxmid,
                tianshu:this.tianshu,
                jiliang:this.jiliang,
                yongliang:this.jiliang + " " + this.jldw,
                danliang:this.danliang,
                shuliang:this.zongliang,
                yizhu : this.selectedYiZhu.fxmname + " " + this.selectedYiZhu.fguige,
                yszt: this.yszt,
                zxksid : this.selectedZxks.fksid ,
                zxpc : this.selectedZxpl.fpcname ,
                plcs : this.selectedZxpl.fpinci  ,
                pljg : this.selectedZxpl.fjgzq,
                jgdw : this.selectedZxpl.fjgdw,
                gytjbz : 0, 
                jjbz : this.isJinJi ? 1 : 0, 
                kszxsj : dayjs(this.kszxsj).format('YYYY-MM-DD HH:mm:ss'),
                zxzzsj:"9999-12-30 00:00:00",
                yzbz:this.yzbz,
                gyksid:this.selectedGyZxks == null? '':this.selectedGyZxks.fksid,
                gyxz : this.zxxz,
                zuhao : this.zuhao,
                disu : this.disu,
                zlfaid:0,
                ypyf:this.ypyf,
                fhybxz : this.fhybxz,
                yppcid : this.yppcid,
                fubiaoid:0,
                bfzbz:this.isBingFaZheng?1:0,
                pishi:"",
            }
            yizhu_temp.yizhucontent.push(yizhucontent_item);
            this.loading = true;
            const response = await this.$axios.post('/menzhenyizhu/yiZhuJianCha',yizhu_temp);
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    console.log(result.result);
                    // 删除原有数据
                    for(let i = this.yiZhuContentList.length-1;i>=0;i--){
                        if(this.yiZhuContentList[i].yzdid == this.yizhudan.id){
                            this.yiZhuContentList.splice(i,1);
                            
                        }
                    }
                    for(let i=0;i<yizhu_temp.yizhucontent.length;i++){
                        this.yiZhuContentList.push(yizhu_temp.yizhucontent[i]);
                    }

                    let flag = await this.shengChengYiZhuFeiYong(0);
                    if(flag){
                        flag = await this.shengChengYiZhuFeiYong(1);
                        if(!flag){
                            console.log("生成费用失败");
                        }
                    }else{
                        console.log("生成医嘱失败");
                    }
                    
                    //添加医嘱单
                    let haveYiZhuDan = false;
                    for(let i=0;i<this.yiZhuDanList.length;i++){
                        if(this.yiZhuDanList[i].id == this.yizhudan.id){
                            haveYiZhuDan = true;
                            break;
                        }
                    }
                    if(!haveYiZhuDan){
                        this.yiZhuDanList.push(this.yizhudan);
                    }

                    this.clearContent();
                    this.$refs['yiZhuContent'].focus();



                }else{

                }
            }
            this.loading = false;

        },

        //生成医嘱或费用明细
        async shengChengYiZhuFeiYong(flag){

            let yizhu_temp = {
                yizhucontent:[],
                flag:flag,
                brid:this.bingRen.fbrid,
                jzid:this.bingRen.fjzid,
                kzksid:this.keshiId,
            }

            
            if(this.selectedGytj != null){ //给药途径加入医嘱内容
                this.selectedGytj.lsid = -this.lsid;
                let yizhucontent_gytj = {
                    lsid:-this.lsid,
                    lsxgid:0,
                    yzdid: this.yizhudan.id,
                    cixu:0,
                    zllx:this.selectedGytj.fflid,
                    ylxmid:this.selectedGytj.fxmid,
                    jcbw:'', 
                    sfxmid:0,
                    jiliang:0,
                    danliang:0,
                    shuliang:this.gycs,
                    yizhu : this.selectedGytj.fxmname,
                    zxksid : this.keshiId ,
                    plcs : this.selectedZxpl.fpinci  ,
                    gytjbz : 1, 
                    gyxz : this.zxxz,
                    zuhao : this.zuhao,
                    yppcid : this.yppcid,
                    fubiaoid:this.selectedGytj.fubiaoid,
                }
                yizhu_temp.yizhucontent.push(yizhucontent_gytj);
            }

            this.selectedYiZhu.lsid = this.lsid;
            let yizhucontent_item = {
                lsid:this.lsid, lsxgid:-this.lsid,
                brksid:this.keshiId,zllx:this.selectedYiZhu.flxbm,ylxmid:this.selectedYiZhu.fxmid,
                bbbw:'',jcbw:'',sfxmid:this.selectedYiZhu.fsfxmid,jiliang:this.jiliang,danliang:this.danliang,
                shuliang:this.zongliang,yizhu:this.selectedYiZhu.fxmname + " " + this.selectedYiZhu.fguige,
                zxksid:this.selectedZxks.fksid,plcs:this.selectedZxpl.fpinci,
                gyksid:this.selectedGyZxks == null? '':this.selectedGyZxks.fksid,
                gyxz:this.zxxz,yzdid:this.yizhudan.id,
                fubiaoid:this.selectedYiZhu.fubiaoid,
                zuhao:this.zuhao,yppcid:this.yppcid,gytjbz:0,cixu:1,
            }
            yizhu_temp.yizhucontent.push(yizhucontent_item);

            const response = await this.$axios.post('/menzhenyizhu/shengChengFeiYong',yizhu_temp);
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    let resultList = result.result;
                    if(flag == 0){ //生成医嘱
                        this.zuhao++;
                        this.lsid++;
                        for(let i=0;i<this.yiZhuContentList.length;i++){
                            for(let j=0;j<resultList.length;j++){
                                // 更新医嘱附表ID
                                if(this.yiZhuContentList[i].ylxmid == resultList[j].ylxmid &&
                                 this.yiZhuContentList[i].lsid == resultList[j].lsid){
                                    this.yiZhuContentList[i].fubiaoid = resultList[j].fubiaoid;
                                }
                            }
                        }
                        // 更临时医嘱附表ID
                        for(let j=0;j<resultList.length;j++){
                            if(this.selectedGytj != null && this.selectedGytj.fxmid == resultList[j].ylxmid && this.selectedGytj.lsid == resultList[j].lsid){
                                this.selectedGytj.fubiaoid = resultList[j].fubiaoid;
                            }
                            if(this.selectedYiZhu.fxmid == resultList[j].ylxmid && this.selectedYiZhu.lsid == resultList[j].lsid){
                                this.selectedYiZhu.fubiaoid = resultList[j].fubiaoid;
                            }
                        }
                    }

                    if(flag == 1){ //生成费用
                        for(let i=0;i<resultList.length;i++){
                            this.feiYongList.push(resultList[i]);
                        }
                    }

                    return true;
                }else{
                    
                }
            }
            return false;
        },

        //确认医嘱
        async sureYiZhu(){
            let yizhu_temp = {
                yizhudan:[],
                zhenduan:[],
                yizhucontent:[],
                shoufeixiangmu:[],
                shenqingdan:[],
                shoushurenyuan:[],
                guahaobingli:[],
                brid:this.bingRen.fbrid,
                jzid:this.bingRen.fjzid,
                kzksid:this.keshiId,
            }

            //医嘱单
            yizhu_temp.yizhudan = this.yiZhuDanList;

            //诊断
            for(let i=0;i<this.yiZhuDanList.length;i++){
                for(let j=0;j<this.zhenDuanList.length;j++){
                    let zhenduan_item = {
                        yzdid : this.yiZhuDanList[i].id,
                        zdcx : j+1,
                        cbzc:1,
                        xyzy:0,
                        jbid: this.zhenDuanList[j].ficdid,
                        jbname: this.zhenDuanList[j].ficdmc,
                        icdbm:this.zhenDuanList[j].ficdbm,
                        yizhen:0,
                        zcbz: this.zhenDuanList[j].fzybz
                    }
                    yizhu_temp.zhenduan.push(zhenduan_item);
                }
            }

            //医嘱内容
            yizhu_temp.yizhucontent = this.yiZhuContentList;

            //收费项目
            yizhu_temp.shoufeixiangmu = this.feiYongList;

            //申请单

            //手术人员

            const response = await this.$axios.post('/menzhenyizhu/queRenYiZhu',yizhu_temp);
            if(response.data){
                let result = response.data;
                console.log(result);
                if(result.code == 0){
                    
                }else{

                }
            }

        }


    },
    computed:{
        ...mapState(['userInfo']),
        showMask(){
            if (this.showJiBingFlag || this.showYiZhuFlag || this.showGytjFlag || this.showZxplFlag
                || this.showYymdFlag || this.showYzbzFlag || this.showZxksFlag || this.showGyZxksFlag
            ){
                return true;
            }else{
                return false;
            }
        },
        //给药次数=天数x频次
        gycs(){
            if(this.selectedZxpl != null){
                return this.selectedZxpl.fpinci * this.tianshu;
            }else{
                return 0;
            }
        },
        //总量
        zongliang(){
            let zong = 0;
            if (this.jiliang == '' || this.tianshu == '' || this.selectedZxpl == null){
                return zong;
            }else{
                const a = new Decimal(this.jiliang);
                const b = new Decimal(this.jiliangStep);
                const c = new Decimal(this.tianshu);
                const d = new Decimal(this.selectedZxpl.fpinci);
                zong = a.mul(c).mul(d).div(b).ceil().toNumber();
            }
            return zong;
        },
        //单量
        danliang(){
            if(this.jiliang == '' || this.jiliangStep == ''){
                return 0;
            }
            const a = new Decimal(this.jiliang);
            const b = new Decimal(this.jiliangStep);
            return a.div(b).toNumber();
        },
        //药品用法
        ypyf(){
            if(this.selectedYiZhu != null && this.selectedZxpl != null){
                return this.selectedGytj.fxmname + ","+this.selectedZxpl.fpcname + "/"+this.tianshu+"日";
            }else{
                return "";
            }
        }

    },
    watch:{
        show(val){
            this.showFlag = true;
            this.kszxsj = new Date();
            this.getYiZhuDanID();
            this.kzks = this.keshi;
            this.kzys = this.userInfo.name;
        },
        jiliang(newval,oldval){
            if(isNaN(newval) ){
                this.jiliang = oldval;
            }
        },
        tianshu(newval,oldval){
            if(isNaN(newval) ){
                this.tianshu = oldval;
            }
        },
        disu(newval,oldval){
            if(isNaN(newval) ){
                this.disu = oldval;
            }
        },
    }
   

}
</script>


<style scoped>
.ghcell{width:300px;display: inline-block;vertical-align:middle;}
.highlighted{background-color: #cceeff}
.v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td, .v-table > .v-table__wrapper > table > tfoot > tr > th{
	padding:0 3px;height: 30px;
}
.hover-bg-blue:hover{background-color: #cceeff}
.zhezhao{position: absolute;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.2);}
:deep(.v-field) {  --v-field-padding-start:6px;  --v-field-padding-end:6px;}
:deep(.v-field.v-field--appended){--v-field-padding-end:0}
:deep(.v-field--appended){padding-inline-end:0;}
:deep(input){font-size:14px;}
:deep(.v-field__input){font-size:14px;}
.zengjia:hover{color:rgb(var(--v-theme-primary)) !important}
.jianshao:hover{color:rgb(var(--v-theme-primary)) !important}
</style>

