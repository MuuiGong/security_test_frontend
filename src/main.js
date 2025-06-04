import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LoginPage from './components/LoginPage.vue'
import SignupPage from './components/SignupPage.vue'
import HomePage from './components/HomePage.vue'
import axios from 'axios' // ⭐ 1. axios import 추가

const routes = [
  { path: '/', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/auth/join', component: SignupPage },  // 백엔드 리다이렉트 경로
  { path: '/home', component: HomePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function getCsrfToken() {
  const name = "XSRF-TOKEN=";
  const decodedCookie = decodeURIComponent(document.cookie);
  console.log("DEBUG: All cookies from document.cookie:", decodedCookie); // ⭐ 추가
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      const token = c.substring(name.length, c.length);
      console.log("DEBUG: getCsrfToken found token:", token); // ⭐ 추가
      return token;
    }
  }
  console.log("DEBUG: getCsrfToken did NOT find XSRF-TOKEN."); // ⭐ 추가
  return "";
}

axios.interceptors.request.use(
  config => {
    if (config.method !== 'get' && config.method !== 'head') {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
        console.log("DEBUG: Axios Interceptor added X-XSRF-TOKEN:", csrfToken); // ⭐ 추가
      } else {
        console.warn("DEBUG: Axios Interceptor could not find CSRF token for header."); // ⭐ 추가
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const app = createApp(App)
app.use(router)
app.mount('#app')