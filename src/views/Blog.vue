<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import CardPost from "../components/CardPost.vue";
import imagemPost from "../assets/post.jpg";
import { supabase } from "../composables/useSupabase";

export default {
  name: "Blog",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardPost,
  },
  data() {
    return {
      posts: [],
      searchQuery: "",
      selectedCategory: "",
    };
  },
  async mounted() {
    try {
      const { data, error } = await supabase
        .from("post_cards")
        .select("*")
        .eq("status", "published")
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
  computed: {
    uniqueCategories() {
      const categoriesMap = new Map();
      this.posts.forEach((post) => {
        if (!categoriesMap.has(post.category)) {
          categoriesMap.set(post.category, post.categoryColor);
        }
      });
      return Array.from(categoriesMap, ([name, color]) => ({ name, color }));
    },
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
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = this.selectedCategory === category ? "" : category;
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
    <h1>Blog</h1>
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
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Realize suas buscas..."
          class="search-input"
        />
        <img src="../assets/icons_highlights/icon13.png" alt="Buscar" />
      </div>

      <h3 class="title-sidebar">Categorias</h3>
      <div class="categories">
        <div
          v-for="cat in uniqueCategories"
          :key="cat.name"
          class="category"
          :class="{ active: selectedCategory === cat.name }"
          :style="{ backgroundColor: cat.color }"
          @click="selectCategory(cat.name)"
        >
          <p>{{ cat.name }}</p>
        </div>
      </div>

      <h3 class="title-sidebar">Jornais</h3>
      <div class="jornals">
        <div class="jornal">
          <p>1º Edição do Jornal</p>
        </div>
        <div class="jornal">
          <p>2º Edição do Jornal</p>
        </div>
        <div class="jornal">
          <p>3º Edição do Jornal</p>
        </div>
      </div>
    </aside>

    <div class="container-right">
      <div class="posts-grid">
        <CardPost
          v-for="post in filteredPosts"
          :key="post.id"
          :id="post.id"
          :image="post.image"
          :category="post.category"
          :category-color="post.categoryColor"
          :title="post.title"
          :content="post.content"
          :author="post.author"
          :status="post.status"
          :show-status="false"
        />
      </div>
    </div>
  </main>

  <FooterTemplate />
</template>

<style scoped>
/* ===== Header Page ===== */
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

/* ===== Main Layout ===== */
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

/* ===== Sidebar ===== */
.container-left {
  width: 240px;
  flex-shrink: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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

.title-sidebar {
  font-size: 19px;
  font-weight: 500;
  font-family: var(--secondary-font);
  color: #000;
  margin: 1.5rem 0 0.5rem;
}

/* Categories */
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
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
}

.category p {
  font-size: 12px;
  font-weight: 500;
  font-family: var(--primary-font);
  color: #fff;
  margin: 0;
  padding: 0 0.75rem;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Journals */
.jornals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.jornal {
  width: 100%;
  height: 45px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.jornal:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.14);
}

.jornal p {
  font-size: 12px;
  font-family: var(--primary-font);
  color: #333;
  margin: 0;
  padding: 0 0.75rem;
}

/* ===== Posts Grid ===== */
.container-right {
  flex: 1;
  min-width: 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.13);
  z-index: 2;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.text-categorie {
  font-size: 11px;
  font-family: var(--primary-font);
  color: #da4167;
  margin: 0;
  padding: 0.75rem 0.75rem 0;
  letter-spacing: 0.5px;
}

.title-post {
  font-size: 19px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 0.2rem 0.75rem 0;
  line-height: 1.3;
}

.brief-content {
  font-size: 11px;
  font-family: var(--primary-font);
  margin: 0;
  font-weight: 300;
  padding: 0.4rem 0.75rem;
  line-height: 1.6;
  color: #555;
  flex: 1;
}

.brief-content strong {
  color: var(--color-green);
  font-weight: 600;
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
  color: #da4167;
  font-weight: 500;
}

/* ============================
   RESPONSIVE BREAKPOINTS
   ============================ */

/* Small desktop / tablet landscape */
@media (max-width: 1100px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet portrait */
@media (max-width: 768px) {
  main {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .container-left {
    width: 100%;
  }

  /* Search bar full width */
  .search-bar {
    max-width: 100%;
  }

  /* Categories and journals become horizontal scroll rows */
  .categories,
  .jornals {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.6rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
  }

  .categories::-webkit-scrollbar,
  .jornals::-webkit-scrollbar {
    display: none;
  }

  .category,
  .jornal {
    flex-shrink: 0;
    width: auto;
    height: 40px;
    padding: 0 1rem;
    border-radius: 20px;
  }

  .category p,
  .jornal p {
    white-space: nowrap;
    padding: 0;
  }

  .title-sidebar {
    margin: 1rem 0 0.4rem;
  }

  /* Posts: 2 columns on tablet */
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Header page: hide outer icons */
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

/* Mobile */
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

  main {
    width: 92%;
    margin-bottom: 3rem;
  }

  /* Posts: 1 column on mobile */
  .posts-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }

  .card img {
    height: 200px;
  }

  .title-post {
    font-size: 18px;
  }
}

/* Small mobile */
@media (max-width: 360px) {
  .header-page h1 {
    font-size: 20px;
  }

  .posts-grid {
    max-width: 100%;
  }
}
</style>
