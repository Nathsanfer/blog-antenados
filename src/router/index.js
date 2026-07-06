import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blog from '../views/Blog.vue'
import Login from '../views/Login.vue'
import Criacao from '../views/Criacao.vue'
import Perfil from '../views/Perfil.vue'
import BlogDetalhe from '../views/BlogDetalhe.vue'
import Jornais from '../views/Jornais.vue'
import Galeria from '../views/Galeria.vue'
import LeituraJornal from '../views/LeituraJornal.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/blog', component: Blog },
  { path: '/blog/:id', component: BlogDetalhe },
  { path: '/login', component: Login },
  { path: '/criacao', component: Criacao },
  { path: '/perfil', component: Perfil },
  { path: '/galeria', component: Galeria },
  { path: '/jornais', component: Jornais },
  { path: '/jornal/:id', name: 'Jornal', component: LeituraJornal }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router