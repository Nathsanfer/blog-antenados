<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import { supabase } from "../composables/useSupabase.js";
import { CATEGORY_ICONS } from "../lib/categories.ts";

export default {
  name: "Galeria",
  components: {
    HeaderTemplate,
  },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      CATEGORY_ICONS,
      showModal: false,
      uploading: false,
      newImage: {
        file: null,
        categoryId: "",
      },
      selectedImage: null,
    };
  },
  async mounted() {
    await this.loadCategories();
  },
  methods: {
    openImage(image) {
      this.selectedImage = image;
    },
    closeImage() {
      this.selectedImage = null;
    },
    async loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Erro ao buscar as categorias:", error);
          return;
        }

        this.categories = (data || []).map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color || "#6dac7e",
          description: category.description,
          icon: category.icon,
          createdAt: category.created_at,
        }));
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    },
    async loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select(
            `
        *,
        category_images (
          id,
          image_url,
          position
        )
      `,
          )
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Erro ao buscar as categorias:", error);
          return;
        }

        this.categories = (data || []).map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color || "#6dac7e",
          description: category.description,
          icon: category.icon,
          createdAt: category.created_at,

          images: (category.category_images || [])
            .sort((a, b) => a.position - b.position)
            .map((image) => ({
              id: image.id,
              url: image.image_url,
              position: image.position,
            })),
        }));
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    },
    handleFile(event) {
      this.newImage.file = event.target.files[0];
    },
    async uploadImage() {
      if (!this.newImage.file || !this.newImage.categoryId) {
        alert("Selecione uma imagem e uma categoria.");
        return;
      }

      this.uploading = true;

      try {
        const file = this.newImage.file;

        const extension = file.name.split(".").pop();

        const fileName = `${Date.now()}.${extension}`;

        const filePath = `${this.newImage.categoryId}/${fileName}`;

        // Upload para o bucket
        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // URL pública
        const { data } = supabase.storage
          .from("category-images")
          .getPublicUrl(filePath);

        const imageUrl = data.publicUrl;

        // descobrir posição
        const { data: images } = await supabase
          .from("category_images")
          .select("position")
          .eq("category_id", this.newImage.categoryId)
          .order("position", { ascending: false })
          .limit(1);

        const nextPosition =
          images && images.length ? images[0].position + 1 : 0;

        // salvar no banco
        const { error } = await supabase.from("category_images").insert({
          category_id: this.newImage.categoryId,
          image_url: imageUrl,
          position: nextPosition,
        });

        if (error) throw error;

        this.showModal = false;

        this.newImage = {
          file: null,
          categoryId: "",
        };

        await this.loadCategories();
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar imagem.");
      } finally {
        this.uploading = false;
      }
    },
    selectCategory(categoryId) {
      this.selectedCategory =
        this.selectedCategory === categoryId ? null : categoryId;
    },
    clearFilter() {
      this.selectedCategory = null;
    },
    // SOLUÇÃO DO ÍCONE: Método que recebe a string de ícone de cada categoria
    getCategoryIcon(iconName) {
      return this.CATEGORY_ICONS[iconName] || this.CATEGORY_ICONS.lamp;
    },
    // SOLUÇÃO DA DATA: Método que formata a string ISO vinda do Supabase para pt-BR
    formatCategoryDate(dateString) {
      if (!dateString) return "Data indisponível";
      return new Date(dateString).toLocaleDateString("pt-BR");
    },
    getImageClass(index) {
      if (index % 7 === 1) return "vertical";
      if (index % 7 === 4) return "horizontal";
      return "";
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
    <h1>Galeria</h1>
    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img
      src="../assets/icons_highlights/icon12.png"
      alt="Icone de Colmeia"
      class="icon-desktop"
    />
  </div>

  <main>
    <div class="container-filters">
      <div class="filters">
        <h3>Utilize os Filtros:</h3>
        <div
          class="filter-item"
          :class="{ active: selectedCategory == null }"
          @click="clearFilter"
        >
          <p>Todos</p>
        </div>
        <div
          v-for="category in categories"
          :key="category.id"
          class="filter-item"
          :class="{ active: selectedCategory === category.id }"
          :style="{ '--category-color': category.color }"
          @click="selectCategory(category.id)"
        >
          <p>{{ category.name }}</p>
        </div>
      </div>
      <button class="see-all" @click="showModal = true">
        <p>+</p>
      </button>
    </div>

    <section
      class="theme"
      v-for="category in categories"
      :key="category.id"
      v-show="selectedCategory === null || selectedCategory === category.id"
    >
      <div class="header-theme">
        <div
          class="theme-icon"
          :style="{ backgroundColor: category.color || '#6dac7e' }"
        >
          <img :src="getCategoryIcon(category.icon)" alt="Icone de Tema" />
        </div>
        <div class="theme-content">
          <h1 class="title">{{ category.name }}</h1>
          <p class="description">{{ category.description }}</p>
          <p class="date">{{ formatCategoryDate(category.createdAt) }}</p>
        </div>
      </div>

      <div class="container-images">
        <div
          v-for="(image, index) in category.images"
          :key="image.id"
          class="item-gallery"
          :class="getImageClass(index)"
          @click="openImage(image)"
        >
          <img
            :src="image.url"
            :alt="`${category.name} ${index + 1}`"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  </main>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
      <h2>Adicionar Foto</h2>

      <div class="field">
        <label>Categoria</label>

        <select v-model="newImage.categoryId">
          <option disabled value="">Selecione...</option>

          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Imagem</label>

        <input type="file" accept="image/*" @change="handleFile" />
      </div>

      <div class="actions">
        <button class="cancel" @click="showModal = false">Cancelar</button>

        <button class="save" @click="uploadImage" :disabled="uploading">
          {{ uploading ? "Enviando..." : "Salvar" }}
        </button>
      </div>
    </div>
  </div>

  <div
  v-if="selectedImage"
  class="image-viewer"
  @click.self="closeImage"
>
  <button class="close-image" @click="closeImage">
    ✕
  </button>

  <img
    :src="selectedImage.url"
    alt="Imagem ampliada"
  />
</div>
</template>

<style scoped>
.image-viewer{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.82);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9999;
    animation:fade .25s;
}

