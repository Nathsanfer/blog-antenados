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

      // Controle do Modal de Criação / Edição
      showModal: false,
      isSubmitting: false,
      isEditing: false,
      editingId: null,
      isTeacherLogged: false,

      // Controle de Exclusão Customizada
      deleteConfig: {
        show: false,
        id: null,
        isDeleting: false,
      },

      // Sistema de Notificações (Toasts)
      toast: {
        show: false,
        message: "",
        type: "success", // 'success' ou 'error'
      },
      toastTimeout: null,

      // Arquivos selecionados pelo usuário para upload
      imageFile: null,
      pdfFile: null,

      // Modelos de dados dos Formulários
      formPost: { title: "", subtitle: "", content: "", category_id: "", status: "draft" },
      formNewspaper: { title: "" },
      formCategory: { name: "", description: "", color: "#6dac7e", icon: "article" },

      statusLabels: { draft: "Rascunho", published: "Publicado", archived: "Arquivado" },
      statusFilters: [
        { label: "Todos", value: "todos" },
        { label: "Rascunho", value: "draft" },
        { label: "Publicado", value: "published" },
        { label: "Arquivado", value: "archived" },
      ],
      sections: {
        artigos: { label: "Artigos", actionLabel: "Artigo" },
        jornais: { label: "Jornais", actionLabel: "Jornal" },
        categorias: { label: "Categorias", actionLabel: "Categoria" },
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
        if (this.activeStatusFilter === "todos") return items;
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
    await this.checkUserPermissions();
    await this.loadPosts();
    await this.loadNewspapers();
    await this.loadCategories();
  },
  methods: {
    // Método para exibir toasts de notificação
    showToast(message, type = "success") {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;

      if (this.toastTimeout) clearTimeout(this.toastTimeout);

      this.toastTimeout = setTimeout(() => {
        this.toast.show = false;
      }, 3500); // Some após 3.5 segundos
    },

    async checkUserPermissions() {
      try {
        // verifica se existe uma sessão ativa no Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          this.isTeacherLogged = false;
        } else {
          // tem usuário logado
          this.isTeacherLogged = true;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        this.isTeacherLogged = false;
      }
    },
    // Captura de Arquivos nos Inputs Customizados
    handleImageChange(event) {
      this.imageFile = event.target.files[0];
    },
    handlePdfChange(event) {
      this.pdfFile = event.target.files[0];
    },

    // Métodos de Carregamento
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
          subtitle: p.subtitle || "",
          fullContent: p.content || "",
          content: p.subtitle || "",
          author: p.users?.name || "Anônimo",
          status: p.status || "draft",
        }));
      } catch (e) {
        console.error("Erro ao buscar os posts:", e);
        this.showToast("Erro ao carregar artigos.", "error");
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
        this.showToast("Erro ao carregar jornais.", "error");
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
        this.showToast("Erro ao carregar categorias.", "error");
      }
    },

    // Interpolação de Ações enviadas pelos Cards (Editar/Excluir)
    async handleItemAction({ action, id }) {
      if (action === 'edit') {
        this.openEditModal(id);
      } else if (action === 'delete') {
        this.deleteConfig.id = id;
        this.deleteConfig.show = true;
      }
    },

    // Confirmação de Exclusão Customizada
    cancelDelete() {
      this.deleteConfig.show = false;
      this.deleteConfig.id = null;
    },

    // Confirmação de Exclusão Customizada com Prompt de Confirmação
    async confirmDelete() {
      this.deleteConfig.isDeleting = true;
      try {
        let table = this.activeSection === 'artigos' ? 'posts' :
          this.activeSection === 'jornais' ? 'newspapers' : 'categories';

        const { error } = await supabase.from(table).delete().eq('id', this.deleteConfig.id);
        if (error) throw error;

        this.showToast("Item excluído com sucesso!", "success");

        if (this.activeSection === 'artigos') await this.loadPosts();
        if (this.activeSection === 'jornais') await this.loadNewspapers();
        if (this.activeSection === 'categorias') await this.loadCategories();
      } catch (error) {
        this.showToast("Erro ao excluir: " + error.message, "error");
      } finally {
        this.deleteConfig.isDeleting = false;
        this.cancelDelete();
      }
    },

    async deleteItem(id) {
      const confirmacao = confirm("Tem a certeza que deseja excluir este item permanentemente?");
      if (!confirmacao) return;

      try {
        let table = this.activeSection === 'artigos' ? 'posts' :
          this.activeSection === 'jornais' ? 'newspapers' : 'categories';

        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;

        // Recarrega apenas a seção ativa após deletar
        if (this.activeSection === 'artigos') await this.loadPosts();
        if (this.activeSection === 'jornais') await this.loadNewspapers();
        if (this.activeSection === 'categorias') await this.loadCategories();
      } catch (error) {
        alert("Erro ao excluir: " + error.message);
      }
    },

    // Métodos de Controle de Exibição do Modal
    openModal() {
      this.isEditing = false;
      this.editingId = null;
      this.showModal = true;
    },

    openEditModal(id) {
      this.isEditing = true;
      this.editingId = id;

      if (this.activeSection === 'artigos') {
        const item = this.posts.find(p => p.id === id);
        const cat = this.categories.find(c => c.name === item.category);
        this.formPost = {
          title: item.title,
          subtitle: item.subtitle,
          content: item.fullContent,
          category_id: cat ? cat.id : "",
          status: item.status
        };
      } else if (this.activeSection === 'jornais') {
        const item = this.newspapers.find(n => n.id === id);
        this.formNewspaper = { title: item.title };
      } else if (this.activeSection === 'categorias') {
        const item = this.categories.find(c => c.id === id);
        this.formCategory = {
          name: item.name,
          description: item.description,
          color: item.color,
          icon: item.icon
        };
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.editingId = null;
      this.resetForms();
    },

    resetForms() {
      this.formPost = { title: "", subtitle: "", content: "", category_id: "", status: "draft" };
      this.formNewspaper = { title: "" };
      this.formCategory = { name: "", description: "", color: "#6dac7e", icon: "article" };
      this.imageFile = null;
      this.pdfFile = null;

      // Reseta os inputs nativos escondidos no DOM através das referências (refs)
      if (this.$refs.imageInput) this.$refs.imageInput.value = "";
      if (this.$refs.pdfInput) this.$refs.pdfInput.value = "";
    },

    // Auxiliar de Upload para o Supabase Storage
    async uploadFileToStorage(file, folder) {
      const fileExt = file.name.split('.').pop();
      // Garante que o arquivo possua um nome inteiramente único com timestamp e aleatoriedade
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Recupera o link público estruturado do bucket público
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    },

    // Operação de Persistência Principal Salvar Criado / Salvar Editado
    async handleCreate() {
      this.isSubmitting = true;
      try {
        if (this.activeSection === "artigos") {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user && !this.isEditing) throw new Error("Usuário não autenticado.");

          let payload = {
            title: this.formPost.title,
            subtitle: this.formPost.subtitle,
            content: this.formPost.content,
            category_id: this.formPost.category_id || null,
            status: this.formPost.status,
          };

          if (!this.isEditing) payload.author_id = user.id;

          if (this.imageFile) {
            payload.cover_image_url = await this.uploadFileToStorage(this.imageFile, 'covers');
          } else if (!this.isEditing) {
            throw new Error("Selecione uma imagem de capa.");
          }

          if (this.isEditing) {
            const { error } = await supabase.from("posts").update(payload).eq('id', this.editingId);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("posts").insert([payload]);
            if (error) throw error;
          }
          await this.loadPosts();

        } else if (this.activeSection === "jornais") {
          let payload = { title: this.formNewspaper.title };

          if (this.pdfFile) {
            payload.pdf_url = await this.uploadFileToStorage(this.pdfFile, 'pdfs');
          } else if (!this.isEditing) {
            throw new Error("Selecione um arquivo PDF.");
          }

          if (this.isEditing) {
            const { error } = await supabase.from("newspapers").update(payload).eq('id', this.editingId);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("newspapers").insert([payload]);
            if (error) throw error;
          }
          await this.loadNewspapers();

        } else if (this.activeSection === "categorias") {
          let payload = {
            name: this.formCategory.name,
            description: this.formCategory.description,
            color: this.formCategory.color,
            icon: this.formCategory.icon
          };

          if (this.isEditing) {
            const { error } = await supabase.from("categories").update(payload).eq('id', this.editingId);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("categories").insert([payload]);
            if (error) throw error;
          }
          await this.loadCategories();
        }

        this.showToast(`Item ${this.isEditing ? 'editado' : 'criado'} com sucesso!`, "success");
        this.closeModal();
      } catch (error) {
        this.showToast(error.message, "error");
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

        <button v-if="isTeacherLogged" @click="openModal">
          Criar {{ currentSection.actionLabel }}
        </button>
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
          :content="post.content" :author="post.author" :status="post.status" :can-edit="isTeacherLogged"
          @manage-item="handleItemAction" />

        <CardNewspaper v-else-if="activeSection === 'jornais'" v-for="newspaper in filteredItems" :key="newspaper.id"
          :id="newspaper.id" :title="newspaper.title" :pdf-url="newspaper.pdfUrl" :published-at="newspaper.publishedAt"
          :show-status="false" :can-edit="isTeacherLogged" @manage-item="handleItemAction" />

        <CardCategory v-else-if="activeSection === 'categorias'" v-for="category in filteredItems" :key="category.id"
          :id="category.id" :name="category.name" :description="category.description" :color="category.color"
          :icon="category.icon" :created-at="category.createdAt" :can-edit="isTeacherLogged"
          @manage-item="handleItemAction" />
      </div>
    </div>
  </main>

  <transition name="fade">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar' : 'Criar' }} {{ currentSection.actionLabel }}</h2>
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
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Imagem de Capa <span v-if="!isEditing">*</span></label>
              <div class="file-upload-wrapper">
                <label for="cover-image" class="custom-file-upload">Escolher Imagem</label>
                <input id="cover-image" ref="imageInput" type="file" accept="image/*" @change="handleImageChange"
                  :required="!isEditing" />
                <span class="file-name" v-if="imageFile">{{ imageFile.name }}</span>
                <span class="file-name empty" v-else>{{ isEditing ? 'Manter imagem atual' : 'Nenhum arquivo selecionado'
                }}</span>
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
                placeholder="Digite o texto completo do artigo..."></textarea>
            </div>
          </div>

          <div v-if="activeSection === 'jornais'" class="form-group-container">
            <div class="form-group">
              <label>Título da Edição *</label>
              <input v-model="formNewspaper.title" type="text" required placeholder="Ex: Edição Nº 45 - Outubro" />
            </div>
            <div class="form-group">
              <label>Arquivo PDF do Jornal <span v-if="!isEditing">*</span></label>
              <div class="file-upload-wrapper">
                <label for="pdf-file" class="custom-file-upload">Escolher PDF</label>
                <input id="pdf-file" ref="pdfInput" type="file" accept=".pdf" @change="handlePdfChange"
                  :required="!isEditing" />
                <span class="file-name" v-if="pdfFile">{{ pdfFile.name }}</span>
                <span class="file-name empty" v-else>{{ isEditing ? 'Manter arquivo atual' : 'Nenhum arquivo selecionado' }}</span>
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
                <input v-model="formCategory.icon" type="text" required placeholder="Ex: sports_soccer" />
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Processando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="deleteConfig.show" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-content delete-modal">
        <div class="delete-icon"></div>
        <h3>Tem certeza?</h3>
        <p>Esta ação não pode ser desfeita. O item será excluído permanentemente do sistema.</p>
        <div class="modal-actions delete-actions">
          <button type="button" class="btn-cancel" @click="cancelDelete"
            :disabled="deleteConfig.isDeleting">Cancelar</button>
          <button type="button" class="btn-delete" @click="confirmDelete" :disabled="deleteConfig.isDeleting">
            {{ deleteConfig.isDeleting ? 'Excluindo...' : 'Excluir Permanentemente' }}
          </button>
        </div>
      </div>
    </div>
  </transition>

  <transition name="toast-slide">
    <div v-if="toast.show" class="toast-notification" :class="`toast-${toast.type}`">
      <span class="toast-icon">{{ toast.type === 'success' ? '' : '' }}</span>
      <p>{{ toast.message }}</p>
    </div>
  </transition>

  <FooterTemplate />
</template>

<style scoped>
/*  Estilos da Página  */
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
  pointer-events: none;
}

.option:focus-visible {
  outline: 2px solid var(--color-green);
  outline-offset: 3px;
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
  transition: background-color 0.2s;
}

.total-items button:hover {
  background-color: #5ea06e;
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
  transition: all 0.2s;
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

/* Modais e Overlays */
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
  z-index: 2500;
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
  transition: color 0.2s;
}

.close-btn:hover {
  color: #da4167;
}

/* Formulários */
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
  font-family: var(--primary-font);
  color: #444;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.7rem 1rem;
  border: 1px solid #cccccc;
  border-radius: 12px;
  font-family: var(--primary-font);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--color-green);
}

