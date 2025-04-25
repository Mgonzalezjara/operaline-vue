<template>
  <div v-if="pageData">
    <h1>{{ pageData.title }}</h1>
    <p>{{ pageData.subtitle }}</p>

    <form @submit.prevent="handleLogin">
      <input v-model="identifier" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Passwort" />
      <button type="submit">Login →</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>
      {{ pageData.no_account_message }} →
      <router-link to="/register">Registrierung</router-link>
    </p>
  </div>

  <div v-else class="loading">Lade Seite...</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const pageData = ref<any>(null)

const identifier = ref('')
const password = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const fetchPageData = async () => {
  try {
    const res = await fetch(`http://localhost:1337/api/login?populate=*&locale=${locale.value}`)
    const data = await res.json()
    pageData.value = data.data
  } catch (err) {
    console.error('Error fetching login content:', err)
  }
}

const handleLogin = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await fetch('http://localhost:1337/api/auth/local/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: identifier.value,
        password: password.value,
      }),
    })

    const result = await res.json()

    if (res.ok) {
      successMessage.value = 'Login erfolgreich!'
      // Aquí podrías guardar el token, redirigir, etc.
    } else {
      errorMessage.value = result?.message?.[0]?.messages?.[0]?.message || 'Login fehlgeschlagen.'
    }
  } catch (err) {
    errorMessage.value = 'Serverfehler beim Login.'
  }
}

onMounted(fetchPageData)
watch(locale, fetchPageData)
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
button {
  background: #c82333;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}
.success {
  color: green;
}
.error {
  color: red;
}
.loading {
  text-align: center;
  margin-top: 2rem;
}
</style>
