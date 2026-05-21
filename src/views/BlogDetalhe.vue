<script>
import { supabase } from "../composables/useSupabase.js";
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import CardPostSidebar from "../components/CardPostSidebar.vue";
import CardNewspaperSidebar from "../components/CardNewspaperSidebar.vue";


export default {
  name: "BlogDetalhe",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardPostSidebar,
    CardNewspaperSidebar,
  },
  data() {
    return {
      article: null,
      posts: [],
      newspapers: [],
    };
  },
  async mounted() {
    await this.loadArticle(this.$route.params.id);
  },
  watch: {
    "$route.params.id": {
      immediate: false,
      async handler(newId) {
        await this.loadArticle(newId);
      },
    },
  },
  methods: {
    async loadArticle(postId) {
      if (!postId) {
        console.warn("ID do artigo não fornecido");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("post_articles")
          .select("*")
          .eq("id", postId)
          .limit(1);

        if (error) {
          console.error("Erro ao buscar os dados do artigo:", error);
          return;
        }

        const a = (data || [])[0];
        if (a) {
          this.article = {
            image: a.cover_image_url || "../assets/post.jpg",
            category: a.category_name || "",
            categoryColor: a.category_color || "#da4167",
            title: a.title || "",
            subtitle: a.subtitle || "",
            content: a.content || "",
            author: a.author_name || "",
            authorPosition: a.author_position || "",
            authorImage: a.author_avatar || "../assets/author.png",
            publishedAt: a.published_at || a.created_at || "",
            id: a.id,
          };
        }

        const { data: sidebarData, error: sidebarError } = await supabase
          .from("post_cards")
          .select("*")
          .neq("id", postId)
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(5);

        if (sidebarError) {
          console.error("Erro ao buscar os cards do sidebar:", sidebarError);
          return;
        }

        this.posts = (sidebarData || []).map((p) => ({
          id: p.id,
          image: p.cover_image_url || "../assets/post.jpg",
          category: p.category_name || "",
          categoryColor: p.category_color || "#da4167",
          title: p.title || "",
        }));

        // Buscar jornais para a sidebar
        const { data: newspaperData, error: newspaperError } = await supabase
          .from("newspapers")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);

        if (newspaperError) {
          console.error("Erro ao buscar os jornais do sidebar:", newspaperError);
          return;
        }

        this.newspapers = (newspaperData || []).map((n) => ({
          id: n.id,
          title: n.title || "",
          publishedAt: n.published_at || "",
          pdfUrl: n.pdf_url || "",
        }));
      } catch (e) {
        console.error("Erro ao buscar os dados do artigo:", e);
      }
    },
    formatContent(text) {
      if (!text) return '';
      return text.replace(/\n/g, '<br>');
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
    <h1>Artigo</h1>
    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img
      src="../assets/icons_highlights/icon12.png"
      alt="Icone de Colmeia"
      class="icon-desktop"
    />
  </div>

  <main>
    <aside class="container-left" v-if="article">
      <h3 class="title-sidebar title-primary">Autor(a)</h3>
      <div class="author">
        <img :src="article.authorImage" :alt="article.author" />
        <div class="data-author">
          <h4>{{ article.author }}</h4>
          <p>{{ article.authorPosition }}</p>
        </div>
      </div>
      <h3 class="title-sidebar">Data da Publicação</h3>
      <div class="date">
        <p>{{ formatDate(article.publishedAt) }}</p>
      </div>
      <h3 class="title-sidebar">Encontre Mais...</h3>
      <ul class="list-cards">
        <template v-if="posts.length">
          <CardPostSidebar
            v-for="post in posts"
            :key="post.id"
            :id="post.id"
            :image="post.image"
            :category="post.category"
            :category-color="post.categoryColor"
            :title="post.title"
            :content="post.content"
            :author="post.author"
          />
        </template>
      </ul>
      <button class="btn-sidebar">Ver Mais</button>

      <h3 class="title-sidebar">Leia Nossos Jornais</h3>
      <ul class="list-newspapers">
        <template v-if="newspapers.length">
          <CardNewspaperSidebar
            v-for="newspaper in newspapers"
            :key="newspaper.id"
            :id="newspaper.id"
            :title="newspaper.title"
            :published-at="newspaper.publishedAt"
            :pdf-url="newspaper.pdfUrl"
          />
        </template>
      </ul>
      <button class="btn-sidebar">Ver Mais</button>
    </aside>
    <div class="container-right" v-if="article">
      <div class="container">
        <img :src="article.image" :alt="article.title" />
        <p class="category" :style="{ color: article.categoryColor }">{{ article.category }}</p>
        <h1 class="title-article">
          {{ article.title }}
        </h1>
        <p class="subtitle">
          {{ article.subtitle }}
        </p>
        <div class="divider"></div>
        <p class="content" v-html="formatContent(article.content)"></p>
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

.title-sidebar {
  font-size: 19px;
  font-weight: 500;
  font-family: var(--secondary-font);
  color: #000;
  margin: 1.5rem 0 0.5rem;
}

.title-primary {
  margin-top: 0;
}

.author {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  width: 97%;
  margin: 0 auto;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.11);
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 65px;
}

.author img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.data-author {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.7rem;
  margin-left: 0.5rem;
}

.data-author h4 {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
}

.data-author p {
  font-size: 11px;
  font-weight: 300;
  margin: 0;
  color: #555;
}

.date {
  width: 97%;
  margin: 0 auto;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.11);
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 40px;
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
}

.date p {
  font-size: 11px;
  font-weight: 300;
  margin: 0;
  color: #000;
}

.list-cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-newspapers {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 97%;
  margin: 0 auto;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.11);
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 60px;
}

.card img {
  width: 85px;
  height: 100%;
  border-radius: 10px 0 0;
  flex-shrink: 0;
}

.info h4 {
  font-size: 11px;
  font-weight: 500;
  margin: 0;
  font-family: var(--secondary-font);
}

.info p {
  font-size: 10px;
  font-weight: 300;
  margin: 0;
  color: #afa629;
}

.btn-sidebar {
  width: 100%;
  padding: 0.5rem;
  background-color: var(--color-green);
  color: #fff;
  border: none;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

/* ===== Article  ===== */
.container-right {
  flex: 1;
  min-width: 0;
}

.container {
  width: 98%;
  margin: 0 auto;
  padding: 1.2rem;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.11);
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  display: flex;
  flex-direction: column;
}

.container img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.category {
  font-size: 12px;
  font-family: var(--primary-font);
  margin-top: 1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  filter: saturate(1.8) brightness(0.77);
}

.title-article {
  font-size: 29px;
  font-weight: 300;
  font-family: var(--secondary-font);
  margin: 0.5rem 0 0;
}

.subtitle {
  font-size: 14px;
  font-weight: 300;
  margin: 0.8rem 0 0;
  color: #555;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #dfdede;
  margin: 1.5rem 0;
}

.content {
  font-size: 14px;
  font-weight: 300;
  margin: 0;
  color: #555;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
