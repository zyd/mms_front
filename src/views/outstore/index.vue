<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.customerName" style="width: 200px;" class="filter-item" placeholder="客户名称" clearable />
      <el-input v-model="listQuery.phone" style="width: 200px;" class="filter-item" placeholder="电话/手机号" clearable />
      <el-button type="primary" class="filter-item" @click="handleFilter">查询</el-button>
      <el-button type="primary" class="filter-item" @click="showAddDialog = true">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" highlight-current-row stripe border height="calc(100vh - 180px)">
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="phone" label="电话/手机号" width="100" />
      <el-table-column prop="addr" label="客户地址" />
      <el-table-column prop="totalWeight" label="合计(Kg)" width="100" sortable />
      <el-table-column prop="totalPrice" label="合计(元)" width="100" sortable />
      <el-table-column prop="outDate" label="出库日期" width="100" />
      <el-table-column prop="note" label="备注" width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button type="danger" size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    <outstore-add :show.sync="showAddDialog" @saved="handleFilter" />
    <outstore-view :show.sync="showViewDialog" :outid="currentRow.id" />
  </div>
</template>

<script>
import * as outstoreApi from '@/api/outstore.js'
import OutstoreAdd from '@/views/outstore/add.vue'
import OutstoreView from '@/views/outstore/view.vue'
import Pagination from '@/components/Pagination'
export default {
  components: { OutstoreAdd, OutstoreView, Pagination },
  data() {
    return {
      showAddDialog: false,
      showViewDialog: false,
      listLoading: false,
      total: 0,
      listQuery: {
        customerName: '',
        phone: '',
        page: 0,
        size: 10
      },
      list: [],
      currentRow: {}
    }
  },
  created() {
    this.handleFilter()
  },
  // 方法实现
  methods: {
    getList() {
      this.listLoading = true
      outstoreApi.getList(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 0
      this.getList()
    },
    // 修改对话框
    handleView(index, row) {
      this.currentRow = row
      this.showViewDialog = true
    },
    // 删除属性操作
    delRow(index, row) {
      this.$confirm('确认删除该出库单吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          outstoreApi.del(row.id).then(() => {
            this.getList()
            this.$message.success('删除成功')
          })
        })
    }
  }
}
</script>
