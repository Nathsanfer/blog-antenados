<template>
  <footer class="footer">
    <div class="footer-inner">

      <div class="content">
        <div class="container-title">
          <h1>Antenados</h1>
          <p class="blog-label">BLOG ESCOLAR</p>
        </div>
        <img src="../assets/icons_highlights/icon8.png" alt="Icone de Estrela" class="star-icon" />
        <p class="text">
          Antenados é um blog escolar dedicado a compartilhar conhecimento, histórias e informações relevantes da comunidade. Oferecemos artigos educativos, notícias escolares através de nossos jornais e um espaço para a troca de experiências entre alunos, professores e família. Nosso objetivo é manter todos informados e conectados com as principais atividades e acontecimentos da escola.
        </p>
      </div>

      <div class="separator"></div>

      <div class="data">
        <p class="subtitle">DÚVIDAS? ENTRE EM CONTATO COM A ESCOLA</p>
        <div class="divisor"></div>
        <p class="contact">Telefone: (55) 19 97422-5320</p>
        <div class="divisor"></div>
        <p class="contact">Email: emeb.dirce.antonio@gmail.com</p>
      </div>

      <p class="localization">Av. Vice-Prefeito Anésio Capovilla, 485 - Jardim Nova Espirito Santo, Valinhos - SP, 13273-180, Brasil</p>

    </div>
  </footer>
</template>

<style scoped>
/* ===== Footer ===== */
.footer {
  position: relative;
  z-index: 0;
  width: 100%;
  background-color: #fafafa;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  margin-top: 3rem;
  padding: 2rem 0 1.5rem;
}

.footer-inner {
  max-width: 1200px;
  width: 88%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== Content row ===== */
.content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.container-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
}

.container-title h1 {
  font-size: 28px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  line-height: 1.2;
}

.blog-label {
  font-size: 12px;
  font-family: var(--primary-font);
  color: #da4167;
  margin: 0.1rem 0 0;
}

.star-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.text {
  flex: 1;
  font-size: 12px;
  font-family: var(--primary-font);
  color: #666;
  line-height: 1.65;
  margin: 0;
}

/* ===== Separator ===== */
.separator {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
}

/* ===== Data row ===== */
.data {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.subtitle {
  font-size: 12px;
  font-family: var(--primary-font);
  color: #da4167;
  margin: 0;
  white-space: nowrap;
}

.divisor {
  width: 1px;
  height: 14px;
  background-color: #bbb;
  flex-shrink: 0;
}

.contact {
  font-size: 12px;
  font-family: var(--primary-font);
  color: #555;
  margin: 0;
  white-space: nowrap;
}

/* ===== Localization ===== */
.localization {
  text-align: center;
  font-size: 11px;
  font-family: var(--primary-font);
  color: #999;
  margin: 0;
}

/* ============================
   RESPONSIVE BREAKPOINTS
   ============================ */

/* Tablet portrait */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1.5rem;
  }

  .footer-inner {
    width: 90%;
    gap: 1.2rem;
  }

  .content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .container-title {
    align-items: center;
  }

  .star-icon {
    width: 44px;
    height: 44px;
  }

  .text {
    font-size: 12px;
    text-align: center;
  }

  .data {
    flex-direction: column;
    gap: 0.3rem;
  }

  .divisor {
    width: 40px;
    height: 1px;
    margin: 0;
  }

  .subtitle {
    white-space: normal;
    text-align: center;
  }

  .contact {
    white-space: normal;
    text-align: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .footer-inner {
    width: 92%;
  }

  .container-title h1 {
    font-size: 24px;
  }

  .blog-label {
    font-size: 11px;
  }

  .star-icon {
    width: 38px;
    height: 38px;
  }

  .text {
    font-size: 11px;
  }

  .subtitle,
  .contact {
    font-size: 11px;
  }

  .localization {
    font-size: 10px;
  }
}

/* Small mobile */
@media (max-width: 360px) {
  .container-title h1 {
    font-size: 20px;
  }

  .text {
    font-size: 10px;
  }
}
</style>
