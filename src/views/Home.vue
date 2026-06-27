<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import CardPost from "../components/CardPost.vue";
import CardNewspaper from "../components/CardNewspaper.vue";
import { supabase } from "../composables/useSupabase.js";
import { CATEGORY_ICONS } from "../lib/categories.ts";

const router = useRouter();

const posts = ref([]);
const newspapers = ref([]);
const categories = ref([]);
const galleryImages = ref([]);

function goToAllPosts() {
  router.push("/blog");
}

function goToAllNewspapers() {
  router.push("/blog?section=jornais");
}

function goToGallery() {
  router.push("/galeria");
}

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchGalleryImages(),
    fetchPosts(),
    fetchNewspapers(),
  ]);
});

async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return;
    }

    categories.value = (data || []).map((c) => ({
      id: c.id,
      nome: c.name || "",
      cor: c.color || "#da4167",
      icone: CATEGORY_ICONS[c.icon] || CATEGORY_ICONS.lamp,
    }));
  } catch (e) {
    console.error("Erro ao buscar categorias:", e);
  }
}

async function fetchGalleryImages() {
  try {
    const { data, error } = await supabase
      .from("category_images")
      .select(
        `
        id,
        image_url,
        position,
        category_id
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar imagens:", error);
      return;
    }

    galleryImages.value = data || [];
  } catch (err) {
    console.error(err);
  }
}

async function fetchPosts() {
  try {
    const { data, error } = await supabase
      .from("post_cards")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Erro ao buscar posts:", error);
      return;
    }

    posts.value = (data || []).map((p) => ({
      id: p.id,
      image: p.cover_image_url || "../assets/post.jpg",
      category: p.category_name || "",
      categoryColor: p.category_color || "#da4167",
      title: p.title || "",
      content: p.subtitle || "",
      author: p.author_name || "",
    }));
  } catch (e) {
    console.error("Erro ao buscar posts:", e);
  }
}

async function fetchNewspapers() {
  try {
    const { data, error } = await supabase
      .from("newspapers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Erro ao buscar jornais:", error);
      return;
    }

    newspapers.value = (data || []).map((n) => ({
      id: n.id,
      title: n.title || "",
      status: n.status || "draft",
      createdAt: n.created_at || "",
      pdfUrl: n.pdf_url || "",
      showStatus: false,
    }));
  } catch (e) {
    console.error("Erro ao buscar jornais:", e);
  }
}

function getGalleryClass(index) {
  switch (index) {
    case 0:
      return "main-item";

    case 1:
    case 2:
      return "tall-item";

    case 3:
      return "wide-item";

    default:
      return "standard-item";
  }
}

function getMainImageCategory() {
  if (!galleryImages.value.length) return "Galeria";
  return "Galeria Cultural";
}
</script>

<template>
  <HeaderTemplate />

  <main class="page-content">
    <div class="banner">
      <img src="../assets/banner.png" alt="Banner" />
    </div>

    <section class="categories">
      <h1 class="title1">Explore por temas (Destaques)</h1>
      <ul class="list-themes">
        <li
          class="item-theme"
          v-for="category in categories"
          :key="category.id"
        >
          <div
            class="container-icon"
            :style="{ backgroundColor: category.cor }"
          >
            <img
              :src="category.icone"
              :alt="`Icone para o tema ${category.nome}`"
            />
          </div>
          <p class="name-theme">{{ category.nome }}</p>
        </li>
      </ul>
    </section>

    <div class="decoration">
      <img src="../assets/decoration.png" alt="" />
      <img src="../assets/decoration.png" alt="" />
    </div>

    <section class="objectives">
      <div class="section-header">
        <div class="divisor"></div>
        <h1 class="title2">Objetivos</h1>
        <div class="divisor"></div>
      </div>
      <div class="container-topics">
        <ul class="item-objective1">
          <li class="item">
            <div class="icon">
              <img src="../assets/icons_highlights/icon2.png" alt="" />
            </div>
            <div class="topic-content1">
              <h3 class="subtitle">Preservar a Cultura</h3>
              <p class="description">
                Documentamos e valorizamos as manifestações culturais e
                folclóricas que fazem parte de nossa identidade, garantindo que
                tradições ancestrais sejam conhecidas e respeitadas pelas
                gerações futuras.
              </p>
            </div>
          </li>
          <li class="item">
            <div class="icon">
              <img src="../assets/icons_highlights/icon2.png" alt="" />
            </div>
            <div class="topic-content1">
              <h3 class="subtitle">Ampliar Conhecimento</h3>
              <p class="description">
                Promovemos conteúdo educativo e informativo que contribui para o
                desenvolvimento intelectual de nossos leitores, inspirando o
                pensamento crítico e a curiosidade pelo conhecimento.
              </p>
            </div>
          </li>
        </ul>
        <div class="container-divisor">
          <div class="divisor-objective"></div>
          <div class="images-divisor">
            <img src="../assets/icons_highlights/icon5.png" alt="" />
            <img
              class="image-right"
              src="../assets/icons_highlights/icon5.png"
              alt=""
            />
          </div>
        </div>
        <ul class="item-objective2">
          <li class="item">
            <div class="topic-content2">
              <h3 class="subtitle">Fortalecer Identidades</h3>
              <p class="description">
                Celebramos a diversidade e promovemos a inclusão, reconhecendo e
                valorizando as diferentes vozes, experiências e perspectivas que
                enriquecem nossa comunidade.
              </p>
            </div>
            <div class="icon">
              <img src="../assets/icons_highlights/icon2.png" alt="" />
            </div>
          </li>
          <li class="item">
            <div class="topic-content2">
              <h3 class="subtitle">Engajar a Comunidade</h3>
              <p class="description">
                Criamos um espaço de diálogo e troca de ideias onde todos possam
                compartilhar suas histórias, aprender com os outros e contribuir
                para um futuro mais consciente e conectado.
              </p>
            </div>
            <div class="icon">
              <img src="../assets/icons_highlights/icon2.png" alt="" />
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="insight">
      <div class="icon-top-right">
        <img
          src="../assets/icons_highlights/icon6.png"
          alt="Ícone superior direito"
        />
      </div>
      <div class="insight-content">
        <h2 class="title3">Busca pelo Saber</h2>
        <p class="word">
          "Sem a cultura, e a liberdade relativa que ela pressupõe, a sociedade,
          por mais perfeita que seja, não passa de uma selva. É por isso que
          toda a criação autêntica é um dom para o futuro."
        </p>
        <div class="author">
          <img
            src="../assets/author.png"
            alt="Imagem do autor da frase, Albert Camus"
          />
          <div class="author-content">
            <p class="name">Albert Camus</p>
            <p class="text">Escritor e Filósofo</p>
          </div>
        </div>
      </div>
      <div class="icon-bottom-left">
        <img
          src="../assets/icons_highlights/icon7.png"
          alt="Ícone inferior esquerdo"
        />
      </div>
    </section>

    <section class="gallery-preview">
      <div class="gallery-header">
        <div class="section-header">
          <div class="divisor"></div>
          <h1 class="title2">📸 Nossa Galeria</h1>
          <div class="divisor"></div>
        </div>

        <p class="gallery-subtitle">
          Uma prévia dos registros visuais e produções artísticas da comunidade
        </p>
      </div>

      <div class="bento-gallery" v-if="galleryImages.length">
        <div
          v-for="(image, index) in galleryImages.slice(0, 6)"
          :key="image.id"
          class="bento-item"
          :class="getGalleryClass(index)"
        >
          <img
            :src="image.image_url"
            :alt="`Imagem ${index + 1}`"
            loading="lazy"
          />

          <!-- Overlay somente na primeira imagem -->
          <div v-if="index === 0" class="bento-overlay">
            <span>{{ getMainImageCategory() }}</span>
          </div>
        </div>
      </div>

      <div v-else class="gallery-empty">
        <p>Nenhuma imagem cadastrada.</p>
      </div>

      <button class="btn btn-primary" @click="goToGallery">
        Explorar Galeria Completa
      </button>
    </section>

    <section class="newspapers">
      <div class="newspapers-header">
        <div class="section-header">
          <div class="divisor"></div>
          <h1 class="title2">📰 Leia Nossos Jornais</h1>
          <div class="divisor"></div>
        </div>
        <p class="newspapers-subtitle">
          Explore edições especiais e mantenha-se informado
        </p>
      </div>
      <div class="newspapers-grid">
        <CardNewspaper
          v-for="newspaper in newspapers"
          :key="newspaper.id"
          :id="newspaper.id"
          :title="newspaper.title"
          :created-at="newspaper.createdAt"
          :pdf-url="newspaper.pdfUrl"
        />
      </div>
      <button class="btn btn-primary" @click="goToAllNewspapers">
        Ver Mais Jornais
      </button>
    </section>

    <section class="recent-posts">
      <div class="recent-posts-header">
        <div class="section-header">
          <div class="divisor"></div>
          <h1 class="title2">✍️ Postagens Recentes</h1>
          <div class="divisor"></div>
        </div>
        <p class="recent-posts-subtitle">
          Acompanhe os últimos artigos e histórias da comunidade
        </p>
      </div>
      <div class="posts">
        <CardPost
          v-for="post in posts"
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
      <button class="btn btn-primary" @click="goToAllPosts">
        Ver Mais Postagens
      </button>
    </section>
  </main>

  <FooterTemplate />
</template>

<style scoped>
.gallery-empty {
  width: 100%;
  height: 320px;
  border-radius: 20px;
  border: 2px dashed #d6d6d6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-family: var(--primary-font);
  font-size: 16px;
}

/* ===== Gallery Preview (Novo) ===== */
.gallery-preview {
  max-width: 1200px;
  margin: 6rem auto 1rem;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.gallery-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.gallery-subtitle {
  font-size: 16px;
  font-family: var(--primary-font);
  color: #666;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.3px;
  text-align: center;
}

/* Estrutura Bento Box / Mosaico Organizado */
.bento-gallery {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 140px;
  gap: 1.25rem;
  animation: fadeInUp 0.6s ease;
}

.bento-item {
  position: relative;
  overflow: hidden;
  border-radius: 20px; /* Alinhado com o estilo dos seus cards/botões */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease;
}

.bento-item:hover {
  transform: scale(1.015) translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.bento-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Definições de grid assimétrico */
.bento-item.main-item {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-item.tall-item {
  grid-column: span 1;
  grid-row: span 2;
}

.bento-item.wide-item {
  grid-column: span 2;
  grid-row: span 1;
}

.bento-item.standard-item {
  grid-column: span 1;
  grid-row: span 1;
}

/* Efeito sutil de tag/overlay no item principal */
.bento-overlay {
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 0.4rem 1rem;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bento-overlay span {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--primary-font);
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ==========================================
   RESPONSIVIDADE DA GALERIA (Ajustes de Breakpoints)
   ========================================== */

@media (max-width: 1024px) {
  .bento-gallery {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 130px;
  }
  /* Remodela o grid para 3 colunas */
  .bento-item.main-item {
    grid-column: span 2;
    grid-row: span 2;
  }
  .bento-item.tall-item {
    grid-column: span 1;
    grid-row: span 2;
  }
  .bento-item.wide-item {
    grid-column: span 2;
    grid-row: span 1;
  }
  .bento-item.standard-item {
    grid-column: span 1;
    grid-row: span 1;
  }
}

@media (max-width: 768px) {
  .gallery-preview {
    margin: 4.5rem auto 1rem;
  }
  .gallery-subtitle {
    font-size: 13px;
    padding: 0 1rem;
  }
  .bento-gallery {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 140px;
    max-width: 460px;
    margin: 0 auto;
    gap: 1rem;
  }
  /* Força comportamento uniforme em telas menores para evitar quebras */
  .bento-item.main-item,
  .bento-item.tall-item,
  .bento-item.wide-item,
  .bento-item.standard-item {
    grid-column: span 1;
    grid-row: span 1;
  }
  /* Mantém apenas o primeiro item maior para manter o charme visual */
  .bento-item.main-item {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 480px) {
  .bento-gallery {
    max-width: 100%;
    grid-template-columns: 1fr;
    grid-auto-rows: 180px;
  }
  .bento-item.main-item {
    grid-column: span 1;
  }
}

/* ===== Base ===== */
.page-content {
  overflow-x: hidden;
  width: 100%;
}

/* ===== Banner ===== */
.banner {
  width: 100%;
  margin-top: -1.2rem;
  overflow: hidden;
}

.banner img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
}

/* ===== Categories ===== */
.categories {
  max-width: 1200px;
  margin: 3.5rem auto 0;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.title1 {
  font-size: 30px;
  font-weight: 500;
  font-family: var(--secondary-font);
  max-width: 18rem;
  line-height: 1.3;
}

.list-themes {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.item-theme {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.item-theme:hover {
  transform: translateY(-4px);
}

.container-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s ease;
}

.item-theme:hover .container-icon {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.list-themes li:nth-child(1) .container-icon {
  background-color: var(--pastel-pink);
}
.list-themes li:nth-child(2) .container-icon {
  background-color: var(--pastel-green);
}
.list-themes li:nth-child(3) .container-icon {
  background-color: var(--pastel-orange);
}
.list-themes li:nth-child(4) .container-icon {
  background-color: var(--pastel-blue);
}

.container-icon img {
  width: 65%;
  height: 65%;
  object-fit: contain;
}

.name-theme {
  font-size: 12px;
  width: 80px;
  text-align: center;
  font-family: var(--primary-font);
}

/* ===== Decoration ===== */
.decoration {
  max-width: 1100px;
  height: 25px;
  margin: 2.5rem auto 0;
  padding: 0 2rem;
  display: flex;
}

.decoration img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== Objectives ===== */
.objectives {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.divisor {
  flex: 1;
  height: 1px;
  background-color: #000;
}

.title2 {
  font-size: 34px;
  font-weight: 500;
  font-family: var(--secondary-font);
  white-space: nowrap;
}

.container-topics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
}

.item-objective1,
.item-objective2 {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}

.item {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: flex-start;
}

.icon {
  width: 72px;
  height: 72px;
  min-width: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.item-objective1 li:nth-child(1) .icon {
  background-color: var(--pastel-pink);
}
.item-objective1 li:nth-child(2) .icon {
  background-color: var(--pastel-orange);
}
.item-objective2 li:nth-child(1) .icon {
  background-color: var(--pastel-green);
}
.item-objective2 li:nth-child(2) .icon {
  background-color: var(--pastel-blue);
}

.icon img {
  width: 65%;
  height: 65%;
  object-fit: contain;
}

.topic-content1,
.topic-content2 {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.topic-content2 {
  text-align: end;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  font-family: var(--secondary-font);
  margin: 0 0 0.3rem;
}

.description {
  font-size: 13px;
  font-family: var(--primary-font);
  line-height: 1.6;
  color: #555;
  margin: 0;
}

/* Central divider */
.container-divisor {
  position: relative;
  width: 80px;
  flex-shrink: 0;
  align-self: stretch;
}

.divisor-objective {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background-image: repeating-linear-gradient(
    to bottom,
    #000 0,
    #000 14px,
    transparent 14px,
    transparent 24px
  );
  z-index: 0;
}

.images-divisor {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6rem;
  align-items: center;
}

.images-divisor img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: #fff;
  border-radius: 50%;
  display: block;
}

.image-right {
  transform: rotate(250deg);
}

/* ===== Insight ===== */
.insight {
  position: relative;
  max-width: 1000px;
  width: calc(100% - 4rem);
  margin: 6rem auto;
  padding: 2.5rem 3rem;
  border-radius: 30px;
  border: 2px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167)
      border-box;
}

.icon-top-right {
  position: absolute;
  top: -28px;
  right: -28px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.icon-bottom-left {
  position: absolute;
  bottom: -28px;
  left: -28px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.icon-top-right img,
.icon-bottom-left img {
  width: 85%;
  height: 85%;
  object-fit: contain;
}

.insight-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
}

.title3 {
  font-size: 24px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
}

.word {
  font-size: 15px;
  max-width: 700px;
  font-family: var(--primary-font);
  text-align: center;
  font-style: italic;
  line-height: 1.75;
  color: #333;
  margin: 0;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.author-content {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--primary-font);
  margin: 0;
}

.text {
  font-size: 12px;
  font-family: var(--primary-font);
  margin: 0;
  color: #666;
}

/* ===== Recent Posts ===== */
.recent-posts {
  max-width: 1200px;
  margin: 3rem auto 1rem;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.recent-posts-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.recent-posts-subtitle {
  font-size: 16px;
  font-family: var(--primary-font);
  color: #666;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.posts {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  animation: fadeInUp 0.6s ease;
}

.link-btn {
  text-decoration: none;
}

.btn {
  padding: 10px 52px;
  background-color: var(--color-green);
  color: #fff;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-family: var(--primary-font);
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn:hover {
  background-color: #5a9a70;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(109, 172, 131, 0.4);
}

.btn-primary {
  background-color: var(--color-green);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.3s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  background-color: #5a9a70;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(109, 172, 131, 0.5);
}

/* ===== Newspapers ===== */
.newspapers {
  max-width: 1200px;
  margin: 6rem auto 5rem;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.newspapers-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.newspapers-subtitle {
  font-size: 16px;
  font-family: var(--primary-font);
  color: #666;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.newspapers-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================
   RESPONSIVE BREAKPOINTS
   ============================ */

/* Tablet landscape / small desktop */
@media (max-width: 1024px) {
  .banner img {
    height: 320px;
  }

  .posts {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }

  .newspapers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }

  .description {
    font-size: 12px;
  }
}

/* Tablet portrait */
@media (max-width: 768px) {
  .banner img {
    height: 240px;
  }

  .categories {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .title1 {
    font-size: 26px;
    max-width: 100%;
  }

  .title2 {
    font-size: 26px;
  }

  .list-themes {
    gap: 2rem;
  }

  .container-topics {
    flex-direction: column;
    gap: 2.5rem;
  }

  .container-divisor {
    display: none;
  }

  .item-objective1,
  .item-objective2 {
    width: 100%;
    gap: 2rem;
  }

  /* Objective 2: reverse items so icon appears first */
  .item-objective2 .item {
    flex-direction: row-reverse;
  }

  .topic-content2 {
    text-align: left;
  }

  .insight {
    width: calc(100% - 3rem);
    padding: 2rem 1.75rem;
    margin: 4.5rem auto;
  }

  .icon-top-right {
    width: 56px;
    height: 56px;
    top: -20px;
    right: -18px;
  }

  .icon-bottom-left {
    width: 56px;
    height: 56px;
    bottom: -20px;
    left: -18px;
  }

  .posts {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }

  .newspapers-grid {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .banner img {
    height: 205px;
    margin-bottom: -1.2rem;
  }

  .categories {
    padding: 0 1rem;
  }

  .title1 {
    font-size: 22px;
  }

  .list-themes {
    gap: 2rem;
  }

  .container-icon {
    width: 60px;
    height: 60px;
  }

  .name-theme {
    font-size: 10px;
    width: 60px;
  }

  .decoration {
    max-width: 200px;
    margin: 2rem auto 0;
    padding: 0 1rem;
    margin-left: 0.8rem;
  }

  .objectives {
    padding: 0 1.25rem;
    gap: 2rem;
    margin: 2rem auto 0;
  }

  .recent-posts {
    padding: 0 1.25rem;
    margin-bottom: 2rem;
  }

  .posts {
    max-width: 100%;
    gap: 1.5rem;
  }

  .newspapers {
    padding: 0 1.25rem;
    margin-bottom: 3rem;
    margin-top: 2rem;
  }

  .newspapers-grid {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
    gap: 1.5rem;
  }

  .recent-posts-subtitle {
    font-size: 13px;
    text-align: center;
    width: 100%;
  }

  .newspapers-subtitle {
    font-size: 13px;
    text-align: center;
    width: 100%;
  }

  .icon {
    width: 62px;
    height: 62px;
    min-width: 62px;
  }

  .subtitle {
    font-size: 16px;
  }

  .description {
    font-size: 12px;
  }

  .insight {
    width: calc(100% - 2.5rem);
    padding: 1.75rem 1.25rem;
    margin: 3.5rem auto;
  }

  .title3 {
    font-size: 20px;
  }

  .word {
    font-size: 13px;
  }

  .icon-top-right,
  .icon-bottom-left {
    width: 48px;
    height: 48px;
  }

  .icon-top-right {
    top: -16px;
    right: -14px;
  }

  .icon-bottom-left {
    bottom: -16px;
    left: -14px;
  }

  .posts {
    max-width: 100%;
  }

  .title-post {
    font-size: 18px;
  }

  .btn {
    padding: 10px 40px;
  }
}

/* Small mobile */
@media (max-width: 360px) {
  .banner img {
    height: 155px;
  }

  .title1 {
    font-size: 20px;
  }

  .item-theme {
    flex-direction: row;
    gap: 1rem;
    width: 100%;
    max-width: none;
    justify-content: flex-start;
    padding-left: 0.5rem;
  }

  .name-theme {
    width: auto;
    text-align: left;
    font-size: 14px;
  }

  .container-icon {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }

  .list-themes {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }

  .title2 {
    font-size: 20px;
  }

  .item-objective1,
  .item-objective2 {
    gap: 1.5rem;
  }
}
</style>
