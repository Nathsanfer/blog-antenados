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
    createdAt: {
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
      if (!this.createdAt) return "";
      const date = new Date(this.createdAt);
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
        <p class="newspaper-sidebar-card__date" v-if="createdAt">
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

@media (max-width: 480px) {

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
