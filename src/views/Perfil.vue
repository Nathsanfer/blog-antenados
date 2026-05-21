<script>
import FooterTemplate from "../components/FooterTemplate.vue";
import HeaderTemplate from "../components/HeaderTemplate.vue";
import { supabase } from "../composables/useSupabase";
import { useRouter } from 'vue-router';

export default {
  name: "Perfil",
  components: {
    HeaderTemplate,
    FooterTemplate,
  },
  setup() {
    return {
      router: useRouter()
    };
  },
  data() {
    return {
      activeSection: "meusDados",
      loading: true,
      userData: {
        id: "",
        name: "",
        email: "",
        password: "",
        position: "",
        avatar_url: "",
        isUploading: false,
        isSaving: false,
      }
    };
  },
  async mounted() {
    await this.fetchUserProfile();
  },

  methods: {
    setSection(section) {
      this.activeSection = section;
    },
    async fetchUserProfile() {
      try {
        this.loading = true;
        
        // obtem o usuario na autenticao atual do supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error("Erro ao buscar usuário logado:", authError);
          return;
        }

        this.userData.id = user.id;
        this.userData.email = user.email;

        // busca os dados na tabela de users
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("name, position, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil público:", profileError);
          return;
        }

        // prreenche as variaveis com os dados do banco
        if (profile) {
          this.userData.name = profile.name || "";
          this.userData.position = profile.position || "Não definido";
          this.userData.avatar_url = profile.avatar_url || "";
        }

      } catch (error) {
        console.error("Erro inesperado:", error);
      } finally {
        this.loading = false;
      }
    },

    // função para salvar a foto do usuario
    triggerFileInput() {
      // Simula o clique no input de arquivo invisível
      this.$refs.fileInput.click();
    },

    async uploadAvatar(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.isUploading = true;

        // cria um nome de arquivo único para evitar substituições acidentais de cache
        const fileExt = file.name.split('.').pop();
        const fileName = `${this.userData.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // upload para o bucket avatars do supabase
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Pega a URL pública da imagem recém-salva
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // atualiza a imagem na tela
        this.userData.avatar_url = data.publicUrl;

      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error.message);
        alert("Não foi possível fazer o upload da imagem.");
      } finally {
        this.isUploading = false;
      }
    },

    // função para salvar as alteracoes
    async updateProfile() {
      try {
        this.isSaving = true;

        // aatualiza senha no Supabase Auth
        if (this.userData.password && this.userData.password.trim() !== "") {
          const { error: authError } = await supabase.auth.updateUser({
            password: this.userData.password
          });
          
          if (authError) throw authError;
        }

        // atualiza os dados públicos na tabela users
        const updates = {
          name: this.userData.name,
          avatar_url: this.userData.avatar_url,
          updated_at: new Date()
        };

        const { error: dbError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', this.userData.id);

        if (dbError) throw dbError;

        alert("Perfil atualizado com sucesso!");
        this.userData.password = "";

      } catch (error) {
        console.error("Erro ao salvar perfil:", error.message);
        alert("Ocorreu um erro ao salvar suas alterações.");
      } finally {
        this.isSaving = false;
      }
    },

    // função para sair da conta
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        this.router.push('/');
      } catch (error) {
        console.error("Erro ao sair da conta:", error.message);
        alert("Ocorreu um erro ao tentar sair da conta.");
      }
    }
  },
};
</script>


<template>
  <HeaderTemplate />
  
  <div class="header-page">
    <img src="../assets/icons_highlights/icon9.png" alt="Icone de Beca" class="icon-desktop" />
    <img src="../assets/icons_highlights/icon10.png" alt="Icone de Lâmpada" />
    <div class="divisor"></div>
    <h1>Perfil</h1>
    <div class="divisor"></div>
    <img src="../assets/icons_highlights/icon11.png" alt="Icone de Livro" />
    <img src="../assets/icons_highlights/icon12.png" alt="Icone de Colmeia" class="icon-desktop" />
  </div>

  <main>
    <aside class="container-left">
      <button
        class="option"
        :class="{ active: activeSection === 'meusDados' }"
        type="button"
        @click="setSection('meusDados')"
      >
        <h3>Meus Dados</h3>
      </button>
      
      <button
        class="option"
        :class="{ active: activeSection === 'usuarios' }"
        type="button"
        @click="setSection('usuarios')"
      >
        <h3>Usuários</h3>
      </button>

      <button class="btn-logout" type="button" @click="logout">
        Sair da Conta
      </button>
    </aside>

    <div class="container-right">
      
      <div v-if="loading" class="profile-card">
        <p>Carregando seus dados...</p>
      </div>

      <div v-else-if="activeSection === 'meusDados'" class="profile-card">
        <div class="card-header">
          <h2>Altere seus dados Cadastrais</h2>
          <div class="card-divisor"></div>
        </div>

        <form class="form-grid" @submit.prevent="updateProfile">
          <div class="left-col">
            <div class="input-group">
              <label>Nome Completo:</label>
              <input type="text" v-model="userData.name" placeholder="Seu nome completo" />
            </div>
            
            <div class="input-group">
              <label>Email:</label>
              <input type="email" v-model="userData.email" placeholder="nome@email.com" readonly class="input-readonly" />
            </div>
            
            <div class="input-group">
              <label>Nova Senha:</label>
              <input type="password" v-model="userData.password" placeholder="Digite para alterar a senha" />
            </div>
          </div>

          <div class="right-col">
            <div class="input-group">
              <label>Imagem:</label>
              
              <div class="image-upload-box" @click="!isUploading && triggerFileInput()">
                
                <p v-if="isUploading" style="color: #6dac7e; font-weight: bold;">Enviando...</p>
                
                <template v-else>
                  <img
                    v-if="userData.avatar_url"
                    :src="userData.avatar_url"
                    alt="Sua foto de perfil"
                    style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;"
                  />
                  <img
                    v-else
                    src="../assets/select_img.png"
                    alt="Ícone de upload"
                    class="upload-icon"
                  />
                  <p>Escolha uma foto para<br>seu perfil</p>
                </template>

                <input
                  type="file"
                  ref="fileInput"
                  @change="uploadAvatar"
                  accept="image/*"
                  style="display: none;"
                />
              </div>
            </div>

            <div class="input-group">
              <label>Cargo:</label>
              <input type="text" v-model="userData.position" readonly class="input-readonly" />
            </div>

            <div class="action-container">
              <button type="submit" class="btn-save" :disabled="isSaving">
                {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div v-else-if="activeSection === 'usuarios'" class="profile-card">
        <div class="card-header">
          <h2>Gerenciar Usuários</h2>
          <div class="card-divisor"></div>
        </div>
        <p style="margin-top: 1rem; color: #555;">...</p>
      </div>

    </div>
  </main>

  <FooterTemplate />
</template>

<style scoped>
/* Estilos Base da Página */
.header-page {
  display: flex;
  max-width: 1200px;
  width: 90%;
  margin: 1rem auto;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.header-page img {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.divisor {
  flex: 1;
  height: 1px;
  background-color: #a8a8a8;
}

.header-page h1 {
  font-size: 30px;
  font-weight: 500;
  font-family: var(--secondary-font);
  white-space: nowrap;
}

main {
  display: flex;
  width: 85%;
  margin: 0 auto;
  justify-content: space-between;
  flex-direction: row;
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto 4rem;
  gap: 2rem;
  overflow-x: hidden;
}

/* Sidebar Esquerda */
.container-left {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  width: 100%;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.option h3 {
  font-size: 18px;
  font-weight: 500;
  font-family: var(--secondary-font);
  margin: 0;
  padding: 1rem 0;
  color: #333;
  pointer-events: none;
}

.option.active {
  border: 2px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #aca16d, #6dac7e, #41d0da, #7e4ba0, #da4167) border-box;
}

.option:focus-visible {
  outline: 2px solid var(--color-green);
  outline-offset: 3px;
}

/* Botão de Sair */
.btn-logout {
  width: 100%;
  background-color: #6dac7e; /* Ajuste para usar var(--color-green) se existir */
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 0.3rem 0;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--primary-font);
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #5c966c;
}

/* Container Direito e Card de Perfil */
.container-right {
  flex: 1;
  min-width: 0;
}

.profile-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  border: 1px solid #f0f0f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 22px;
  font-weight: 400;
  font-family: var(--secondary-font);
  color: #333;
  white-space: nowrap;
}

.card-divisor {
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
}

/* Grid do Formulário */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  font-family: var(--primary-font);
}

.input-group input {
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-family: var(--primary-font);
  font-size: 14px;
  color: #555;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: #6dac7e;
}

.input-readonly {
  background-color: #f9f9f9;
}

/* Área de Upload de Imagem */
.image-upload-box {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  cursor: pointer;
  background-color: #fdfdfd;
  height: 160px;
}

.image-upload-box .upload-icon {
  width: 40px;
  height: 40px;
  opacity: 0.4;
}

.image-upload-box p {
  font-size: 14px;
  color: #888;
  font-family: var(--primary-font);
  line-height: 1.4;
}

/* Botão Salvar Alterações */
.action-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-save {
  background-color: #6dac7e;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 0.8rem 2rem;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--primary-font);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.btn-save:hover {
  background-color: #5c966c;
}

/* Responsividade Básica */
@media (max-width: 768px) {
  main {
    flex-direction: column;
  }
  .container-left {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>