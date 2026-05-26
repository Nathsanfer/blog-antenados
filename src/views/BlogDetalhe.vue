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
      carouselPosts: [],
      carouselImages: [],
      currentSlide: 0,
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
          .limit(4);

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

        // Preparar dados para o carrossel
        this.carouselPosts = this.posts;
        this.currentSlide = 0;

        // Buscar imagens do carrossel
        await this.loadPostImages(postId);

        // Buscar jornais para a sidebar
        const { data: newspaperData, error: newspaperError } = await supabase
          .from("newspapers")
          .select("*")
          .limit(3);  

        if (newspaperError) {
          console.error("Erro ao buscar os jornais do sidebar:", newspaperError);
          return;
        }

        this.newspapers = (newspaperData || []).map((n) => ({
          id: n.id,
          title: n.title || "",
          pdfUrl: n.pdf_url || "",
          createdAt: n.created_at || "",
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
    async loadPostImages(postId) {
      try {
        const { data, error } = await supabase
          .from("post_images")
          .select("*")
          .eq("post_id", postId)
          .order("position", { ascending: true });

        if (error) {
          console.error("Erro ao buscar imagens do carrossel:", error);
          return;
        }

        this.carouselImages = (data || []).map((image) => ({
          id: image.id,
          image: image.image_url,
          position: image.position,
        }));

        this.currentSlide = 0;
      } catch (e) {
        console.error("Erro ao buscar imagens do carrossel:", e);
      }
    },
    nextSlide() {
      if (this.carouselImages.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
      }
    },
    prevSlide() {
      if (this.carouselImages.length > 0) {
        this.currentSlide = (this.currentSlide - 1 + this.carouselImages.length) % this.carouselImages.length;
      }
    },
    goToAllPosts() {
      this.$router.push('/blog');
    },
    goToAllNewspapers() {
      this.$router.push('/blog?section=jornais');
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
      <button class="btn-sidebar" @click="goToAllPosts">Ver Mais</button>

      <h3 class="title-sidebar">Leia Nossos Jornais</h3>
      <ul class="list-newspapers">
        <template v-if="newspapers.length">
          <CardNewspaperSidebar
            v-for="newspaper in newspapers"
            :key="newspaper.id"
            :id="newspaper.id"
            :title="newspaper.title"
            :pdf-url="newspaper.pdfUrl"
            :created-at="newspaper.createdAt"
          />
        </template>
      </ul>
      <button class="btn-sidebar" @click="goToAllNewspapers">Ver Mais</button>
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

      <!-- Carrossel -->
      <div class="carousel-section" v-if="carouselImages.length > 0">
        <h2 class="carousel-title">Imagens da Postagem</h2>
        <div class="carousel-container">
          <button class="carousel-btn carousel-btn-prev" @click="prevSlide" aria-label="Imagem anterior">
            &#10094;
          </button>

          <div class="carousel-wrapper">
            <div 
              class="carousel-item" 
              v-for="(image, index) in carouselImages" 
              :key="image.id"
              :class="{ active: index === currentSlide }"
            >
              <div class="carousel-panel">
                <div class="carousel-image-container">
                  <img :src="image.image" :alt="`Imagem ${image.position}`" />
                </div>
              </div>
            </div>
          </div>

          <button class="carousel-btn carousel-btn-next" @click="nextSlide" aria-label="Próxima imagem">
            &#10095;
          </button>
        </div>

        <!-- Indicadores (pontos) -->
        <div class="carousel-indicators" v-if="carouselImages.length > 1">
          <button 
            v-for="(image, index) in carouselImages" 
            :key="index"
            class="indicator"
            :class="{ active: index === currentSlide }"
            @click="currentSlide = index"
            :aria-label="`Ir para imagem ${index + 1}`"
          ></button>
        </div>
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

/* ===== Carousel ===== */
.carousel-section {
  width: 98%;
  margin: 2rem auto 0;
  padding: 1.2rem;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.11);
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 1  rem;
}

.carousel-title {
  font-size: 24px;
  font-weight: 500;
  font-family: var(--secondary-font);
  color: #000;
  margin: 0 0 1.5rem;
  text-align: center;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  min-height: 350px;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-green);
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.carousel-btn:hover {
  background-color: #6fa949;
  transform: scale(1.1);
}

.carousel-btn-prev,
.carousel-btn-next {
  position: static;
}

.carousel-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 320px;
  border-radius: 10px;
}

.carousel-item {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.carousel-item.active {
  opacity: 1;
  position: relative;
  pointer-events: auto;
}

.carousel-panel {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.8);
  font-size: 28px;
  font-weight: 500;
  font-family: var(--secondary-font);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.carousel-placeholder p {
  margin: 0;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: #ddd;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: var(--color-green);
}

.indicator:hover {
  background-color: #bbb;
}

@media (max-width: 768px) {
  .carousel-container {
    min-height: 280px;
  }

  .carousel-wrapper {
    min-height: 250px;
  }

  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  .carousel-placeholder {
    font-size: 24px;
  }

  .carousel-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .carousel-section {
    padding: 1rem;
  }

  .carousel-container {
    gap: 0.5rem;
    min-height: 240px;
  }

  .carousel-wrapper {
    min-height: 210px;
  }

  .carousel-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .carousel-placeholder {
    font-size: 20px;
  }

  .carousel-title {
    font-size: 18px;
  }
}
</style>