.form-group input[type="color"] {
  height: 46px;
  padding: 0.3rem;
  cursor: pointer;
  width: 100%;
}

.form-group input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.form-group input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
}

/* Upload customizado */
.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.2rem;
}

.file-upload-wrapper input[type="file"] {
  display: none;
}

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

.custom-file-upload:hover {
  background-color: var(--color-green);
  border-color: var(--color-green);
  color: #ffffff;
}

.file-name {
  font-size: 13px;
  color: #333;
  font-family: var(--primary-font);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.file-name.empty {
  color: #888;
  font-style: italic;
}

/* Ações dos Modais */
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
  font-family: var(--primary-font);
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #f5f5f5;
}

.btn-submit {
  background-color: var(--color-green);
  color: white;
  border: none;
  padding: 0.6rem 2rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: var(--primary-font);
  font-weight: 500;
  transition: filter 0.2s;
}

.btn-submit:hover:not(:disabled) {
  filter: brightness(0.9);
}

.btn-submit:disabled,
.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal de Exclusão Customizado */
.delete-modal {
  max-width: 400px;
  text-align: center;
  align-items: center;
  padding: 2rem;
}

.delete-icon {
  font-size: 40px;
  margin-bottom: 0.5rem;
}

.delete-modal h3 {
  font-family: var(--secondary-font);
  font-size: 22px;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.delete-modal p {
  font-family: var(--primary-font);
  font-size: 14px;
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.delete-actions {
  border-top: none;
  padding-top: 0;
  justify-content: center;
  width: 100%;
  margin-top: 0;
}

.btn-delete {
  background-color: #da4167;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: var(--primary-font);
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c03558;
}

/* Toast de Notificação */
.toast-notification {
  position: fixed;
  top: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 4000;
  font-family: var(--primary-font);
  font-size: 14px;
  font-weight: 500;
}

.toast-notification p {
  margin: 0;
  color: #fff;
}

.toast-success {
  background-color: #3bb54a;
}

.toast-error {
  background-color: #da4167;
}

.toast-icon {
  font-size: 18px;
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* Responsividade */
@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
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

  /* Ajusta o toast para tablet e mobile */
  .toast-notification {
    top: auto;
    bottom: 30px;
    right: 50%;
    transform: translateX(50%);
    width: 90%;
    max-width: 400px;
    justify-content: center;
  }

  .toast-slide-enter-from,
  .toast-slide-leave-to {
    transform: translate(50%, 50px);
  }

  /* Ajuste de eixo X e Y */
}

@media (max-width: 480px) {
  .icon-desktop {
    display: none !important;
  }

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

  main {
    width: 95%;
    margin: 1rem auto 2rem;
    gap: 1rem;
  }

  .container-left {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .option {
    flex: 1 1 30%;
    min-width: 100px;
    border-radius: 12px;
  }

  .option h3 {
    font-size: 14px;
    padding: 0.6rem 0;
  }

  .container-right {
    width: 100%;
  }

  .total-items {
    flex-direction: column;
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
    width: 100%;
    padding: 0.8rem;
    font-size: 15px;
  }

  .status-filters {
    justify-content: center;
    gap: 0.5rem;
  }

  .status-filter {
    flex: 1 1 45%;
    text-align: center;
    font-size: 12px;
    padding: 0.5rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  /* Ajustes dos Modais no Mobile */
  .modal-content {
    width: 95%;
    padding: 1.25rem 1rem;
    max-height: 90vh;
  }

  .delete-modal {
    padding: 1.5rem 1rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .btn-cancel,
  .btn-submit,
  .btn-delete {
    width: 100%;
    padding: 0.8rem;
    text-align: center;
  }

  .file-upload-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>