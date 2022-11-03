<template>
  <div id="userLayout">
    <div class="login_panel">
      <div class="login_panel_form">
        <div class="login_panel_form_title">
          <!-- <img
            class="login_panel_form_title_logo"
            :src="$GIN_VUE_ADMIN.appLogo"
            alt
          > -->
          <p class="login_panel_form_title_p">{{ $GIN_VUE_ADMIN.appName }}</p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginFormData"
          :rules="rules"
          :validate-on-rule-change="false"
          @keyup.enter="submitForm"
        >
          <el-form-item prop="phone">
            <el-input
              v-model="loginFormData.phone"
              placeholder="请输入用户名"
            >
              <template #suffix>
                <span class="input-icon">
                  <el-icon>
                    <user />
                  </el-icon>
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginFormData.password"
              :type="lock === 'lock' ? 'password' : 'text'"
              placeholder="请输入密码"
            >
              <template #suffix>
                <span class="input-icon">
                  <el-icon>
                    <component
                      :is="lock"
                      @click="changeLock"
                    />
                  </el-icon>
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%;"
              @click="submitForm"
            >登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
}
</script>

<script setup>
import { checkDB } from '@/api/initdb'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/pinia/modules/user'
const router = useRouter()
// 验证函数
const checkUsername = (rule, value, callback) => {
  if (value.length < 5) {
    return callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const checkPassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

// 登录相关操作
const lock = ref('lock')
const changeLock = () => {
  lock.value = lock.value === 'lock' ? 'unlock' : 'lock'
}

const loginForm = ref(null)
const picPath = ref('')
const loginFormData = reactive({
  phone: '18201225281',
  password: '123456',
})
const rules = reactive({
  phone: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
})

const userStore = useUserStore()
const login = async() => {
  return await userStore.LoginIn(loginFormData)
}
const submitForm = () => {
  loginForm.value.validate(async(v) => {
    if (v) {
      const res = await login()
    } else {
      ElMessage({
        type: 'error',
        message: '请正确填写登录信息',
        showClose: true,
      })
      return false
    }
  })
}

// 跳转初始化
const checkInit = async() => {
  const res = await checkDB()
  if (res.code === 0) {
    if (res.data?.needInit) {
      userStore.NeedInit()
      router.push({ name: 'Init' })
    } else {
      ElMessage({
        type: 'info',
        message: '已配置数据库信息，无法初始化',
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import "@/style/newLogin.scss";
</style>
