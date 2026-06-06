<script>
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

      // Controle do Modal
      showModal: false,
      isSubmitting: false,

      // Arquivos selecionados pelo usuário
      imageFile: null,
      pdfFile: null,

      // Formulários de Criação (sem os campos de URL de texto bruto)
      formPost: {
        title: "",
        subtitle: "",
        content: "",
        category_id: "",
        status: "draft"
      },
      formNewspaper: {
        title: ""
      },
      formCategory: {
        name: "",
        description: "",
        color: "#6dac7e",
        icon: "article"
      },

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
    // --- Captura de Arquivos nos Inputs ---
    handleImageChange(event) {
      this.imageFile = event.target.files[0];
    },
    handlePdfChange(event) {
      this.pdfFile = event.target.files[0];
    },

    // --- Métodos de Carregamento (Leitura) ---
    async loadPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*, categories(name, color), users(name)")
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.posts = (data || []).map((p) => ({
          id: p.id,
          image: p.cover_image_url || "../assets/post.jpg",
          category: p.categories?.name || "",
          categoryColor: p.categories?.color || "#da4167",
          title: p.title || "",
          content: p.subtitle || "",
          author: p.users?.name || "Anônimo",
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
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.newspapers = (data || []).map((n) => ({
          id: n.id,
          title: n.title || "",
          pdfUrl: n.pdf_url || "",
          status: n.status || "draft",
          publishedAt: n.created_at || "",
        }));
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

        if (error) throw error;

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

    // --- Métodos de Controle do Modal ---
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForms();
    },
    resetForms() {
      this.formPost = { title: "", subtitle: "", content: "", category_id: "", status: "draft" };
      this.formNewspaper = { title: "" };
      this.formCategory = { name: "", description: "", color: "#6dac7e", icon: "article" };
      this.imageFile = null;
      this.pdfFile = null;

      // Limpa os inputs de arquivo no DOM usando as refs
      if (this.$refs.imageInput) this.$refs.imageInput.value = "";
      if (this.$refs.pdfInput) this.$refs.pdfInput.value = "";
    },

    // --- Métodos de Gravação (Supabase com Storage) ---
    async handleCreate() {
      this.isSubmitting = true;
      try {
        if (this.activeSection === "artigos") {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Usuário não autenticado.");

          let uploadedImageUrl = null;

          // Se houver uma imagem selecionada, faz o upload primeiro
          if (this.imageFile) {
            const fileExt = this.imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
            const filePath = `covers/${fileName}`; // Organizado em uma subpasta 'covers'

            const { error: uploadError } = await supabase.storage
              .from('port-images')
              .upload(filePath, this.imageFile);

            if (uploadError) throw uploadError;

            // Pega a URL pública gerada
            const { data: urlData } = supabase.storage
              .from('port-images')
              .getPublicUrl(filePath);

            uploadedImageUrl = urlData.publicUrl;
          }

          // Insere os dados na tabela do banco
          const { error } = await supabase.from("posts").insert([
            {
              title: this.formPost.title,
              subtitle: this.formPost.subtitle,
              content: this.formPost.content,
              cover_image_url: uploadedImageUrl,
              category_id: this.formPost.category_id || null,
              status: this.formPost.status,
              author_id: user.id
            }
          ]);
          if (error) throw error;
          await this.loadPosts();

        } else if (this.activeSection === "jornais") {
          if (!this.pdfFile) throw new Error("Por favor, selecione um arquivo PDF para o jornal.");

          let uploadedPdfUrl = null;

          // Upload do arquivo PDF (Salvaremos no bucket port-images dentro de uma pasta 'pdfs')
          const fileExt = this.pdfFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
          const filePath = `pdfs/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('port-images') // Reutilizando o bucket port-images, mas em outra pasta
            .upload(filePath, this.pdfFile);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('port-images')
            .getPublicUrl(filePath);

          uploadedPdfUrl = urlData.publicUrl;

          // Insere na tabela newspapers
          const { error } = await supabase.from("newspapers").insert([
            {
              title: this.formNewspaper.title,
              pdf_url: uploadedPdfUrl
            }
          ]);
          if (error) throw error;
          await this.loadNewspapers();

        } else if (this.activeSection === "categorias") {
          const { error } = await supabase.from("categories").insert([
            {
              name: this.formCategory.name,
              description: this.formCategory.description,
              color: this.formCategory.color,
              icon: this.formCategory.icon
            }
          ]);
          if (error) throw error;
          await this.loadCategories();
        }

        this.closeModal();
      } catch (error) {
        alert("Erro ao realizar a operação: " + error.message);
      } finally {
        this.isSubmitting = false;
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
    <img src="../assets/icons_highlights/icon9.png" alt="Icone de Beca" class="icon-desktop" />
    <img src="../assets/icons_highlights/icon10.png" alt="Icone de Lâmpada" />
    <div class="divisor"></div>
    <h1>Criações</h1>
    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img src="../assets/icons_highlights/icon12.png" alt="Icone de Colmeia" class="icon-desktop" />
  </div>

  <main>
    <aside class="container-left">
      <button class="option" :class="{ active: activeSection === 'artigos' }" type="button"
        @click="setSection('artigos')">
        <h3>Artigos</h3>
      </button>
      <button class="option" :class="{ active: activeSection === 'jornais' }" type="button"
        @click="setSection('jornais')">
        <h3>Jornais</h3>
      </button>
      <button class="option" :class="{ active: activeSection === 'categorias' }" type="button"
        @click="setSection('categorias')">
        <h3>Categorias</h3>
      </button>
    </aside>

    <div class="container-right">
      <div class="total-items">
        <p>{{ totalItemsLabel }}</p>
        <button @click="openModal">{{ currentSection.actionLabel }}</button>
      </div>
      <div class="status-filters" v-if="activeSection === 'artigos'">
        <button v-for="filter in statusFilters" :key="filter.value" class="status-filter"
          :class="{ active: activeStatusFilter === filter.value }" type="button" @click="setStatusFilter(filter.value)">
          {{ filter.label }}
        </button>
      </div>

      <div class="posts-grid">
        <CardPost v-if="activeSection === 'artigos'" v-for="post in filteredItems" :key="post.id" :id="post.id"
          :image="post.image" :category="post.category" :category-color="post.categoryColor" :title="post.title"
          :content="post.content" :author="post.author" :status="post.status" />
        <CardNewspaper v-else-if="activeSection === 'jornais'" v-for="newspaper in filteredItems" :key="newspaper.id"
          :id="newspaper.id" :title="newspaper.title" :pdf-url="newspaper.pdfUrl" :published-at="newspaper.publishedAt"
          :show-status="false" />
        <CardCategory v-else-if="activeSection === 'categorias'" v-for="category in filteredItems" :key="category.id"
          :id="category.id" :name="category.name" :description="category.description" :color="category.color"
          :icon="category.icon" :created-at="category.createdAt" />
      </div>
    </div>
  </main>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ currentSection.actionLabel }}</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleCreate">
        <div v-if="activeSection === 'artigos'" class="form-group-container">
          <div class="form-group">
            <label>Título *</label>
            <input v-model="formPost.title" type="text" required placeholder="Ex: Gincana Escolar 2026" />
          </div>
          <div class="form-group">
            <label>Subtítulo</label>
            <input v-model="formPost.subtitle" type="text" placeholder="Breve resumo do artigo" />
          </div>
          <div class="form-group">
            <label>Categoria *</label>
            <select v-model="formPost.category_id" required>
              <option value="" disabled>Selecione uma categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Imagem de Capa *</label>
            <div class="file-upload-wrapper">
              <label for="cover-image" class="custom-file-upload">
                Escolher Imagem
              </label>
              <input id="cover-image" ref="imageInput" type="file" accept="image/*" @change="handleImageChange" required />
              
              <span class="file-name" v-if="imageFile">{{ imageFile.name }}</span>
              <span class="file-name empty" v-else>Nenhum arquivo selecionado</span>
            </div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formPost.status">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div class="form-group">
            <label>Conteúdo *</label>
            <textarea v-model="formPost.content" rows="5" required
              placeholder="Digite o texto do artigo aqui..."></textarea>
          </div>
        </div>

        <div v-if="activeSection === 'jornais'" class="form-group-container">
          <div class="form-group">
            <label>Título da Edição *</label>
            <input v-model="formNewspaper.title" type="text" required placeholder="Ex: Edição Nº 45 - Outubro" />
          </div>
          <div class="form-group">
            <label>Arquivo PDF do Jornal *</label>
            <div class="file-upload-wrapper">
              <label for="pdf-file" class="custom-file-upload">
                Escolher PDF
              </label>
              <input id="pdf-file" ref="pdfInput" type="file" accept=".pdf" @change="handlePdfChange" required />
              
              <span class="file-name" v-if="pdfFile">{{ pdfFile.name }}</span>
              <span class="file-name empty" v-else>Nenhum arquivo selecionado</span>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'categorias'" class="form-group-container">
          <div class="form-group">
            <label>Nome da Categoria *</label>
            <input v-model="formCategory.name" type="text" required placeholder="Ex: Esportes, Ciência" />
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <input v-model="formCategory.description" type="text" placeholder="Sobre o que fala essa categoria" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Cor Identificadora *</label>
              <input v-model="formCategory.color" type="color" required />
            </div>
            <div class="form-group">
              <label>Nome do Ícone *</label>
              <input v-model="formCategory.icon" type="text" required placeholder="Ex: sports_soccer, school" />
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando Arquivos...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <FooterTemplate />
</template>

<style scoped>
/* Estilos anteriores mantidos para preservação visual */
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
  background: linear-gradient(white, white) padding-box, linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167) border-box;
}

.option h3 {
  font-size: 18px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 1rem 0;
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

/* MODAL & FILE INPUT STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: #ffffff;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  border-radius: 24px;
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-family: var(--secondary-font);
  font-size: 22px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #777;
}

.form-group-container {
  overflow-y: auto;
  max-height: 50vh;
  padding-right: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.7rem 1rem;
  border: 1px solid #cccccc;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
}

.form-group input[type="color"] {
  height: 46px; /* Altura alinhada com os outros inputs */
  padding: 0.3rem; /* Sobrescreve o padding grande que estava quebrando o input */
  cursor: pointer;
  width: 100%;
}

/* Deixa o quadradinho da cor mais bonito no Chrome, Edge e Safari */
.form-group input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.form-group input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 8px; /* Mantém o padrão arredondado do projeto */
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.btn-cancel {
  background: none;
  border: 1px solid #aaa;
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
}

.btn-submit {
  background-color: var(--color-green);
  color: white;
  border: none;
  padding: 0.6rem 2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.2rem;
}

/* Esconde o botão feio padrão do navegador */
.file-upload-wrapper input[type="file"] {
  display: none;
}

/* Transforma a label no nosso novo botão */
.custom-file-upload {
  background-color: #f5f5f5;
  border: 1px solid #cccccc;
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  font-family: var(--primary-font);
  font-size: 14px;
  font-weight: 500;
  color: #444;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Efeito ao passar o mouse (Hover usando as cores do seu projeto) */
.custom-file-upload:hover {
  background-color: var(--color-green); /* Usa a variável de cor do seu projeto */
  border-color: var(--color-green);
  color: #ffffff;
}

/* Texto lateral indicando o arquivo escolhido */
.file-name {
  font-size: 13px;
  color: #333;
  font-family: var(--primary-font);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* Evita que nomes muito longos quebrem o layout */
}

.file-name.empty {
  color: #888;
  font-style: italic;
}

@media (max-width: 768px) {
  main {
    flex-direction: column;
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
    flex: 1;
  }

  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .icon-desktop {
    display: none !important;
  }

  .header-page h1 {
    font-size: 22px;
  }

  main {
    width: 95%;
    margin: 1rem auto 2rem;
  }

  .container-left {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .option {
    flex: 1 1 30%;
    min-width: 100px;
  }

  .total-items {
    flex-direction: column;
    text-align: center;
  }

  .total-items button {
    width: 100%;
  }

  .status-filter {
    flex: 1 1 45%;
  } 

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .file-upload-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>