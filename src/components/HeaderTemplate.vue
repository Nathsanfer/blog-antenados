<template>
  <div class="decoration"></div>
  <header class="header">
    <div class="logo-header">
      <h3 class="title">Antenados</h3>
    </div>

    <nav class="navigation-header">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/blog" class="nav-link">Blog</router-link>
    </nav>

    <router-link class="link" to="/login"
      ><button class="login-button">Acesso Professor</button></router-link
    >
  </header>
</template>

<style scoped>
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
  font-size: 24px;
  font-weight: bold;
  font-family: var(--secondary-font);
}

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

.login-button {
  padding: 8px 45px;
  background-color: var(--color-green);
  color: white;
  border-radius: 20px;
  border: navajowhite;
  cursor: pointer;
}

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
}
</style>
