<template>
  <div class="register-page">
    <h1>Registrarse</h1>

    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="lastName" type="text" placeholder="Last name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="passwordConfirm" type="password" placeholder="Confirm password" required />
      <button type="submit">Register →</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()

const username = ref('')
const name = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const successMessage = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  // Validaciones básicas
  if (password.value.length < 8) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    // 1. Crear el usuario
    const registerRes = await fetch('http://localhost:1337/api/auth/local/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })

    const registerData = await registerRes.json()

    if (!registerRes.ok) {
      errorMessage.value = registerData?.error?.message || 'Error al registrarse.'
      return
    }

    const user = registerData.user
    const jwt = registerData.jwt

    console.log('✅ Usuario creado:', user)

    // 2. Crear el Singer asociado usando el JWT
    const slug = `${name.value.toLowerCase()}-${lastName.value.toLowerCase()}`.replace(/\s+/g, '-')

    const singerRes = await fetch('http://localhost:1337/api/singers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`, // ✅ Usamos el token
      },
      body: JSON.stringify({
        data: {
          name: name.value,
          last_name: lastName.value,
          slug: slug,
          users_permissions_user: user.id,
          locale: locale.value,
        },
      }),
    })

    if (!singerRes.ok) {
      const singerError = await singerRes.json()
      console.error('❌ Error creando Singer:', singerError)
      errorMessage.value = 'Error al crear el perfil de cantante.'
      return
    }

    successMessage.value = '✅ Registro exitoso. Ahora puedes iniciar sesión.'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error('❌ Error general en registro:', err)
    errorMessage.value = 'Error de servidor al registrarse.'
  }
}
</script>

<style scoped>
.register-page {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #f9f9f9;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  background: #c82333;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
}

.success {
  color: green;
  margin-top: 1rem;
  text-align: center;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
