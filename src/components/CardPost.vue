<script>
import { useRouter } from "vue-router";

export default {
  name: "CardPost",
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    categoryColor: {
      type: String,
      default: "#da4167",
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "draft",
    },
    showStatus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      statusLabels: {
        published: "Publicado",
        draft: "Rascunho",
        archived: "Arquivado",
      },
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    goToArticle() {
      this.router.push(`/blog/${this.id}`);
    },
  },
};
</script>

<template>
  <div class="card" @click="goToArticle()">
    <img :src="image" :alt="title" />
    <span v-if="showStatus" class="status-badge" :class="`status-${status}`">
      {{ statusLabels[status] }}
    </span>
    <p class="text-categorie" :style="{ color: categoryColor }">
      {{ category }}
    </p>
    <h4 class="title-post">{{ title }}</h4>
    <p class="brief-content">
      {{ content }}
    </p>
    <div class="divisor-post"></div>
    <p class="author-post">
      por <span>@ {{ author }}</span>
    </p>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
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
  box-shadow: 0 12px 32px rgba(218, 65, 103, 0.2);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.status-badge {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 3;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 11px;
  font-family: var(--primary-font);
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #fff;
  text-transform: uppercase;
}

.status-draft {
  background-color: #da9a16;
}

.status-published {
  background-color: #6dac7e;
}

.status-archived {
  background-color: #8d8d8d;
}

.text-categorie {
  font-size: 11px;
  font-family: var(--primary-font);
  margin: 0;
  font-weight: 400;
  padding: 0.75rem 0.75rem 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  filter: saturate(1.8) brightness(0.77);
}

.title-post {
  font-size: 20px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 0.25rem 0.75rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brief-content {
  font-size: 10.5px;
  font-family: var(--primary-font);
  margin: 0;
  font-weight: 300;
  padding: 0.5rem 0.75rem;
  line-height: 1.65;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6.1em;
}

.divisor-post {
  width: 92%;
  height: 1px;
  background-color: #ececec;
  margin: 0 auto;
}

.author-post {
  font-size: 11px;
  font-family: var(--primary-font);
  color: #333;
  margin: 0;
  padding: 0.5rem 0.75rem 1rem;
}

.author-post span {
  color: #968d8d;
  font-weight: 500;
}
</style>
