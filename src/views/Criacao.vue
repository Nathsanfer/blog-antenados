<script>
import { computed, ref } from "vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import HeaderTemplate from "../components/HeaderTemplate.vue";
import CardPost from "../components/CardPost.vue";
import CardNewspaper from "../components/CardNewspaper.vue";
import CardCategory from "../components/CardCategory.vue";
import { supabase } from "../composables/useSupabase";

export default {
  name: "Criacao",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardPost,
    CardNewspaper,
    CardCategory,
  },
  data() {
    return {
      posts: [],
      newspapers: [],
      categories: [],
      activeSection: "artigos",
      activeStatusFilter: "todos",
      statusLabels: {
        draft: "Rascunho",
        published: "Publicado",
        archived: "Arquivado",
      },
      statusFilters: [
        { label: "Todos", value: "todos" },
        { label: "Rascunho", value: "draft" },
        { label: "Publicado", value: "published" },
        { label: "Arquivado", value: "archived" },
      ],
      sections: {
        artigos: {
          label: "Artigos",
          actionLabel: "Criar Artigo",
        },
        jornais: {
          label: "Jornais",
          actionLabel: "Criar Jornal",
        },
        categorias: {
          label: "Categorias",
          actionLabel: "Criar Categoria",
        },
      },
    };
  },
  computed: {
    currentSection() {
      return this.sections[this.activeSection];
    },
    filteredItems() {
      if (this.activeSection === "artigos") {
        const items = this.posts;
        if (this.activeStatusFilter === "todos") {
          return items;
        }
        return items.filter((item) => item.status === this.activeStatusFilter);
      } else if (this.activeSection === "jornais") {
        return this.newspapers;
      } else if (this.activeSection === "categorias") {
        return this.categories;
      }
      return [];
    },
    totalItemsLabel() {
      return `Total de ${this.currentSection.label}: ${this.filteredItems.length}`;
    },
  },
  async mounted() {
    await this.loadPosts();
    await this.loadNewspapers();
    await this.loadCategories();
  },
  methods: {
    async loadPosts() {
      try {
        const { data, error } = await supabase
          .from("post_cards")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar os posts:", error);
          return;
        }

        this.posts = (data || []).map((p) => ({
          id: p.id,
          image: p.cover_image_url || "../assets/post.jpg",
          category: p.category_name || "",
          categoryColor: p.category_color || "#da4167",
          title: p.title || "",
          content: p.subtitle || "",
          author: p.author_name || "",
          status: p.status || "draft",
        }));
      } catch (e) {
        console.error("Erro ao buscar os posts:", e);
      }
    },
    async loadNewspapers() {
      try {
        console.log("Iniciando carregamento de jornais...");
        
        const { data, error, status } = await supabase
          .from("newspapers")
          .select("*");

        console.log("Status da query:", status);
        console.log("Erro retornado:", error);
        console.log("Dados retornados:", data);

        if (error) {
          console.error("Erro ao buscar os jornais:", error);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("Nenhum jornal encontrado no banco de dados");
          this.newspapers = [];
          return;
        }

        this.newspapers = data.map((n) => ({
          id: n.id,
          title: n.title || "",
          pdfUrl: n.pdf_url || "",
          status: n.status || "draft",
          publishedAt: n.published_at || "",
        }));

        console.log("Jornais processados:", this.newspapers);
      } catch (e) {
        console.error("Erro ao buscar os jornais:", e);
      }
    },
    async loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar as categorias:", error);
          return;
        }

        this.categories = (data || []).map((c) => ({
          id: c.id,
          name: c.name || "",
          description: c.description || "",
          color: c.color || "#6dac7e",
          icon: c.icon || "",
          createdAt: c.created_at || "",
        }));
      } catch (e) {
        console.error("Erro ao buscar as categorias:", e);
      }
    },
    setSection(section) {
      this.activeSection = section;
    },
    setStatusFilter(status) {
      this.activeStatusFilter = status;
    },
  },
};
</script>

