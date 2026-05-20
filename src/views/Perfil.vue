<script>
import FooterTemplate from "../components/FooterTemplate.vue";
import HeaderTemplate from "../components/HeaderTemplate.vue";

export default {
  name: "Perfil",
  components: {
    HeaderTemplate,
    FooterTemplate,
  },
};
</script>

<template>
<HeaderTemplate />
  
    <div class="header-page">
    <img src="../assets/icons_highlights/icon9.png" alt="Icone de Beca" class="icon-desktop" />
    <img src="../assets/icons_highlights/icon10.png" alt="Icone de Lâmpada" />
    <div class="divisor"></div>
    <h1>Perfil</h1>

    <main>
    <aside class="container-left">
      <button
        class="option"
        :class="{ active: activeSection === 'artigos' }"
        type="button"
        @click="setSection('artigos')"
      >
        <h3>Meus Dados</h3>
      </button>
      <button
        class="option"
        :class="{ active: activeSection === 'jornais' }"
        type="button"
        @click="setSection('jornais')"
      >
        <h3>Usuários</h3>
      </button>

      <button class="option">Sair da Conta</button>
    </aside>

    
  </main>

    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img src="../assets/icons_highlights/icon12.png" alt="Icone de Colmeia" class="icon-desktop" />
  </div>

  <FooterTemplate />
</template>

<style scoped>

.header-page {
  display: flex;
  max-width: 1200px;
  width: 90%;
  margin: 1rem auto;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.header-page img {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.divisor {
  flex: 1;
  height: 1px;
  background-color: #a8a8a8;
}

.header-page h1 {
  font-size: 30px;
  font-weight: 500;
  font-family: var(--secondary-font);
  white-space: nowrap;
}

.container-left {
  width: 240px;
  flex-shrink: 0;
}

.option {
  width: 100%;
  border: 1px solid #aaaaaa;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 20px;
  cursor: pointer;
  padding: 0;
}

.option.active {
  border: 2px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167)
      border-box;
}

.option h3 {
  font-size: 18px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 1rem 0;
}

.option:focus-visible {
  outline: 2px solid var(--color-green);
  outline-offset: 3px;
}

.option h3 {
  pointer-events: none;
}

</style>