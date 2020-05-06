<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="药品名称" clearable />
      <el-input v-model="listQuery.code" style="width: 200px;" class="filter-item" placeholder="药品代码" clearable />
      <el-button type="primary" class="filter-item" @click="handleFilter">查询</el-button>
      <el-button type="primary" class="filter-item" @click="showAddDialog = true">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" highlight-current-row stripe border height="calc(100vh - 180px)">
      <el-table-column prop="name" label="药品名称" />
      <el-table-column prop="code" label="药品代码" />
      <el-table-column prop="price" label="单价(元/Kg)" sortable />
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    <drug-price-add :show.sync="showAddDialog" @saved="handleFilter" />
    <drug-price-edit :show.sync="showEditDialog" :data="currentRow" @saved="handleFilter" />
  </div>
</template>

<script>
import * as drugPriceApi from '@/api/drugPrice.js'
import DrugPriceAdd from '@/views/drugPrice/add.vue'
import DrugPriceEdit from '@/views/drugPrice/edit.vue'
import Pagination from '@/components/Pagination'
export default {
  components: { DrugPriceAdd, DrugPriceEdit, Pagination },
  data() {
    return {
      showAddDialog: false,
      showEditDialog: false,
      listLoading: false,
      total: 0,
      listQuery: {
        name: '',
        code: '',
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
      drugPriceApi.getList(this.listQuery).then(response => {
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
    handleEdit(index, row) {
      this.currentRow = row
      this.showEditDialog = true
    },
    // 删除属性操作
    delRow(index, row) {
      this.$confirm('确认删除该药品吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          drugPriceApi.del(row.id).then(() => {
            this.getList()
            this.$message.success('删除成功')
          })
        })
    }
  }
}
</script>