<template>
  <HeaderTemplate />

  <div class="header-page">
    <img
      src="../assets/icons_highlights/icon9.png"
      alt="Icone de Beca"
      class="icon-desktop"
    />
    <img src="../assets/icons_highlights/icon10.png" alt="Icone de Lâmpada" />
    <div class="divisor"></div>
    <h1>Criações</h1>
    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img
      src="../assets/icons_highlights/icon12.png"
      alt="Icone de Colmeia"
      class="icon-desktop"
    />
  </div>

  <main>
    <aside class="container-left">
      <button
        class="option"
        :class="{ active: activeSection === 'artigos' }"
        type="button"
        @click="setSection('artigos')"
      >
        <h3>Artigos</h3>
      </button>
      <button
        class="option"
        :class="{ active: activeSection === 'jornais' }"
        type="button"
        @click="setSection('jornais')"
      >
        <h3>Jornais</h3>
      </button>
      <button
        class="option"
        :class="{ active: activeSection === 'categorias' }"
        type="button"
        @click="setSection('categorias')"
      >
        <h3>Categorias</h3>
      </button>
    </aside>

    <div class="container-right">
      <div class="total-items">
        <p>{{ totalItemsLabel }}</p>
        <button>{{ currentSection.actionLabel }}</button>
      </div>
      <div class="status-filters" v-if="activeSection === 'artigos'">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          class="status-filter"
          :class="{ active: activeStatusFilter === filter.value }"
          type="button"
          @click="setStatusFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
      <div class="posts-grid">
        <CardPost
          v-if="activeSection === 'artigos'"
          v-for="post in filteredItems"
          :key="post.id"
          :id="post.id"
          :image="post.image"
          :category="post.category"
          :category-color="post.categoryColor"
          :title="post.title"
          :content="post.content"
          :author="post.author"
          :status="post.status"
        />
        <CardNewspaper
          v-else-if="activeSection === 'jornais'"
          v-for="newspaper in filteredItems"
          :key="newspaper.id"
          :id="newspaper.id"
          :title="newspaper.title"
          :pdf-url="newspaper.pdfUrl"
          :published-at="newspaper.publishedAt"
          :show-status="false"
        />
        <CardCategory
          v-else-if="activeSection === 'categorias'"
          v-for="category in filteredItems"
          :key="category.id"
          :id="category.id"
          :name="category.name"
          :description="category.description"
          :color="category.color"
          :icon="category.icon"
          :created-at="category.createdAt"
        />
      </div>
    </div>
  </main>

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

main {
  display: flex;
  width: 85%;
  margin: 0 auto;
  justify-content: space-between;
  flex-direction: row;
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto 4rem;
  gap: 2rem;
  overflow-x: hidden;
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

.container-right {
  flex: 1;
  min-width: 0;
}

.total-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  border: #aaaaaa 1px solid;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.total-items p {
  font-size: 18px;
  font-family: var(--secondary-font);
}

.total-items button {
  background-color: var(--color-green);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 14px;
  font-family: var(--primary-font);
  cursor: pointer;
}

.status-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.status-filter {
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1px solid #d8d8d8;
  background-color: #ffffff;
  color: #555;
  font-family: var(--primary-font);
  font-size: 13px;
  cursor: pointer;
}

.status-filter.active {
  background-color: var(--color-green);
  border-color: var(--color-green);
  color: #fff;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.posts-grid:has(.category-card) {
  grid-template-columns: 1fr;
}

/* ===== MEDIA QUERIES ===== */

/* --- Adaptação para Tablets (Garante fluidez antes dos 480px) --- */
@media (max-width: 768px) {
  main {
    flex-direction: column; /* Empilha o menu e o conteúdo */
    gap: 1.5rem;
  }

  .container-left {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .option {
    margin-bottom: 0;
    flex: 1; /* Faz os botões dividirem o espaço igualmente */
  }

  .posts-grid {
    grid-template-columns: repeat(2, 1fr); /* Reduz para 2 colunas no tablet */
  }
}

/* --- Foco total em Smartphones (480px ou menos) --- */
@media (max-width: 480px) {
  /* Ocultar elementos decorativos do Desktop */
  .icon-desktop {
    display: none !important;
  }

  /* Cabeçalho da Página */
  .header-page {
    gap: 0.5rem;
    width: 95%;
  }

  .header-page h1 {
    font-size: 22px;
  }

  .header-page img {
    width: 32px;
    height: 32px;
  }

  /* Layout Principal */
  main {
    width: 95%;
    margin: 1rem auto 2rem;
    gap: 1rem;
  }

  /* Menu transformado em Abas */
  .container-left {
    flex-wrap: wrap; /* Permite que os botões quebrem linha se necessário */
    gap: 0.5rem;
  }

  .option {
    flex: 1 1 30%; /* Os botões tentam ocupar 30%, mas crescem se tiver espaço */
    min-width: 100px;
    border-radius: 12px;
  }

  .option h3 {
    font-size: 14px;
    padding: 0.6rem 0;
  }

  /* Container da Direita (Conteúdo) */
  .container-right {
    width: 100%;
  }

  /* Barra de Totalizadores e Botão de Ação */
  .total-items {
    flex-direction: column; /* Coloca o texto em cima e o botão embaixo */
    gap: 1rem;
    padding: 1rem;
    border-radius: 15px;
    text-align: center;
  }

  .total-items p {
    font-size: 16px;
    margin: 0;
  }

  .total-items button {
    width: 100%; /* Botão ocupa a largura total para facilitar o clique no mobile */
    padding: 0.8rem;
    font-size: 15px;
  }

  /* Filtros de Status (Rascunho, Publicado, etc) */
  .status-filters {
    justify-content: center;
    gap: 0.5rem;
  }

  .status-filter {
    flex: 1 1 45%; /* Coloca dois filtros por linha */
    text-align: center;
    font-size: 12px;
    padding: 0.5rem;
  }

  /* Grade de Cards */
  .posts-grid {
    grid-template-columns: 1fr; /* Coloca 1 card por linha no celular */
    gap: 1rem;
  }
}
</style>
