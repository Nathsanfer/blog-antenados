<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import { supabase } from "../composables/useSupabase";
import { useRoute } from "vue-router";

export default {
  name: "LeituraJornal",
  components: {
    HeaderTemplate,
    FooterTemplate,
  },
  data() {
    return {
      newspaper: null,
      loading: true,
      error: null,
    };
  },
  async mounted() {
    // Pega o ID que está na URL (ex: a4c97e6b-...)
    const route = useRoute();
    const id = route.params.id;
    
    await this.fetchNewspaper(id);
  },
  methods: {
    async fetchNewspaper(id) {
      try {
        const { data, error } = await supabase
          .from("newspapers")
          .select("*, categories(name, color), users(name)")
          .eq("id", id)
          .single(); // Retorna apenas 1 resultado

        if (error) throw error;
        
        this.newspaper = data;
      } catch (e) {
        console.error("Erro ao buscar edição:", e);
        this.error = "Edição não encontrada ou indisponível.";
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
};
</script>

<template>
  <HeaderTemplate />

  <main class="reading-container">
    <div v-if="loading" class="loading-state">
      <p>Carregando edição...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h2>Oops!</h2>
      <p>{{ error }}</p>
      <button @click="$router.push('/criacoes')">Voltar</button>
    </div>

    <article v-else class="newspaper-content">
      <header class="news-header">
        <span class="category-badge" :style="{ backgroundColor: newspaper.categories?.color || '#6dac7e' }">
          {{ newspaper.categories?.name || 'Jornal' }}
        </span>
        
        <h1 class="news-title">{{ newspaper.title }}</h1>
        
        <div class="news-meta">
          <p class="author">Por <strong>{{ newspaper.users?.name || 'Equipe Escolar' }}</strong></p>
          <span class="dot">•</span>
          <p class="date">{{ formatDate(newspaper.created_at) }}</p>
        </div>
      </header>

      <div class="divisor"></div>

      <div v-if="newspaper.cover_image_url" class="cover-image-wrapper">
        <img :src="newspaper.cover_image_url" :alt="newspaper.title" />
      </div>

      <div class="rich-text-body" v-html="newspaper.content"></div>
    </article>
  </main>

  <FooterTemplate />
</template>

<style scoped>
.reading-container {
  max-width: 900px; 
  margin: 3rem auto;
  padding: 0 1.5rem;
  min-height: 60vh;
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem 0;
  font-family: var(--primary-font);
  color: #666;
}

.error-state button {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background-color: var(--color-green);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Cabeçalho */
.news-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category-badge {
  padding: 0.3rem 0.8rem;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  font-family: var(--primary-font);
}

.news-title {
  font-size: 36px;
  font-family: var(--secondary-font);
  color: #222;
  font-weight: 550;
  margin-top: 1rem;
  margin-bottom: 0.2rem;
  line-height: 1.2;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: var(--primary-font);
  font-size: 14px;
  color: #666;
}

.divisor {
  width: 100%;
  height: 1px;
  background-color: #eaeaea;
  margin: 1.5rem 0 2.5rem;
}

/* Imagem de Capa */
.cover-image-wrapper {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2.5rem;
}

.cover-image-wrapper img {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  display: block;
}

/* Corpo Renderizado pelo Editor */
.rich-text-body {
  font-family: var(--primary-font, Arial, sans-serif);
  font-size: 17px;
  line-height: 1.8;
  color: #333;
}

/* Como o v-html joga o HTML puro aqui dentro, precisamos garantir
   que as tags de dentro dele (h1, p, img) fiquem bonitas */
:deep(.rich-text-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 2rem 0;
}

:deep(.rich-text-body h1), :deep(.rich-text-body h2) {
  font-family: var(--secondary-font);
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #222;
}

:deep(.rich-text-body p) {
  margin-bottom: 1.2rem;
}

:deep(.rich-text-body a) {
  color: var(--color-green);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .news-title { font-size: 28px; }
  .rich-text-body { font-size: 16px; }
}
</style>