<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" title="修改" width="40%" @open="handleOpen" @close="handleClose">
    <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
      <el-form-item label="药品名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="药品代码：" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="单价(元/Kg)：" prop="price">
        <el-input v-model="form.price" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as drugPriceApi from '@/api/drugPrice.js'
import pinyin from 'pinyin'
export default {
  name: 'DrugPriceEdit',
  props: {
    show: { type: Boolean, default: false },
    data: { type: Object, default: null }
  },
  data() {
    return {
      visible: this.show,
      loading: false,
      form: {
        id: '',
        code: '',
        name: '',
        price: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入药品代码', trigger: 'blur' }],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show
    },
    name(val) {
      this.form.code = pinyin(val, {
        style: pinyin.STYLE_FIRST_LETTER
      })
    }
  },
  methods: {
    handleOpen() {
      this.form = this.data
    },
    handleClose() {
      this.$emit('update:show', false)
      this.$refs.form.resetFields()
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          drugPriceApi.save(this.form).then(rsp => {
            this.$message.success('保存成功')
            this.loading = false
            this.visible = false
          }).catch(() => {
            this.loading = false
          }).finally(() => {
            this.$emit('saved')
          })
        }
      })
    }
  }
}
</script>
