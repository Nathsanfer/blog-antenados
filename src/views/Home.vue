<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";
import CardPost from "../components/CardPost.vue";
import { supabase } from "../composables/useSupabase.js";

export default {
  name: "Home",
  components: {
    HeaderTemplate,
    FooterTemplate,
    CardPost,
  },
  data() {
    return {
      posts: [],
    };
  },
  async mounted() {
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

      // Map the view fields to the CardPost props
      this.posts = (data || []).map((p) => ({   
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
  },
};
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
        <li class="item-theme">
          <div class="container-icon">
            <img src="../assets/icons_highlights/icon1.png" alt="Icone para o tema 1" />
          </div>
          <p class="name-theme">Artes e Expressão</p>
        </li>
        <li class="item-theme">
          <div class="container-icon">
            <img src="../assets/icons_highlights/icon2.png" alt="Icone para o tema 2" />
          </div>
          <p class="name-theme">Folclore</p>
        </li>
        <li class="item-theme">
          <div class="container-icon">
            <img src="../assets/icons_highlights/icon3.png" alt="Icone para o tema 3" />
          </div>
          <p class="name-theme">Consciência Negra</p>
        </li>
        <li class="item-theme">
          <div class="container-icon">
            <img src="../assets/icons_highlights/icon4.png" alt="Icone para o tema 4" />
          </div>
          <p class="name-theme">Projetos Ciêntificos</p>
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
              <h3 class="subtitle">Objetivo 1</h3>
              <p class="description">
                Em meio a cores, pincéis e muita criatividade, os alunos
                transformaram um simples muro em uma verdadeira obra de arte. Mais
                do que uma atividade...
              </p>
            </div>
          </li>
          <li class="item">
            <div class="icon">
              <img src="../assets/icons_highlights/icon2.png" alt="" />
            </div>
            <div class="topic-content1">
              <h3 class="subtitle">Objetivo 1</h3>
              <p class="description">
                Em meio a cores, pincéis e muita criatividade, os alunos
                transformaram um simples muro em uma verdadeira obra de arte. Mais
                do que uma atividade...
              </p>
            </div>
          </li>
        </ul>
        <div class="container-divisor">
          <div class="divisor-objective"></div>
          <div class="images-divisor">
            <img src="../assets/icons_highlights/icon5.png" alt="" />
            <img class="image-right" src="../assets/icons_highlights/icon5.png" alt="" />
          </div>
        </div>
        <ul class="item-objective2">
          <li class="item">
            <div class="topic-content2">
              <h3 class="subtitle">Objetivo 1</h3>
              <p class="description">
                Em meio a cores, pincéis e muita criatividade, os alunos
                transformaram um simples muro em uma verdadeira obra de arte. Mais
                do que uma atividade...
              </p>
            </div>
            <div class="icon">
              <img src="../assets/icons_highlights/icon2.png" alt="" />
            </div>
          </li>
          <li class="item">
            <div class="topic-content2">
              <h3 class="subtitle">Objetivo 1</h3>
              <p class="description">
                Em meio a cores, pincéis e muita criatividade, os alunos
                transformaram um simples muro em uma verdadeira obra de arte. Mais
                do que uma atividade...
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
        <img src="../assets/icons_highlights/icon6.png" alt="Ícone superior direito" />
      </div>
      <div class="insight-content">
        <h2 class="title3">Busca pelo Saber</h2>
        <p class="word">
          "Sem a cultura, e a liberdade relativa que ela pressupõe, a sociedade,
          por mais perfeita que seja, não passa de uma selva. É por isso que toda
          a criação autêntica é um dom para o futuro."
        </p>
        <div class="author">
          <img src="../assets/author.png" alt="Imagem do autor da frase, Albert Camus" />
          <div class="author-content">
            <p class="name">Albert Camus</p>
            <p class="text">Escritor e Filósofo</p>
          </div>
        </div>
      </div>
      <div class="icon-bottom-left">
        <img src="../assets/icons_highlights/icon7.png" alt="Ícone inferior esquerdo" />
      </div>
    </section>

    <section class="recent-posts">
      <div class="section-header">
        <div class="divisor"></div>
        <h1 class="title2">Postagens Recentes</h1>
        <div class="divisor"></div>
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
      <router-link class="link-btn" to="#">
        <button class="btn">Ver Mais</button>
      </router-link>
    </section>
  </main>

  <FooterTemplate />
</template>

<style scoped>
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

.list-themes li:nth-child(1) .container-icon { background-color: var(--pastel-pink); }
.list-themes li:nth-child(2) .container-icon { background-color: var(--pastel-green); }
.list-themes li:nth-child(3) .container-icon { background-color: var(--pastel-orange); }
.list-themes li:nth-child(4) .container-icon { background-color: var(--pastel-blue); }

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

.item-objective1 li:nth-child(1) .icon { background-color: var(--pastel-pink); }
.item-objective1 li:nth-child(2) .icon { background-color: var(--pastel-orange); }
.item-objective2 li:nth-child(1) .icon { background-color: var(--pastel-green); }
.item-objective2 li:nth-child(2) .icon { background-color: var(--pastel-blue); }

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
    linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167) border-box;
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
  margin: 4rem auto 5rem;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.posts {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
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
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  background-color: #5a9a70;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(109, 172, 131, 0.4);
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
}

/* Mobile */
@media (max-width: 480px) {
  .banner img {
    height: 190px;
  }

  .categories {
    padding: 0 1.25rem;
  }

  .title1 {
    font-size: 22px;
  }

  .list-themes {
    gap: 1.5rem;
  }

  .objectives {
    padding: 0 1.25rem;
    gap: 2rem;
  }

  .recent-posts {
    padding: 0 1.25rem;
    margin-bottom: 4rem;
  }

  .decoration {
    padding: 0 1.25rem;
  }

  .title2 {
    font-size: 22px;
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
