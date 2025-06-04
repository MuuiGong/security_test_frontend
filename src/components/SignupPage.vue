<template>
  <div class="signup-page">
    <h1>소셜 회원가입</h1>

    <div class="back-to-login">
      <button @click="goToLogin" class="back-btn">← 로그인 화면으로 돌아가기</button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            v-model="formData.nickname"
            required
            maxlength="20"
          />
        </div>

        <div class="form-group">
          <label for="birthday">생일:</label>
          <input
            type="date"
            id="birthday"
            v-model="formData.birthday"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">이메일:</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? '처리중...' : '회원가입 완료' }}
        </button>
      </form>

      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignupPage',
  data() {
    return {
      formData: {
        nickname: '',
        birthday: '',
        email: ''
      },
      isLoading: false,
      message: '',
      messageType: ''
    }
  },
  mounted() {
    // URL 파라미터에서 소셜 로그인 정보 추출
    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')

    // 백엔드에서 넘어오는 추가 파라미터들도 확인
    const socialId = urlParams.get('socialId') || urlParams.get('social_id')
    const provider = urlParams.get('provider')
    const name = urlParams.get('name')

    if (email) {
      this.formData.email = decodeURIComponent(email)
    }

    // 소셜 로그인 정보를 localStorage에 임시 저장
    const socialData = {}
    if (socialId) socialData.socialId = socialId
    if (provider) socialData.provider = provider
    if (name) socialData.name = name

    if (Object.keys(socialData).length > 0) {
      localStorage.setItem('socialSignupData', JSON.stringify(socialData))
    }

    console.log('Signup page loaded with:', { email, socialId, provider, name })
    console.log('Full URL params:', Object.fromEntries(urlParams))
  },
  methods: {
    goToLogin() {
      // localStorage 정리
      localStorage.removeItem('socialSignupData')
      // 로그인 페이지로 이동
      this.$router.push('/')
    },
    async handleSignup() {
      this.isLoading = true
      this.message = ''

      try {
        const socialData = JSON.parse(localStorage.getItem('socialSignupData') || '{}')
        const signupData = {
          ...this.formData,
          socialId: socialData.socialId,
          provider: socialData.provider
        }

        console.log('Sending signup data:', signupData)

        // headers 객체에서 X-XSRF-TOKEN을 수동으로 추가하는 부분은 여전히 필요 없습니다.
        // 인터셉터가 자동으로 추가해 줄 것이기 때문입니다.
        const response = await axios.post('http://localhost:8080/auth/social/register', signupData, {
          withCredentials: true // 이 부분은 유지
        })

        console.log('Signup response:', response.data)

        this.message = '회원가입이 완료되었습니다!'
        this.messageType = 'success-message'

        localStorage.removeItem('socialSignupData')

        setTimeout(() => {
          this.$router.push('/home')
        }, 2000)

      } catch (error) {
        console.error('Signup error:', error)
        this.message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
        this.messageType = 'error-message'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>