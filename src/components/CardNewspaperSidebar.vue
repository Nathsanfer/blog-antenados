<script>
export default {
  name: "CardNewspaperSidebar",
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
    };
  },
  computed: {
    formattedDate() {
      if (!this.publishedAt) return "";
      const date = new Date(this.publishedAt);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  methods: {
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
  <li class="newspaper-sidebar-card">
    <div class="newspaper-sidebar-card__link" @click="openPdf">
      <div class="newspaper-sidebar-card__icon">📰</div>
      <div class="newspaper-sidebar-card__info">
        <h4 class="newspaper-sidebar-card__title">{{ title }}</h4>
        <p class="newspaper-sidebar-card__date" v-if="publishedAt">
          {{ formattedDate }}
        </p>
        <p class="newspaper-sidebar-card__action">Abrir PDF</p>
      </div>
    </div>
  </li>

  <!-- Modal PDF -->
  <div v-if="showPdfModal" class="pdf-modal-overlay" @click="closePdfModal">
    <div class="pdf-modal" @click.stop>
      <div class="pdf-modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="closePdfModal">✕</button>
      </div>
      <iframe
        :src="`${pdfUrl}#toolbar=1`"
        class="pdf-viewer"
        title="Visualizador de PDF"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.newspaper-sidebar-card {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.11);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.newspaper-sidebar-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.newspaper-sidebar-card__link {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.75rem;
  width: 100%;
  min-height: 52px;
  color: inherit;
  text-decoration: none;
  padding: 0.5rem;
  box-sizing: border-box;
}

.newspaper-sidebar-card__icon {
  width: 48px;
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6dac7e 0%, #41d0da 100%);
  border-radius: 8px;
  font-size: 24px;
  flex-shrink: 0;
}

.newspaper-sidebar-card__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 0.25rem 0;
}

.newspaper-sidebar-card__title {
  font-size: 11px;
  font-weight: 500;
  margin: 0;
  font-family: var(--secondary-font);
  line-height: 1.25;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.newspaper-sidebar-card__date {
  font-size: 9px;
  font-weight: 300;
  margin: 0.25rem 0 0;
  color: #888;
  line-height: 1.2;
}

.newspaper-sidebar-card__action {
  font-size: 10px;
  font-weight: 500;
  margin: 0.3rem 0 0;
  color: #6dac7e;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* Modal PDF */
.pdf-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.pdf-modal {
  width: 90%;
  height: 90%;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 1000px;
}

.pdf-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.pdf-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-family: var(--secondary-font);
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #000;
}

.pdf-viewer {
  flex: 1;
  border: none;
  border-radius: 0 0 12px 12px;
}
</style>
