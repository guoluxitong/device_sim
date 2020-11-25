<template>
  <div>
    <div  class="app-container">
      <el-row class="app-query">
        <el-col :span="5">
          <el-input clearable v-model="sim.simNo" placeholder="SIM卡号"  ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select clearable v-model="sim.lifecycle" placeholder="生命周期">
            <el-option
              style="width: 130px"
              v-for="item in lifecycleArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select clearable v-model="sim.state" placeholder="状态">
            <el-option
              style="width: 130px"
              v-for="item in statusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select clearable v-model="sim.cardState" placeholder="物联卡状态">
            <el-option
              style="width: 130px"
              v-for="item in careStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button  type="primary" icon="el-icon-search" @click="getImei">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%">
        <el-table-column align="left" :show-overflow-tooltip="true" label="SIM卡号">
          <template slot-scope="scope">
            <span>{{scope.row.simNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.state | dictionaryValueFieldFilter(statusArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="生命周期">
          <template slot-scope="scope">
            <span>{{scope.row.lifecycle | dictionaryValueFieldFilter(lifecycleArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="物联卡状态">
          <template slot-scope="scope">
            <span>{{scope.row.cardState | dictionaryValueFieldFilter(careStatusArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="开户日期">
          <template slot-scope="scope">
            <span>{{dateFormat(scope.row.openingDate) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {formatDateTime} from '@/utils/date'
  import {getSim} from '@/api/simcore'
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
        sim:{
          simNo: null,
          state: null,
          openingDate:null,
          cardState: null,
          lifecycle: null,
        },
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        statusArray:[
          {
            value: '00', label: '在线',
          },
          {
            value: '01', label: '离线',
          },
        ],
        careStatusArray:[
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
        if(this.sim.simNo!=null){
          this.sim.simNo='898607B61518900'+ this.sim.simNo
        }
        getSim(this.sim).then(response => {
            this.list=response.data
        })
        this.currentPage1=1
      },
      handleSizeChange1: function(pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage);
      },
      handleCurrentChange1: function(currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      },
    }
  }
</script>
