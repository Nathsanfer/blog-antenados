<script>
import { computed, ref } from "vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import HeaderTemplate from "../components/HeaderTemplate.vue";
import CardPost from "../components/CardPost.vue";
import { supabase } from "../composables/useSupabase";

export default {
  name: "Criacao",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardPost,
  },
  data() {
    return {
      posts: [],
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
      },
    };
  },
  computed: {
    currentSection() {
      return this.sections[this.activeSection];
    },
    filteredItems() {
      if (this.activeStatusFilter === "todos") {
        return this.posts;
      }
      return this.posts.filter((post) => post.status === this.activeStatusFilter);
    },
    totalItemsLabel() {
      return `Total de ${this.currentSection.label}: ${this.filteredItems.length}`;
    },
  },
  async mounted() {
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
  methods: {
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
    </aside>

    <div class="container-right">
      <div class="total-items">
        <p>{{ totalItemsLabel }}</p>
        <button>{{ currentSection.actionLabel }}</button>
      </div>
      <div class="status-filters">
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
</style>
