<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import CardNewspaper from "../components/CardNewspaper.vue";
import { supabase } from "../composables/useSupabase";

export default {
  name: "Jornais",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardNewspaper,
  },
  data() {
    return {
      newspapers: [],
      loading: true,
    };
  },
  async mounted() {
    await this.loadPublishedNewspapers();
  },
  methods: {
    async loadPublishedNewspapers() {
      try {
        const { data, error } = await supabase
          .from("newspapers")
          .select("*, categories(name, color), users(name)")
          .eq("status", "published") // Traz apenas jornais publicamente disponíveis
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.newspapers = (data || []).map((n) => ({
          id: n.id,
          image: n.cover_image_url || "../assets/post.jpg",
          category: n.categories?.name || "",
          categoryColor: n.categories?.color || "#6dac7e",
          title: n.title || "",
          author: n.users?.name || "Equipe Escolar",
          publishedAt: n.created_at || "",
        }));
      } catch (e) {
        console.error("Erro ao buscar os jornais:", e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <HeaderTemplate />

  <div class="header-page">
    <div class="divisor"></div>
    <h1>Edições do Jornal Escolar</h1>
    <div class="divisor"></div>
  </div>

  <main>
    <div v-if="loading" class="loading-state">
      <p>Buscando edições...</p>
    </div>

    <div v-else-if="newspapers.length === 0" class="empty-state">
      <p>Nenhuma edição do jornal foi publicada ainda.</p>
    </div>

    <div v-else class="posts-grid">
      <CardNewspaper 
        v-for="newspaper in newspapers" 
        :key="newspaper.id"
        :id="newspaper.id" 
        :image="newspaper.image" 
        :category="newspaper.category" 
        :category-color="newspaper.categoryColor"
        :title="newspaper.title" 
        :author="newspaper.author" 
        :published-at="newspaper.publishedAt"
        :can-edit="false" 
      />
    </div>
  </main>

  <FooterTemplate />
</template>

<style scoped>
.header-page {
  display: flex;
  max-width: 1200px;
  width: 90%;
  margin: 3rem auto 1rem;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.divisor {
  flex: 1;
  height: 1px;
  background-color: #a8a8a8;
}

.header-page h1 {
  font-size: 32px;
  font-weight: 500;
  font-family: var(--secondary-font);
  color: #222;
  text-align: center;
}

main {
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto 5rem;
  min-height: 40vh;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 0;
  font-family: var(--primary-font);
  color: #666;
  font-size: 18px;
}

@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-page h1 {
    font-size: 24px;
  }
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>