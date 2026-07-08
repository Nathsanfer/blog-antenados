<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import CardPost from "../components/CardPost.vue";
import CardNewspaper from "../components/CardNewspaper.vue";
import { supabase } from "../composables/useSupabase";

export default {
  name: "Blog",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardPost,
    CardNewspaper,
  },
  data() {
    return {
      posts: [],
      newspapers: [],
      categories: [],
      searchQuery: "",
      selectedCategory: "",
      activeSection: "artigos",
    };
  },
  async mounted() {
    await this.loadCategories();
    await this.loadPosts();
    await this.loadNewspapers();

    // Verificar se há um query parameter para definir a seção ativa
    const section = this.$route.query.section;
    if (section === 'jornais' || section === 'artigos') {
      this.activeSection = section;
    }
  },
  methods: {
    async loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name"); // Organiza por ordem alfabética

        if (error) throw error;

        this.categories = (data || []).map((c) => ({
          id: c.id,
          name: c.name || "",
          color: c.color || "#6dac7e",
          icon: c.icon || "",
        }));
      } catch (e) {
        console.error("Erro ao buscar as categorias:", e);
      }
    },
    async loadPosts() {
      try {
        const { data, error } = await supabase
          .from("post_cards")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.posts = (data || []).map((p) => ({
          id: p.id,
          image: p.cover_image_url || "../assets/post.jpg",
          category: p.category_name || "",
          categoryColor: p.category_color || "#da4167",
          title: p.title || "",
          content: p.subtitle || "",
          author: p.author_name || "Desconhecido",
          status: p.status || "draft",
        }));
      } catch (e) {
        console.error("Erro ao buscar os posts:", e);
      }
    },
    async loadNewspapers() {
      try {
        const { data, error } = await supabase
          .from("newspapers")
          .select("*, categories(name, color), users(name)")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.newspapers = (data || []).map((n) => ({
          id: n.id,
          title: n.title || "",
          image: n.cover_image_url || "../assets/post.jpg",
          category: n.categories?.name || "Jornal Escolar",
          categoryColor: n.categories?.color || "#6dac7e",
          author: n.users?.name || "Equipe Escolar",
          publishedAt: n.created_at || "",
        }));
      } catch (e) {
        console.error("Erro ao buscar os jornais:", e);
      }
    },
    selectCategory(category) {
      this.selectedCategory = this.selectedCategory === category ? "" : category;
    },
    setSection(section) {
      this.activeSection = section;
    },
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => {
        const matchesSearch =
          !this.searchQuery.trim() ||
          post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesCategory =
          !this.selectedCategory ||
          post.category.toLowerCase() === this.selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      });
    },
    // Filtra os jornais e arquivos por Categoria
    filteredNewspapers() {
      return this.newspapers.filter((newspaper) => {
        const matchesSearch =
          !this.searchQuery.trim() ||
          newspaper.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          newspaper.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          newspaper.author.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesCategory =
          !this.selectedCategory ||
          newspaper.category.toLowerCase() === this.selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      });
    },
  },
};
</script>

