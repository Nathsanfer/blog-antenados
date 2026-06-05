<script>
// Importar pdf.js
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Definir o worker - usando a versão correta do caminho
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default {
  name: "CardNewspaper",
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    publishedAt: {
      type: String,
      default: "",
    },
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showPdfModal: false,
      pdfThumbnail: null,
      loadingThumbnail: true,
    };
  },
  computed: {
    formattedDate() {
      if (!this.publishedAt) return "";
      const date = new Date(this.publishedAt);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  async mounted() {
    if (this.pdfUrl) {
      await this.generateThumbnail();
    }
  },
  methods: {
    async generateThumbnail() {
      try {
        const pdf = await pdfjsLib.getDocument(this.pdfUrl).promise;
        const page = await pdf.getPage(1);

        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        this.pdfThumbnail = canvas.toDataURL("image/jpeg", 0.8);
      } catch (error) {
        console.error("Erro ao gerar thumbnail do PDF:", error);
      } finally {
        this.loadingThumbnail = false;
      }
    },
    openPdf() {
      if (this.pdfUrl) {
        this.showPdfModal = true;
      }
    },
    closePdfModal() {
      this.showPdfModal = false;
    },
  },
};
</script>

<template>
  <div class="card" @click="openPdf">
    <div class="newspaper-cover" :class="{ 'has-thumbnail': pdfThumbnail }">
      <div v-if="loadingThumbnail" class="cover-content">
        <div class="newspaper-icon">📰</div>
        <div class="newspaper-label">Carregando...</div>
      </div>
      <img
        v-else-if="pdfThumbnail"
        :src="pdfThumbnail"
        :alt="title"
        class="pdf-thumbnail"
      />
      <div v-else class="cover-content">
        <div class="newspaper-icon">📰</div>
        <div class="newspaper-label">Jornal</div>
      </div>
    </div>
    <h4 class="title-newspaper">{{ title }}</h4>
    <p class="publication-date" v-if="publishedAt">
      {{ formattedDate }}
    </p>
    <div class="divisor-post"></div>
    <p class="action">
      <strong>Abrir PDF</strong>
    </p>
  </div>

  <!-- Modal PDF -->
  <div v-if="showPdfModal" class="pdf-modal-overlay" @click="closePdfModal">
    <div class="pdf-modal" @click.stop>
      <div class="pdf-modal-header">
        <h3>{{ title }}</h3>
        <div class="header-actions">
          <a :href="pdfUrl" target="_blank" class="open-native-btn">
            Abrir PDF
          </a>
          <button class="close-btn" @click="closePdfModal">✕</button>
        </div>
      </div>
      <iframe
        :src="`${pdfUrl}#toolbar=1&view=FitH`"
        class="pdf-viewer"
        title="Visualizador de PDF"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;
  height: 100%;
  position: relative;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(109, 172, 131, 0.25);
}

.newspaper-cover {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  gap: 1rem;
}

.newspaper-cover:not(.has-thumbnail) {
  background: linear-gradient(135deg, #6dac7e 0%, #41d0da 100%);
}

.newspaper-cover::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.pdf-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  position: absolute;
  inset: 0;
}

.cover-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
}

.newspaper-icon {
  width: 60px;
  height: 60px;
  opacity: 0.85;
  color: white;
  font-size: 50px;
}

.newspaper-label {
  font-size: 14px;
  font-weight: 600;
  color: white;
  font-family: var(--secondary-font);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title-newspaper {
  font-size: 20px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 0.75rem 0.75rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.publication-date {
  font-size: 10.5px;
  font-family: var(--primary-font);
  margin: 0;
  font-weight: 300;
  padding: 0.5rem 0.75rem;
  line-height: 1.65;
  color: #888;
  flex: 1;
}

.divisor-post {
  width: 92%;
  height: 1px;
  background-color: #ececec;
  margin: 0 auto;
}

.action {
  font-size: 11px;
  font-family: var(--primary-font);
  color: #333;
  margin: 0;
  padding: 0.5rem 0.75rem 1rem;
}

.action strong {
  color: var(--color-green);
  font-weight: 600;
}

/* PDF Modal */
.pdf-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.pdf-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pdf-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ececec;
  background: #f9f9f9;
}

.pdf-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-family: var(--secondary-font);
  color: #333;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.pdf-viewer {
  flex: 1;
  border: none;
  width: 100%;
}
/* --- Estilos do novo botão no Header do Modal --- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.open-native-btn {
  background-color: var(--color-green, #6dac7e);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-family: var(--primary-font);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.open-native-btn:hover {
  background-color: #558a62;
}

/* ===== MEDIA QUERIES ===== */
@media (max-width: 768px) {
  .pdf-modal {
    width: 95%;
    height: 90vh;
  }

  .pdf-modal-header h3 {
    font-size: 16px;
  }
}

/* --- Foco total em Smartphones (480px ou menos) --- */
@media (max-width: 480px) {
  /* Ajustes do Card */
  .newspaper-cover {
    height: 140px; /* Reduz um pouco a altura da capa para equilibrar no mobile */
  }

  .title-newspaper {
    font-size: 18px;
  }

  .pdf-modal-overlay {
    padding: 0; 
  }

  .pdf-modal {
    width: 90%;
    height: 600px; 
    max-height: 100vh;
    max-width: 100%;
    border-radius: 20px;
  }

  .pdf-modal-header {
    padding: 0.8rem 1rem;
  }

  .pdf-modal-header h3 {
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%; 
  }

  .open-native-btn {
    font-size: 12px;
    padding: 0.4rem 0.6rem;
  }
}
</style>
