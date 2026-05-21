<script>
import { CATEGORY_ICONS } from "../lib/categories.ts";

export default {
  name: "CardCategory",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      CATEGORY_ICONS,
    };
  },
  computed: {
    formattedDate() {
      return new Date(this.createdAt).toLocaleDateString("pt-BR");
    },
    categoryIcon() {
      return CATEGORY_ICONS[this.icon] || CATEGORY_ICONS.lamp;
    },
  },
};
</script>

<template>
  <div class="category-card">
    <div class="category-card-top">
      <div class="category-card-header" :style="{ backgroundColor: color }">
        <img
          :src="categoryIcon"
          :alt="name"
          class="category-icon"
        />
      </div>
    </div>
    <div class="category-card-content">
      <h3 class="category-name">{{ name }}</h3>
      <p class="category-description">{{ description }}</p>
      <div class="category-footer">
        <span class="category-date">{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-card {
  display: flex;
  flex-direction: row;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #f5f5f5;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #ebebeb;
}

.category-card-top {
  display: flex;
  flex-shrink: 0;
}

.category-card-header {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.category-card-header::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05), transparent);
  pointer-events: none;
}

.category-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  position: relative;
  z-index: 1;
}

.category-card-content {
  padding: 1.25rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  font-family: var(--secondary-font);
  margin: 0;
  color: #222;
  line-height: 1.4;
}

.category-description {
  font-size: 13px;
  font-family: var(--primary-font);
  color: #777;
  margin: 0;
  line-height: 1.5;
}

.category-footer {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.category-date {
  font-size: 11px;
  font-family: var(--primary-font);
  color: #b0b0b0;
  font-weight: 500;
}
</style>
