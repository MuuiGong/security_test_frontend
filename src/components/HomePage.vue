<template>
  <div class="home-page">
    <h1>환영합니다!</h1>
    <p>로그인이 성공적으로 완료되었습니다.</p>
    
    <div class="user-info" v-if="userInfo">
      <h3>사용자 정보:</h3>
      <p><strong>닉네임:</strong> {{ userInfo.nickname }}</p>
      <p><strong>이메일:</strong> {{ userInfo.email }}</p>
      <p><strong>생일:</strong> {{ userInfo.birthday }}</p>
    </div>
    
    <button @click="logout" class="logout-btn">로그아웃</button>
    <button @click="goToLogin" class="login-btn">로그인 페이지로</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
      userInfo: null
    }
  },
  async mounted() {
    await this.fetchUserInfo()
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get('http://localhost:8080/test', {
          withCredentials: true
        })
        this.userInfo = response.data
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    },
    async logout() {
      try {
        await axios.post('http://localhost:8080/auth/logout', {}, {
          withCredentials: true
        })
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        // 에러가 나도 로그인 페이지로 이동
        this.$router.push('/')
      }
    },
    goToLogin() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.logout-btn, .login-btn {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
}

.logout-btn:hover {
  background-color: #c82333;
}

.login-btn {
  background-color: #007bff;
  color: white;
}

.login-btn:hover {
  background-color: #0056b3;
}
</style>