<template>
  <div class="login-page">
    <h1>소셜 로그인 테스트</h1>
    <div class="social-login-buttons">
      <a :href="kakaoLoginUrl" class="social-btn kakao-btn">
        카카오 로그인
      </a>
      <a :href="naverLoginUrl" class="social-btn naver-btn">
        네이버 로그인
      </a>
      <a :href="googleLoginUrl" class="social-btn google-btn">
        구글 로그인
      </a>
    </div>
    
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      message: '',
      messageType: '',
      baseUrl: 'http://localhost:8080'
    }
  },
  computed: {
    kakaoLoginUrl() {
      return `${this.baseUrl}/oauth2/authorization/kakao`
    },
    naverLoginUrl() {
      return `${this.baseUrl}/oauth2/authorization/naver`
    },
    googleLoginUrl() {
      return `${this.baseUrl}/oauth2/authorization/google`
    }
  },
  mounted() {
    // URL 파라미터에서 메시지 확인
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('message')
    const type = urlParams.get('type')
    
    if (message) {
      this.message = decodeURIComponent(message)
      this.messageType = type || 'info'
    }
  }
}
</script>