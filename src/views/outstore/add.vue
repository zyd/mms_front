<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" title="填写出库单" width="1000px" :fullscreen="true" @open="handleOpen" @close="handleClose">
    <el-container>
      <el-aside width="45vw">
        <el-row>
          <el-col>
            <el-table ref="table" :data="outstore.details" border highlight-current-row stripe height="calc(100vh - 120px)">
              <el-table-column type="index" align="center" width="50" />
              <el-table-column prop="name" label="药品名称" />
              <el-table-column prop="price" label="单价" />
              <el-table-column prop="weight" label="重量（克）" />
              <el-table-column label="金额（元）">
                <template slot-scope="scope">
                  <span>{{ getMoney(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, outstore.details)">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <el-form ref="form" :model="outstore" :rules="formRules">
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="客户名称" prop="customerName">
                <el-input v-model="outstore.customerName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="电话/手机" prop="phone">
                <el-input v-model="outstore.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="客户地址" prop="addr">
                <el-input v-model="outstore.addr" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="备注" prop="note">
                <el-input v-model="outstore.note" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <hr>
        <el-form ref="tempForm" :model="tempRow" :rules="formRules">
          <el-row style="margin-top: 20px; margin-bottom: 5px;">
            <el-col :span="20">下面的表单可以重复录入数据</el-col>
            <el-col :span="4">回车添加新行</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-select ref="nameInput" v-model="tempRow.name" filterable placeholder="请选择药品" :clearable="true" style="width: 100%" @visible-change="getSelectList" @change="handleDrugChange">
                <el-option v-for="item in drugList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="75px" label="单价(元)" prop="price">
                <el-input v-model="tempRow.price" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="75px" label="重量(克)" prop="weight">
                <el-input ref="weightInput" v-model="tempRow.weight" @keyup.enter.native="addRow" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <p style="text-align:right">总重量：{{ totalWeight }} Kg</p>
        <p style="text-align:right">总金额：{{ totalPrice }} 元</p>
        <div style="margin-top:30px;float:right;">
          <el-button @click="visible = false">取 消</el-button>
          <el-button :loading="loading" type="primary" @click="save">确 定</el-button>
        </div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script>
import * as outstoreApi from '@/api/outstore'
import * as drugPriceApi from '@/api/drugPrice.js'
import { generateUid } from '@/utils/uniqueId.js'
const emptyRow = { name: '', priceId: null, price: null, priceChanged: false, weight: null, money: null }
export default {
  name: 'OutstoreAdd',
  props: {
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      visible: this.show,
      formLabelWidth: '80px',
      loading: false,
      drugList: [],
      tempRow: Object.assign({}, emptyRow),
      outstore: {
        formUid: null,
        customerName: '',
        phone: '',
        addr: '',
        note: '',
        totalWeight: null,
        totalPrice: null,
        details: []
      },
      formRules: {
        customerName: [{ required: true, message: '客户名称不能为空' }]
      }
    }
  },
  computed: {
    totalWeight() {
      if (this.outstore.details.length > 0) {
        const weights = this.outstore.details.map(row => row.weight ? Number.parseInt(row.weight) : null)
        return weights.reduce((total, num) => total + num) / 1000
      } else {
        return 0
      }
    },
    totalPrice() {
      if (this.outstore.details.length > 0) {
        const moneys = this.outstore.details.map(row => row.money)
        return moneys.reduce((total, num) => total + num)
      } else {
        return 0
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {
    handleOpen() {
      this.outstore.formUid = generateUid()
    },
    handleClose() {
      this.$emit('update:show', false)
      // 重置组件
      this.$refs.form.resetFields()
      this.$refs.tempForm.resetFields()
      this.outstore.details = []
    },
    handleDrugChange() {
      if (this.tempRow.name) {
        const price = this.tempRow.name.split('-').pop()
        const priceId = this.tempRow.name.split('-').shift()
        this.tempRow.price = price
        this.tempRow.priceId = priceId
        this.tempRow.weight = null
      } else {
        this.tempRow.price = null
        this.tempRow.priceId = null
        this.tempRow.weight = null
      }
    },
    getSelectList(value) {
      if (value) {
        drugPriceApi.getSelectList().then(rsp => { this.drugList = rsp })
      } else {
        this.$refs.weightInput.focus()
      }
    },
    addRow() {
      if (this.tempRow.weight == null) {
        return
      }
      const row = Object.assign({}, this.tempRow)
      const names = row.name.split('-')
      row.name = names[1]
      if (names[2] !== row.price) {
        this.$confirm(`【${row.name}】单价由 ${names[2]} 变为了 ${row.price} 是否要永久修改为当前单价？`, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          drugPriceApi.updatePrice({ id: names[0], price: row.price }).then(() => this.$message({
            type: 'success',
            message: '永久修改成功！'
          }))
        }).finally(() => {
          this.outstore.details.push(row)
          this.scrollToEnd()
          Object.assign(this.tempRow, emptyRow)
          this.$refs.nameInput.focus()
        })
      } else {
        this.outstore.details.push(row)
        this.scrollToEnd()
        Object.assign(this.tempRow, emptyRow)
        this.$refs.nameInput.focus()
      }
    },
    scrollToEnd() {
      window.setTimeout(() => { this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight }, 300)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    getMoney(row) {
      row.money = row.price * row.weight / 1000
      return row.money
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.tempRow.name && this.tempRow.price && this.tempRow.weight) {
            this.$message.warning('最后一行表单没有添加到左侧列表，若不需要点击下拉框右侧的×移除')
            return false
          }
          this.loading = true
          this.outstore.totalWeight = this.totalWeight
          this.outstore.totalPrice = this.totalPrice
          outstoreApi.save(this.outstore).then(rsp => {
            this.$message.success('出库成功')
            this.loading = false
            this.visible = false // 会自动触发handleClose
          }).catch(() => {
            this.loading = false
          }).finally(() => {
            this.$emit('saved') // 网络异常也要刷新index列表，因为有可能已经保存成功
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
