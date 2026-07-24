<script setup>
// Importa as dependências necessárias
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useSupabase } from '../composables/useSupabase';
import { useRouter } from 'vue-router';

// Obtém a instância do Supabase e do roteador
const { supabase } = useSupabase();
const router = useRouter();

// Variáveis reativas
const isAuthenticated = ref(false);
const isMenuOpen = ref(false); // Controla o estado do menu mobile

// Verifica a sessão do usuário
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  isAuthenticated.value = !!session;

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    isAuthenticated.value = !!session;
  });

  onBeforeUnmount(() => {
    subscription?.unsubscribe();
  });
});

// Lógica de navegação mobile
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="decoration"></div>
  
  <header class="header">
    <div class="header-container">
      
      <div class="logo-header">
        <h3 class="title">Antenados</h3>
      </div>

      <nav class="navigation-header desktop-only">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/blog" class="nav-link">Blog</router-link>
        <router-link to="/galeria" class="nav-link">Galeria</router-link>
        <router-link v-if="isAuthenticated" to="/criacao" class="nav-link">Criações</router-link>
      </nav>

      <div class="auth-section desktop-only">
        <router-link v-if="!isAuthenticated" class="link" to="/login">
          <button class="login-button">Acesso Professor</button>
        </router-link>
        <div v-else class="profile-section">
          <router-link to="/perfil" class="link">
            <button class="profile-button">Meu Perfil</button>
          </router-link>
        </div>
      </div>

      <button class="hamburger-btn" :class="{ 'is-active': isMenuOpen }" @click="toggleMenu" aria-label="Menu">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </button>

    </div>
  </header>

  <transition name="fade">
    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
  </transition>

  <div class="mobile-drawer" :class="{ 'is-open': isMenuOpen }">
    <nav class="mobile-nav">
      <router-link to="/" class="mobile-link" @click="closeMenu">Home</router-link>
      <router-link to="/blog" class="mobile-link" @click="closeMenu">Blog</router-link>
      <router-link to="/galeria" class="mobile-link" @click="closeMenu">Galeria</router-link>
      <router-link v-if="isAuthenticated" to="/criacao" class="mobile-link" @click="closeMenu">Criações</router-link>
    </nav>

    <div class="mobile-auth">
      <router-link v-if="!isAuthenticated" to="/login" @click="closeMenu">
        <button class="login-button mobile-btn">Acesso Professor</button>
      </router-link>
      <router-link v-else to="/perfil" @click="closeMenu">
        <button class="profile-button mobile-btn">Meu Perfil</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>

.decoration {
  width: 100%;
  height: 6px;
  background: linear-gradient(
    90deg,
    var(--pastel-orange, #ffd1b3),
    var(--pastel-green, #b3ffcc),
    var(--pastel-blue, #b3e6ff),
    var(--pastel-pink, #ffb3e6)
  );
}

.header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 900;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.2rem 2rem;
}

.logo-header {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.title {
  font-size: 28px;
  font-weight: 500;
  font-family: var(--secondary-font);
  color: #222;
  margin: 0;
}

.navigation-header {
  flex: 2;
  display: flex;
  justify-content: center;
  gap: 4.5rem;
}

.auth-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #444;
  font-family: var(--primary-font);
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 4px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--color-green, #6dac7e);
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2.5px;
  border-radius: 2px;
  background-color: var(--color-green, #6dac7e);
  transition: width 0.3s ease;
}

.nav-link.router-link-exact-active::after {
  width: 100%;
}

.nav-link.router-link-exact-active {
  color: var(--color-green, #6dac7e);
}

.link {
  text-decoration: none;
}

.login-button, .profile-button {
  padding: 0.6rem 1.8rem;
  background-color: var(--color-green, #6dac7e);
  color: white;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--primary-font);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(109, 172, 126, 0.2);
}

.login-button:hover, .profile-button:hover {
  background-color: #5ea06e;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(109, 172, 126, 0.3);
}

.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1100;
  padding: 0;
}

.hamburger-btn .line {
  width: 100%;
  height: 3px;
  background-color: #222;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  transform-origin: left;
}

.hamburger-btn.is-active .line:nth-child(1) { transform: rotate(45deg); }
.hamburger-btn.is-active .line:nth-child(2) { opacity: 0; }
.hamburger-btn.is-active .line:nth-child(3) { transform: rotate(-45deg); }

.mobile-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 280px;
  max-width: 80vw;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 6rem 2rem 2rem;
  transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  z-index: 1000;
}

.mobile-drawer.is-open {
  right: 0;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-link {
  text-decoration: none;
  font-family: var(--secondary-font);
  font-size: 20px;
  color: #333;
  font-weight: 500;
  transition: color 0.2s;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.mobile-link.router-link-exact-active {
  color: var(--color-green, #6dac7e);
  border-bottom-color: var(--color-green, #6dac7e);
}

.mobile-auth {
  margin-top: auto;
  padding-bottom: 2rem;
}

.mobile-btn {
  width: 100%;
  padding: 1rem;
  font-size: 16px;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 990;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Tablet */
@media (max-width: 850px) {
  .desktop-only {
    display: none !important;
  }

  .hamburger-btn {
    display: flex;
  }

  .header-container {
    padding: 0.8rem 1.5rem;
  }
}

/* Celular Pequeno */
@media (max-width: 480px) {
  .header-container {
    padding: 0.8rem 1rem;
  }

  .title {
    font-size: 24px;
  }

  .mobile-drawer {
    width: 250px;
    padding-top: 5rem;
  }

  .mobile-link {
    font-size: 18px;
  }
}
</style>