.image-viewer img{
    max-width:92vw;
    max-height:92vh;
    object-fit:contain;
    border-radius:12px;
    box-shadow:0 10px 40px rgba(0,0,0,.5);
}

.close-image{
    position:absolute;
    top:25px;
    right:30px;
    width:45px;
    height:45px;
    border:none;
    border-radius:50%;
    background:white;
    cursor:pointer;
    font-size:20px;
    transition:.2s;
}

.close-image:hover{
    transform:scale(1.1);
}

.item-gallery{
    cursor:pointer;
}

.item-gallery img{
    transition:.3s;
}

.item-gallery:hover img{
    transform:scale(1.05);
}

@keyframes fade{
    from{
        opacity:0;
    }
    to{
        opacity:1;
    }
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  width: 420px;
  max-width: 90%;
  background: #fff;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.modal h2 {
  margin: 0;
  font-family: var(--secondary-font);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-weight: 600;
}

.field input,
.field select {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions button {
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
}

.cancel {
  background: #ececec;
}

.save {
  background: #6dac7e;
  color: white;
}

/* Seus estilos CSS permanecem intactos aqui abaixo */
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
  margin: 0 auto;
  flex-direction: column;
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto 4rem;
  gap: 3rem;
  overflow-x: hidden;
}
.container-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 0.3rem;
}
.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.filters h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  font-family: var(--secondary-font);
}
.filter-item {
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-transform: uppercase;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  background:
    linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.15)),
    var(--category-color, #b2a1bc);
}
.filter-item p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}
.filter-item.active {
  color: #ffffff;
  border: 2px solid #6dac7e;
}
.filter-item:hover {
  transform: translateY(-2px);
}
.filter-item.active p {
  color: white;
}
.see-all {
  text-decoration: none;
  border: 3px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #aea784, #83ae8e, #85d8de, #a274c0, #d27f94);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.see-all p {
  margin: 0;
  font-weight: 400;
  color: #333;
  font-size: 20px;
}
.theme {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  gap: 2rem;
}
.header-theme {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 99%;
  margin: 0 auto;
  margin-top: -1rem;
  height: 7rem;
  border-radius: 15px;
  box-shadow: 0px 2px 13px rgba(0, 0, 0, 0.1);
}
.theme-icon {
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px 0px 0px 15px;
}
.theme-icon img {
  width: 65px;
  height: 65px;
  object-fit: contain;
}
.theme-content {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
}
.title {
  font-size: 24px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
}
.description {
  font-size: 14px;
  font-weight: 400;
  font-family: var(--primary-font);
  margin: 0;
  color: #222;
  margin-bottom: 0.5rem;
}
.date {
  font-size: 14px;
  font-weight: 300;
  font-family: var(--primary-font);
  margin: 0;
}
.container-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
  padding: 1rem 0;
  grid-auto-flow: dense;
}
.item-gallery {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}
.item-gallery:hover {
  transform: scale(1.02);
}
.item-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.item-gallery.vertical {
  grid-row: span 2;
}
.item-gallery.horizontal {
  grid-column: span 2;
}
@media (max-width: 600px) {
  .item-gallery.horizontal {
    grid-column: span 1;
  }
  .container-images {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: 150px;
  }
}
</style>