<template>
  <HeaderTemplate />

  <div class="header-page">
    <img src="../assets/icons_highlights/icon9.png" alt="Icone de Beca" class="icon-desktop" />
    <img src="../assets/icons_highlights/icon10.png" alt="Icone de Lâmpada" />
    <div class="divisor"></div>
    <h1>Blog</h1>
    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img src="../assets/icons_highlights/icon12.png" alt="Icone de Colmeia" class="icon-desktop" />
  </div>

  <main>
    <aside class="container-left">
      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Realize suas buscas..." class="search-input" />
        <img src="../assets/icons_highlights/icon13.png" alt="Buscar" />
      </div>

      <button class="option" :class="{ active: activeSection === 'jornais' }" @click="setSection('jornais')">
        <h3>Jornais</h3>
      </button>
      <button class="option" :class="{ active: activeSection === 'artigos' }" @click="setSection('artigos')">
        <h3>Artigos</h3>
      </button>

      <h3 class="title-sidebar">Categorias</h3>
      <div class="categories">
        <div class="category" :class="{ active: selectedCategory === '' }" style="background-color: #666;"
          @click="selectCategory('')">
          <p>Todas</p>
        </div>

        <div v-for="cat in categories" :key="cat.id" class="category" :class="{ active: selectedCategory === cat.name }"
          :style="{ backgroundColor: cat.color }" @click="selectCategory(cat.name)">
          <p>{{ cat.name }}</p>
        </div>
      </div>
    </aside>

    <div class="container-right">
      <div class="posts-grid">
        <CardPost v-if="activeSection === 'artigos'" v-for="post in filteredPosts" :key="post.id" :id="post.id"
          :image="post.image" :category="post.category" :category-color="post.categoryColor" :title="post.title"
          :content="post.content" :author="post.author" :status="post.status" :show-status="false" />
        <CardNewspaper v-else v-for="newspaper in filteredNewspapers" :key="newspaper.id" :id="newspaper.id"
          :image="newspaper.image" :category="newspaper.category" :category-color="newspaper.categoryColor"
          :title="newspaper.title" :author="newspaper.author" :published-at="newspaper.publishedAt" :can-edit="false" />
      </div>

      <div
        v-if="(activeSection === 'artigos' && filteredPosts.length === 0) || (activeSection === 'jornais' && filteredNewspapers.length === 0)"
        class="empty-feedback">
        <p>Nenhuma publicação encontrada para os filtros aplicados.</p>
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

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
  margin: 0 auto;
  margin-top: 0.5rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
  cursor: text;
  transition: box-shadow 0.2s ease;
  padding: 0 0.7rem;
}

.search-bar:hover,
.search-bar:focus-within {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 12px;
  font-family: var(--primary-font);
  color: #333;
  padding: 0.7rem 0;
  outline: none;
}

.search-input::placeholder {
  color: #b7b7b7;
}

.search-bar img {
  width: 20px;
  height: 20px;
  margin: 0 0.5rem;
  opacity: 0.45;
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
  margin-top: 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  padding: 0;
}

.option.active {
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box, linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167) border-box;
}

.option h3 {
  font-size: 18px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 1rem 0;
  pointer-events: none;
}

.option:focus-visible {
  outline: 2px solid var(--color-green);
  outline-offset: 3px;
}

.title-sidebar {
  font-size: 19px;
  font-weight: 500;
  font-family: var(--secondary-font);
  color: #000;
  margin: 1.5rem 0 0.5rem;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category {
  width: 100%;
  height: 45px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.category::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 1;
  border-radius: 12px;
}

.category:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.18);
}

.category.active {
  border: 2px solid var(--color-green);
  box-shadow: 0 0 0 3px rgba(109, 172, 126, 0.2);
  filter: none;
}

.category p {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--primary-font);
  color: #fff;
  margin: 0;
  padding: 0 0.75rem;
  text-align: center;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.container-right {
  flex: 1;
  min-width: 0;
  margin-bottom: 1rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.empty-feedback {
  text-align: center;
  padding: 4rem 0;
  font-family: var(--primary-font);
  color: #777;
  font-size: 15px;
  border: 1px dashed #ccc;
  border-radius: 16px;
  background: #fafafa;
  margin-top: 1rem;
}

@media (max-width: 1100px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  main {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .container-left {
    width: 100%;
  }

  .search-bar {
    max-width: 100%;
  }

  .categories {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.6rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
  }

  .categories::-webkit-scrollbar {
    display: none;
  }

  .category {
    flex-shrink: 0;
    width: auto;
    height: 40px;
    padding: 0 1.2rem;
    border-radius: 20px;
  }

  .category p {
    white-space: nowrap;
    padding: 0;
  }

  .title-sidebar {
    margin: 1rem 0 0.4rem;
  }

  .icon-desktop {
    display: none;
  }

  .header-page img {
    width: 40px;
    height: 40px;
  }

  .header-page h1 {
    font-size: 26px;
  }
}

@media (max-width: 480px) {
  .header-page {
    gap: 0.6rem;
  }

  .header-page img {
    width: 34px;
    height: 34px;
  }

  .header-page h1 {
    font-size: 22px;
  }

  .title-sidebar {
    font-size: 20px;
    margin-bottom: 1.4rem;
  }

  main {
    width: 92%;
    margin-bottom: 3rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
}
</style>