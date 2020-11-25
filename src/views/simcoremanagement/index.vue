<template>
  <div>
    <div  class="app-container">
      <el-row class="app-query">
        <el-col :span="5">
          <el-input clearable v-model="sim.simNo" placeholder="SIM卡号"  ></el-input>
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
          <el-select clearable v-model="sim.topupState" placeholder="充值状态">
            <el-option
              style="width: 130px"
              v-for="item in topupStateArray"
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
        <el-table-column align="left" :show-overflow-tooltip="true" label="充值状态">
          <template slot-scope="scope">
            <span v-if="scope.row.topupState==null">无</span>
            <span v-if="scope.row.topupState!=null">{{scope.row.topupState | dictionaryValueFieldFilter(topupStateArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="余额">
          <template slot-scope="scope">
            <span>{{scope.row.balance}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="状态变更时间">
          <template slot-scope="scope">
            <span v-if="scope.row.stateChangesDate==null">无</span>
            <span v-if="scope.row.stateChangesDate!=null">{{dateFormat(scope.row.stateChangesDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="开户时间">
          <template slot-scope="scope">
            <span>{{dateFormat(scope.row.openingDate) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleUpdate">修改充值状态</menu-context-item>

      </menu-context>

      <div class="el-dialog-customer">
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="30%">
          <el-form  label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>

            <el-form-item label="是否充值">
              <el-select clearable class="filter-item" v-model="topupStateList.topupState"  style="width: 100%">
                <el-option v-for="item in topupStateArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editData">确认</el-button>
            <el-button icon="el-icon-back" type="warning" @click="dialogFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>


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
  import {getSim,editSim} from '@/api/simcore'
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
        dialogFormVisible:false,
        topupStateList:{
          topupState:null,
          simNo:null
        },
        sim:{
          simNo: null,
          state: null,
          topupState:null,
          openingDate:null,
          balance: null,
          stateChangesDate: null,
        },
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        topupStateArray:[
          {
            value: '0', label: '未充值',
          },
          {
            value: '1', label: '已充值',
          },

        ],
        statusArray:[
          {
            value: '00', label: '正常',
          },
          {
            value: '01', label: '待缴费',
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
      handleUpdate(row) {
        this.topupStateList.simNo=row.simNo
        this.dialogFormVisible = true
      },
      editData(){

        editSim(this.topupStateList).then(response => {
          if(data.data.code==0){
            this.dialogFormVisible = false
            this.$message({
              message: '成功',
              type: 'success'
            });
            this.getImei()
          }
        })
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
        if(this.sim.simNo!=null&&this.sim.simNo!=''){
          this.sim.simNo='898607B61518900'+ this.sim.simNo
        }else{
          this.sim.simNo=null
        }
        getSim(this.sim).then(response => {
            this.list=response.data
        })
        this.currentPage1=1
        this.sim={
          simNo: null,
          rawState: null,
          nowState: null,
          createDatetime: null,
        }
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
