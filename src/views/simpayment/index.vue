<template>
  <div>
    <div  class="app-container">
      <el-row class="app-query">
        <el-col :span="5">
          <el-input clearable v-model="sim.deviceNo" placeholder="设备编号"  ></el-input>
        </el-col>
        <el-col :span="5">
          <el-input clearable v-model="sim.iMEI" placeholder="SIM卡号"  ></el-input>
        </el-col>
        <el-col :span="5">
          <el-input clearable v-model="sim.openId" placeholder="openId"  ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select clearable v-model="sim.status" placeholder="状态">
            <el-option
              style="width: 130px"
              v-for="item in statusArray"
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
      <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" @row-contextmenu="openTableMenu" border fit highlight-current-row style="width: 120%">
        <el-table-column align="left" :show-overflow-tooltip="true" label="设备编号">
          <template slot-scope="scope">
            <span>{{scope.row.deviceNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="SIM卡号">
          <template slot-scope="scope">
            <span>{{scope.row.iMEI}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==null">无</span>
            <span>{{scope.row.status | dictionaryValueFieldFilter(statusArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="OpenId">
          <template slot-scope="scope">
            <span>{{scope.row.openId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="到期时间">
          <template slot-scope="scope">
            <span v-if="scope.row.dueTime==null">无</span>
            <span v-if="scope.row.dueTime!=null">{{dateFormat(scope.row.dueTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      </menu-context>
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
    <div class="el-dialog-customer">
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="30%">
        <el-form  label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-form-item label="状态">
            <el-select clearable class="filter-item" v-model="sim.status"  style="width: 100%">
              <el-option v-for="item in statusArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editData">确认</el-button>
          <el-button icon="el-icon-back" type="warning" @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {formatDateTime} from '@/utils/date'
  import {getSimPayment,editSimPayment} from '@/api/simpayment'
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
          id:null,
          iMEI: null,
          status: null,
          openId:null,
          deviceNo: null,
          dueTime: null,
        },
        dialogFormVisible:false,
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        statusArray:[
          {
            value: 0, label: '未充值',
          },
          {
            value: 1, label: '已充值',
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
      this.getImei()
    },
    methods: {
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(row,event);
      },
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
        if(this.sim.iMEI!=null&&this.sim.iMEI!=''){
          this.sim.iMEI='898607B61518900'+ this.sim.iMEI
        }else{
          this.sim.iMEI=null
        }
        getSimPayment(this.sim).then(response => {
            this.list=response.data.data
        })
        this.currentPage1=1
        this.sim={
          id:null,
          iMEI: null,
          status: null,
          openId:null,
          deviceNo: null,
          dueTime: null,
        }
      },
      handleUpdate(row) {
        this.sim.status = row.status
        this.sim.id = row.id
        this.dialogFormVisible = true
      },
      editData(){
        editSimPayment(this.sim).then(response => {
          this.dialogFormVisible = false
          this.getImei()
        })
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
