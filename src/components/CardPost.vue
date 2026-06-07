<script>
import { useRouter } from "vue-router";

export default {
  name: "CardPost",

  // Propriedades que o componente recebe do pai para exibir o card corretamente
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    categoryColor: {
      type: String,
      default: "#da4167",
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "draft",
    },
    showStatus: {
      type: Boolean,
      default: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // Rótulos para o status do post exibidos no badge
      statusLabels: {
        published: "Publicado",
        draft: "Rascunho",
        archived: "Arquivado",
      },
      showMenu: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
    // Adiciona listener global para fechar o menu quando o usuário clicar fora
    document.addEventListener("click", this.closeMenu);
  },
  unmounted() {
    // Remove listener para evitar vazamento de memória
    document.removeEventListener("click", this.closeMenu);
  },
  methods: {
    goToArticle() {
      this.router.push(`/blog/${this.id}`);
    },

    // Alterna a visibilidade do menu de edição/exclusão
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      this.showMenu = false;
    },

    // Emite o evento para o componente pai tratar a ação escolhida
    handleAction(action) {
      this.closeMenu();
      this.$emit("manage-item", { action, id: this.id });
    },
  },
};
</script>

<template>
  <div class="card" @click="goToArticle()">
    <div class="image-wrapper">
      <!-- Imagem principal do artigo -->
      <img :src="image" :alt="title" />

      <!-- Badge de status, exibido somente quando habilitado -->
      <span v-if="showStatus" class="status-badge" :class="`status-${status}`">
        {{ statusLabels[status] }}
      </span>

      <!-- Botão de opções exibido apenas para usuários com permissão de edição -->
      <div v-if="canEdit" class="card-options-wrapper">
        <button type="button" class="btn-options" @click.stop="toggleMenu">⋮</button>
        
        <div v-if="showMenu" class="options-dropdown">
          <button type="button" @click.stop="handleAction('edit')">Editar</button>
          <button type="button" class="delete-action" @click.stop="handleAction('delete')">Excluir</button>
        </div>
      </div>
    </div>

    <p class="text-categorie" :style="{ color: categoryColor }">
      {{ category }}
    </p>
    <h4 class="title-post">{{ title }}</h4>

    <!-- Trecho de descrição resumido do artigo -->
    <p class="brief-content">
      {{ content }}
    </p>
    <div class="divisor-post"></div>
    <p class="author-post">
      por <span>@ {{ author }}</span>
    </p>
  </div>
</template>

<style scoped>
/* Estilo básico do card de post */
.card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  height: 100%;
  position: relative;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(218, 65, 103, 0.2);
}

/* Imagem e elementos sobrepostos */
.image-wrapper {
  position: relative;
  width: 100%;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.status-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  z-index: 3;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 11px;
  font-family: var(--primary-font);
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #fff;
  text-transform: uppercase;
}

.status-draft {
  background-color: #da9a16;
}

.status-published {
  background-color: #6dac7e;
}

.status-archived {
  background-color: #8d8d8d;
}

/* Menu de ações do card */
.card-options-wrapper {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 20;
}

.btn-options {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #dddddd;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  color: #333;
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

/* Estilizaçlao dos textos */
.text-categorie {
  font-size: 11px;
  font-family: var(--primary-font);
  margin: 0;
  font-weight: 400;
  padding: 0.75rem 0.75rem 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  filter: saturate(1.8) brightness(0.77);
}

.title-post {
  font-size: 20px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 0.25rem 0.75rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brief-content {
  font-size: 10.5px;
  font-family: var(--primary-font);
  margin: 0;
  font-weight: 300;
  padding: 0.5rem 0.75rem;
  line-height: 1.65;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6.1em;
}

.divisor-post {
  width: 92%;
  height: 1px;
  background-color: #ececec;
  margin: 0 auto;
}

.author-post {
  font-size: 11px;
  font-family: var(--primary-font);
  color: #333;
  margin: 0;
  padding: 0.5rem 0.75rem 1rem;
}

.author-post span {
  color: #968d8d;
  font-weight: 500;
}
</style>