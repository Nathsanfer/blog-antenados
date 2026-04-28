<script>
import HeaderTemplate from "../components/HeaderTemplate.vue";
import FooterTemplate from "../components/FooterTemplate.vue";

export default {
  name: "Home",
  components: {
    HeaderTemplate,
    FooterTemplate,
  },
};
</script>

<template>
  <HeaderTemplate />
  <div class="banner">
    <img src="../assets/banner.png" alt="Banner" />
  </div>

  <section class="categories">
    <h1 class="title1">Explore por temas (Destaques)</h1>
    <ul class="list-themes">
      <li class="item-theme">
        <div class="container-icon">
          <img
            src="../assets/icons_highlights/icon1.png"
            alt="Icone para o tema 1"
          />
        </div>
        <p class="name-theme">Artes e Expressão</p>
      </li>
      <li class="item-theme">
        <div class="container-icon">
          <img
            src="../assets/icons_highlights/icon2.png"
            alt="Icone para o tema 2"
          />
        </div>
        <p class="name-theme">Folclore</p>
      </li>
      <li class="item-theme">
        <div class="container-icon">
          <img
            src="../assets/icons_highlights/icon3.png"
            alt="Icone para o tema 3"
          />
        </div>
        <p class="name-theme">Consciência Negra</p>
      </li>
      <li class="item-theme">
        <div class="container-icon">
          <img
            src="../assets/icons_highlights/icon4.png"
            alt="Icone para o tema 4"
          />
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
      <img
        src="../assets/icons_highlights/icon6.png"
        alt="Ícone superior direito"
      />
    </div>
    <div class="insight-content">
      <h2 class="title3">Busca pelo Saber</h2>
      <p class="word">
        “Sem a cultura, e a liberdade relativa que ela pressupõe, a sociedade,
        por mais perfeita que seja, não passa de uma selva. É por isso que toda
        a criação autêntica é um dom para o futuro.”
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
</template>

<style scoped>
.banner {
  width: 100%;
  height: auto;
  margin-top: -1.2rem;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.categories {
  width: 90%;
  height: auto;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 5rem;
  justify-content: center;
}

.title1 {
  font-size: 34px;
  font-weight: bold;
  font-family: var(--secondary-font);
  margin-bottom: 20px;
  width: 18rem;
}

.list-themes {
  display: flex;
  gap: 3rem;
  list-style: none;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.container-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.name-theme {
  font-size: 12px;
  width: 100px;
  text-align: center;
  font-family: var(--primary-font);
}

.decoration {
  width: 80%;
  height: 25px;
  margin: 0 auto;
  display: flex;
  margin-top: 2rem;
}

.decoration img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.objectives {
  width: 80%;
  height: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.divisor {
  width: 100%;
  height: 1px;
  background-color: #000;
}

.title2 {
  font-size: 34px;
  font-weight: bold;
  font-family: var(--secondary-font);
}

.container-topics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.item-objective1,
.item-objective2 {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.icon {
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  flex: 0 0 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  width: 70%;
  height: 70%;
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  display: block;
}

.topic-content1 {
  display: flex;
  flex-direction: column;
}

.topic-content2 {
  display: flex;
  flex-direction: column;
  text-align: end;
}

.subtitle {
  font-size: 19px;
  font-weight: bold;
  font-family: var(--secondary-font);
}

.description {
  font-size: 12px;
  font-family: var(--primary-font);
  width: 300px;
  margin-top: -0.6rem;
}

.divisor-objective {
  width: 1px;
  height: 100%;
  background-color: #000;
  z-index: 1;
}

.container-divisor {
  position: relative;
  width: 90px;
  align-self: stretch;
}

.divisor-objective {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: calc(100% +30px);
  background-image: repeating-linear-gradient(
    to bottom,
    #000000 0,
    #000000 14px,
    transparent 14px,
    transparent 24px
  );
  background-color: transparent;
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
  width: 100%;
  height: 100%;
  padding: 0;
}

.images-divisor img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: block;
  background: #fff;
  border-radius: 50%;
}

.image-right {
  transform: rotate(250deg);
}

.insight {
  position: relative;
  width: 80%;
  height: 220px;
  margin: 0 auto;
  margin-top: 6rem;
  outline: 2px solid transparent;
  border: 2px solid transparent;
  box-shadow: 0 0 0 2px transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167)
      border-box;
  border-image-slice: 1;
  border-radius: 30px;
}

.icon-top-right {
  position: absolute;
  top: -25px;
  right: -25px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-top-right img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.icon-bottom-left {
  position: absolute;
  bottom: -25px;
  left: -25px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bottom-left img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.insight-content {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.title3 {
  font-size: 24px;
  font-weight: bold;
  font-family: var(--secondary-font);
  margin-bottom: 1rem;
}

.word {
  font-size: 15px;
  width: 70%;
  font-family: var(--primary-font);
  text-align: center;
  font-style: italic;
}

.author {
  width: 500px;
  height: auto;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.author img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.author-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--primary-font);
  padding: 0;
    margin: 0;
}

.text {
  font-size: 12px;
  font-family: var(--primary-font);
  padding: 0;
  margin: 0;
}
</style>
