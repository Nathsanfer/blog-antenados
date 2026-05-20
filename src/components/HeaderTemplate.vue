<script setup>
// Importa as dependências necessárias
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useSupabase } from '../composables/useSupabase';
import { useRouter } from 'vue-router';

// Obtém a instância do Supabase e do roteador
const { supabase } = useSupabase();
const router = useRouter();

// Variável reativa para controlar o estado de autenticação
const isAuthenticated = ref(false);

// Verifica a sessão do usuário ao montar o componente e escuta mudanças de autenticação
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  isAuthenticated.value = !!session;

  // Escuta mudanças de autenticação
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    isAuthenticated.value = !!session;
  });

  // Limpa o listener quando o componente é desmontado
  onBeforeUnmount(() => {
    subscription?.unsubscribe();
  });
});

// Função para lidar com o logout do usuário
const logout = async () => {
  await supabase.auth.signOut();
  isAuthenticated.value = false;
  router.push('/');
};
</script>

<template>
  <div class="decoration"></div>
  <header class="header">
    <div class="logo-header">
      <h3 class="title">Antenados</h3>
    </div>

    <nav class="navigation-header">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/blog" class="nav-link">Blog</router-link>
      <router-link v-if="isAuthenticated" to="/criacao" class="nav-link">Criações</router-link>
    </nav>

    <div class="auth-section">
      <router-link v-if="!isAuthenticated" class="link" to="/login">
        <button class="login-button">Acesso Professor</button>
      </router-link>
      <div v-else class="profile-section">
        <router-link to="/perfil" class="link">
          <button class="profile-button">Meu Perfil</button>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== Faixa Decorativa ===== */
.decoration {
  width: 100%;
  height: 8px;
  background: linear-gradient(
    90deg,
    var(--pastel-orange),
    var(--pastel-green),
    var(--pastel-blue),
    var(--pastel-pink)
  );
}

/* ===== Header ===== */
.header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 40px;
  justify-content: space-between;
}

.logo-header {
  display: flex;
  align-items: center;
}

.title {
  font-size: 29px;
  font-weight: 500;
  font-family: var(--secondary-font);
}

/* ===== Navegação ===== */
.navigation-header {
  display: flex;
  gap: 10rem;
}

.nav-link {
  position: relative; /* importante */
  display: inline-block; /* importante para o ::after acompanhar o texto */
  text-decoration: none;
  color: black;
  font-family: var(--primary-font);
  font-size: 14px;
  padding-bottom: 6px;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  border-radius: 999px;
  background-color: var(--color-green);
  transition: width 0.3s ease;
}     

.nav-link.router-link-exact-active::after {
  width: 100%;
}

.link {
  text-decoration: none;
  color: black;
  font-family: var(--primary-font);
  font-size: 14px;
}

/* ===== Botão de Login - Não Autenticado ===== */
.login-button {
  padding: 8px 45px;
  background-color: var(--color-green);
  color: white;
  border-radius: 20px;
  border: navajowhite;
  cursor: pointer;
}

/* ===== Botão para Perfil - Autenticado ===== */
.profile-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.profile-button {
  padding: 8px 45px;
  background-color: var(--color-green);
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-family: var(--primary-font);
}

/* ===== Botão de Logout - Autenticado ===== */
.logout-button {
  padding: 8px 30px;
  background-color: #da4167;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-family: var(--primary-font);
}

/* ============================
   RESPONSIVE BREAKPOINTS
   ============================ */

@media (max-width: 848px) {
  .title {
    font-size: 20px;
  }

  .navigation-header {
    gap: 5rem;
  }

  .nav-link {
    font-size: 12px;
  }

  .login-button {
    padding: 6px 20px;
    font-size: 12px;
  }

  .profile-button {
    padding: 6px 20px;
    font-size: 12px;
  }

  .logout-button {
    padding: 6px 15px;
    font-size: 12px;
  }

  .profile-section {
    gap: 0.5rem;
  }
}

@media (max-width: 520px) {
  .header {
    padding: 10px 20px;
  }

  .title {
    font-size: 16px;
  }

  .navigation-header {
    gap: 2rem;
  }

  .nav-link {
    font-size: 10px;
  }

  .login-button {
    padding: 6px 10px;
    font-size: 10px;
  }

  .profile-button {
    padding: 6px 10px;
    font-size: 10px;
  }

  .logout-button {
    padding: 6px 8px;
    font-size: 10px;
  }

  .profile-section {
    gap: 0.3rem;
  }
}

@media (max-width: 410px) {
  .header {
    padding: 5px 20px;
  }
  
  .title {
    font-size: 14px;
  }

  .nav-link {
    font-size: 9px;
  }

  .nav-link::after {
    height: 1px;
  }

  .login-button {
    padding: 6px 8px;
    font-size: 8px;
  }

  .profile-button {
    padding: 6px 8px;
    font-size: 8px;
  }

  .logout-button {
    padding: 6px 6px;
    font-size: 8px;
  }

  .profile-section {
    gap: 0.2rem;
  }
}
</style>
