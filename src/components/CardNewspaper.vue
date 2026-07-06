<script>
export default {
  name: "CardNewspaper",
  props: {
    id: { type: [Number, String], required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    categoryColor: { type: String, default: "#6dac7e" },
    title: { type: String, default: "" },
    author: { type: String, default: "" },
    status: { type: String, default: "draft" },
    publishedAt: { type: String, default: "" },
    canEdit: { type: Boolean, default: false },
  },
  data() {
    return {
      statusLabels: { published: "Publicado", draft: "Rascunho", archived: "Arquivado" },
      showMenu: false,
    };
  },
  computed: {
    formattedDate() {
      if (!this.publishedAt) return "";
      const date = new Date(this.publishedAt);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  mounted() {
    document.addEventListener("click", this.closeMenu);
  },
  unmounted() {
    document.removeEventListener("click", this.closeMenu);
  },
  methods: {
    // Redireciona para a página de leitura do jornal digital
    goToNewspaper() {
      this.$router.push(`/jornal/${this.id}`);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      this.showMenu = false;
    },
    handleAction(action) {
      this.closeMenu();
      this.$emit("manage-item", { action, id: this.id });
    },
  },
};
</script>

<template>
  <div class="card" @click="goToNewspaper">
    <div class="image-wrapper">
      <img :src="image" :alt="title" />

      <span v-if="category" class="category-badge" :style="{ backgroundColor: categoryColor }">
        {{ category }}
      </span>

      <div v-if="canEdit" class="card-options-wrapper">
        <button type="button" class="btn-options" @click.stop="toggleMenu">⋮</button>
        <div v-if="showMenu" class="options-dropdown">
          <button type="button" @click.stop="handleAction('edit')">Editar</button>
          <button type="button" class="delete-action" @click.stop="handleAction('delete')">Excluir</button>
        </div>
      </div>
    </div>

    <div class="card-text-content">
      <h4 class="title-newspaper">{{ title }}</h4>
      <p class="publication-date" v-if="publishedAt">Lançamento: {{ formattedDate }}</p>
      <div class="divisor-post"></div>
      <p class="action-read">Ler Edição Digital <span>➔</span></p>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  height: 100%;
  position: relative;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(109, 172, 131, 0.25);
}

.image-wrapper {
  position: relative;
  width: 100%;
}

.card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.category-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  z-index: 3;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  font-size: 11px;
  font-family: var(--primary-font);
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

/* Menu de opções ⋮ */
.card-options-wrapper {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 20;
}

.btn-options {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dddddd;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  padding: 0;
}

.btn-options:hover {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.options-dropdown {
  position: absolute;
  right: 0;
  top: 38px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 0.4rem;
  min-width: 110px;
  z-index: 100;
}

.options-dropdown button {
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
  border-radius: 8px;
  font-family: var(--primary-font, sans-serif);
  color: #333;
}

.options-dropdown button:hover {
  background-color: #f5f5f5;
}

.options-dropdown button.delete-action {
  color: #da4167;
}

.options-dropdown button.delete-action:hover {
  background-color: #fff0f2;
}

/* Textos */
.card-text-content {
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title-newspaper {
  font-size: 18px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  color: #222;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.publication-date {
  font-size: 11px;
  font-family: var(--primary-font);
  margin: 0.5rem 0;
  color: #777;
  flex: 1;
  font-weight: 300;
}

.divisor-post {
  width: 100%;
  height: 1px;
  background-color: #ececec;
  margin: 0.5rem 0;
}

.action-read {
  font-size: 12px;
  font-family: var(--primary-font);
  color: var(--color-green, #6dac7e);
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .title-newspaper {
    font-size: 16px;
  }
}
</style>