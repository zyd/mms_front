<template>
  <div>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" title="查看出库单" width="1000px" :fullscreen="true" @open="handleOpen" @close="handleClose">
      <el-form ref="form" :model="outstore">
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="客户名称:">
              {{ outstore.customerName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="电话/手机:">
              {{ outstore.phone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="客户地址:">
              {{ outstore.addr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="备注:">
              {{ outstore.note }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col>
          <el-table :data="outstore.details" border>
            <el-table-column type="index" align="center" width="50" />
            <el-table-column prop="name" label="药品名称" />
            <el-table-column prop="price" label="单价" />
            <el-table-column prop="weight" label="重量（克）" />
            <el-table-column prop="money" label="金额（元）" />
          </el-table>
        </el-col>
      </el-row>
      <p style="text-align:right">总重量：{{ outstore.totalWeight }} Kg</p>
      <p style="text-align:right">总价格：{{ outstore.totalPrice }} 元</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="exportExcel">导 出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as outstoreApi from '@/api/outstore'
import * as FileSaver from 'file-saver'
import { parseTime } from '@/utils/index'
export default {
  name: 'OutstoreView',
  props: {
    show: { type: Boolean, default: false }, outid: { type: Number, default: null }
  },
  data() {
    return {
      visible: this.show,
      formLabelWidth: '110px',
      loading: false,
      outstore: {
        customerName: '',
        phone: '',
        addr: '',
        note: '',
        totalWeight: null,
        totalPrice: null,
        details: []
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
      outstoreApi.getOutstore(this.outid).then((out) => { this.outstore = out })
    },
    handleClose() {
      this.$emit('update:show', false)
      // 重置组件
      this.$refs.form.resetFields()
      this.outstore.details = []
    },
    exportExcel: function() {
      this.loading = true
      outstoreApi.exportExcel(this.outid).then(res => {
        const filename = '出库单_' + parseTime(new Date(), '{y}{m}{d}{h}{i}{s}') + '.xlsx'
        FileSaver.saveAs(res, filename)
        this.loading = false
      })
    }
  }
}
</script>
