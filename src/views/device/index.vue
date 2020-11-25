<template>
  <div>
  <div  class="app-container">
    <el-row class="app-query">
      <el-col :span="4">
      <el-input  style="width: 140px" clearable v-model="deviceNo" placeholder="设备编号"  ></el-input>
      </el-col>
      <el-col :span="3">
      <el-button  type="primary" icon="el-icon-search" @click="getImei">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%">
      <el-table-column align="left" :show-overflow-tooltip="true" label="SIM卡号">
        <template slot-scope="scope">
          <span>{{scope.row.iMEI}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.STATUS | dictionaryValueFieldFilter(statusArray)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="生命周期">
        <template slot-scope="scope">
          <span>{{scope.row.lifecycle | dictionaryValueFieldFilter(lifecycleArray)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="开户时间">
        <template slot-scope="scope">
          <span>{{scope.row.openTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="系统状态">
        <template slot-scope="scope">
          <span>{{scope.row.systemStatus | dictionaryValueFieldFilter(systemStatusArray)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="状态变更时间">
        <template slot-scope="scope">
          <span v-if="scope.row.stateChangesDate==null">无</span>
          <span v-if="scope.row.stateChangesDate!=null">{{dateFormat(scope.row.stateChangesDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="余额（元）">
        <template slot-scope="scope">
          <span>{{scope.row.balance}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  </div>
</template>
<script>
  import {formatDateTime} from '@/utils/date'
  import {getSim} from '@/api/simcore'
  import {getImei,getuserstatusrealsingle,querycardlifecycle,querycardopentime,balancerealsingle} from '@/api/device'
  function dictionaryValueFilter(dictionaryValue, value) {
    const dictionaryValueItem = dictionaryValue.filter(item => {
      return item.value == value;
    });
    return dictionaryValueItem[0];
  }

  export default {
    data() {
      return {
        list:[] ,
        coreList:{
          iMEI: '',
          STATUS: '',
          lifecycle: '',
          openCoretime: '',
          openTime: '',
          balance: '',
          stateChangesDate:'',
          systemStatus:''
        },
        sim:{
          simNo: null,
          state: null,
          openingDate:null,
          balance: null,
          stateChangesDate: null,
        },
        statusArray:[
          {
         value: '00', label: '正常',
          },
          {
            value: '01', label: '单向停机',
          },
          {
            value: '02', label: '停机',
          },
          {
            value: '03', label: '预销号',
          },
          {
            value: '04', label: '销号',
          },
          {
            value: '05', label: '过户',
          },
          {
            value: '06', label: '休眠',
          },
          {
            value: '07', label: '待激活',
          },
          {
            value: '99', label: '号码不存在',
          },
        ],
        lifecycleArray: [
          {
            value: '00', label: '正式期',
          },
          {
            value: '01', label: '测试期',
          },
          {
            value: '02', label: '沉默期',
          },
          {
            value: '03', label: '其他',
          },
        ],
        systemStatusArray:[
          {
            value: '00', label: '正常',
          },
          {
            value: '01', label: '代缴费',
          },
          {
            value: '02', label: '欠费',
          },
          {
            value: '03', label: '停机',
          },
          {
            value: '04', label: '销号',
          },
        ],
        deviceNo: '',
        iccid:'',
        listLoading:false
      }
    },
    filters: {
      dictionaryValueFieldFilter(value, dictionaryValueArray) {
        if (dictionaryValueFilter(dictionaryValueArray, value))
          return dictionaryValueFilter(dictionaryValueArray, value).label;
        return;
      }
    },
    created() {
    },
    methods: {
      dateFormat: function(time) {
        var date = new Date(time);
        var year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return (year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
        );
      },
      getImei(){
        this.list.splice(0,1)
        getImei(this.deviceNo).then(response => {
          this.coreList.iMEI=response.data.data.iMEI
         if(this.coreList.iMEI){
           getuserstatusrealsingle(this.coreList.iMEI).then(data => {
             if(data.data.status==0){
               this.coreList.STATUS=data.data.result[0].STATUS
             }else {
               return
             }
           })
           querycardlifecycle(this.coreList.iMEI).then(data => {
             if(data.data.status==0){
               this.coreList.lifecycle=data.data.result[0].lifecycle
               this.coreList.openCoretime=data.data.result[0].opentime
             }else {
               return
             }
           })
           querycardopentime(this.coreList.iMEI).then(data => {
             if(data.data.status==0){
               this.coreList.openTime=data.data.result[0].openTime
             }else {
               return
             }

           })
           this.sim.simNo=this.coreList.iMEI
           getSim(this.sim).then(response => {
             this.coreList.balance=response.data[0].balance
             this.coreList.stateChangesDate=response.data[0].stateChangesDate
             this.coreList.systemStatus=response.data[0].state
           })
           this.list.push(this.coreList)
         }else {
            return
         }
          console.log( this.list)
        })

      }
    }
  }
</script>
