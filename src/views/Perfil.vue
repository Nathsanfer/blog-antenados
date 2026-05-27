<script>
import FooterTemplate from "../components/FooterTemplate.vue";
import HeaderTemplate from "../components/HeaderTemplate.vue";
import { supabase } from "../composables/useSupabase";
import { useRouter } from 'vue-router';
import PerfilImagem from "../assets/profile.png";

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
      isUploading: false,
      isSaving: false,
      userData: {
        id: "",
        name: "",
        email: "",
        password: "",
        position: "",
        avatar_url: "",
      },
      users: [],
      showDropdownId: null,
      showUserModal: false,
      modalMode: 'create', // 'create' ou 'edit'
      userForm: {
        id: '',
        name: '',
        email: '',
        position: '',
        password: ''
      },
    };
  },
  async mounted() {
    await this.fetchUserProfile()
    await this.fetchUsersList()
    document.addEventListener('click', this.closeDropdowns);
  },
  unmounted() {
    document.removeEventListener('click', this.closeDropdowns);
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
          .maybeSingle();

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
          position: this.userData.position,
          avatar_url: this.userData.avatar_url || PerfilImagem,
          updated_at: new Date()
        };

        const { error: dbError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', this.userData.id);

        if (dbError) throw dbError;

        console("Perfil atualizado com sucesso!");
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
    },

    async fetchUsersList() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        this.users = data || [];
      } catch (error) {
        console.error("Erro ao buscar usuários:", error.message);
      }
    },

    toggleDropdown(userId, event) {
      // Evita que o clique no botão propague e ative o fechamento automático
      event.stopPropagation();
      this.showDropdownId = this.showDropdownId === userId ? null : userId;
    },

    closeDropdowns() {
      this.showDropdownId = null;
    },

    openUserModal(mode, user = null) {
      this.modalMode = mode;
      this.showDropdownId = null; // Fecha o dropdown ao abrir modal
      
      if (mode === 'edit' && user) {
        this.userForm = { 
          id: user.id, 
          name: user.name, 
          email: '', // O email idealmente viria de uma view ou edge function
          position: user.position, 
          password: '' 
        };
      } else {
        this.userForm = { id: '', name: '', email: '', position: '', password: '' };
      }
      
      this.showUserModal = true;
    },

    closeUserModal() {
      this.showUserModal = false;
      this.userForm = { id: '', name: '', email: '', position: '', password: '' };
    },

    async saveUser() {
      try {
        this.isSaving = true;
        
        if (this.modalMode === 'create') {
          // Lógica de CRIAÇÃO chamando a Edge Function
          const { data, error } = await supabase.functions.invoke('manage-users', {
            body: {
              action: 'create',
              user: {
                name: this.userForm.name,
                email: this.userForm.email,
                password: this.userForm.password,
                position: this.userForm.position
              }
            }
          });

          if (error) throw error;
          if (data && data.error) throw new Error(data.error);

          console.log("Usuário criado com sucesso!");

        } else {
          // Lógica de EDIÇÃO (Continua atualizando direto a tabela pública)
          const { error } = await supabase
            .from('users')
            .update({
              name: this.userForm.name,
              position: this.userForm.position
            })
            .eq('id', this.userForm.id);
            
          if (error) throw error;
          alert("Usuário atualizado com sucesso!");
        }

        await this.fetchUsersList();
        this.closeUserModal();
      } catch (error) {
        console.error("Erro ao salvar usuário:", error.message);
        alert(`Ocorreu um erro: ${error.message}`);
      } finally {
        this.isSaving = false;
      }
    },

    async confirmDeleteUser(user) {
      this.showDropdownId = null; // Fecha o dropdown
      
      const confirm = window.confirm(`Tem certeza que deseja excluir o usuário: ${user.name}?`);
      
      if (confirm) {
        try {
          this.loading = true;

          // Lógica de EXCLUSÃO chamando a Edge Function
          const { data, error } = await supabase.functions.invoke('manage-users', {
            body: { 
              action: 'delete', 
              user: { id: user.id } 
            }
          });

          if (error) throw error;
          if (data && data.error) throw new Error(data.error);
          
          console.log("Usuário excluído com sucesso!");
          await this.fetchUsersList();

        } catch (error) {
          console.error("Erro ao excluir usuário:", error.message);
          alert(`Erro ao excluir: ${error.message}`);
        } finally {
          this.loading = false;
        }
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
              <input type="text" v-model="userData.name" placeholder="Seu nome completo"  maxlength="24" />
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
              <input type="text" v-model="userData.position" placeholder="Ex: Corrdenadora, Professor..." />
            </div>

            <div class="action-container">
              <button type="submit" class="btn-save" :disabled="isSaving">
                {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div v-else-if="activeSection === 'usuarios'" class="users-section">
        
        <div class="users-header">
          <h2>Total de Usuários: {{ users.length }}</h2>
          <button class="btn-create-user" @click="openUserModal('create')">Criar Usuário</button>
        </div>

        <div class="users-list">
          <div v-for="user in users" :key="user.id" class="user-card">
            
            <div class="user-info-group">
              <img 
                v-if="user.avatar_url"
                :src="user.avatar_url"
                alt="Avatar do usuário"
                class="user-avatar"
              />
              <img
                v-else
                src="../assets/profile.png"
                alt="Avatar padrão"
                class="user-avatar"
              />
              
              <span class="user-text">{{ user.name || 'Usuário sem nome' }}</span>
            </div>

            <div class="vertical-divisor"></div>

            <div class="user-info-group">
              <span class="user-text">{{ user.position || 'Sem cargo' }}</span>
            </div>

            <div class="dropdown-container">
              <button class="btn-dots" @click="toggleDropdown(user.id, $event)">&#8942;</button>
              
              <div v-if="showDropdownId === user.id" class="dropdown-menu">
                <button @click="openUserModal('edit', user)" class="dropdown-item">Editar</button>
                <button @click="confirmDeleteUser(user)" class="dropdown-item text-red">Excluir</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </main>

  <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
    <div class="modal-content profile-card">
      <div class="card-header">
        <h2>{{ modalMode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário' }}</h2>
        <div class="card-divisor"></div>
      </div>

      <form class="modal-form" @submit.prevent="saveUser">
        <div class="input-group">
          <label>Nome Completo:</label>
          <input type="text" v-model="userForm.name" placeholder="Nome do Usuário" required />
        </div>
        
        <div class="input-group" v-if="modalMode === 'create'">
          <label>Email:</label>
          <input type="email" v-model="userForm.email" placeholder="nome@email.com" required />
        </div>

        <div class="input-group">
          <label>Cargo:</label>
          <input type="text" v-model="userForm.position" placeholder="Ex: Professor" required />
        </div>

        <div class="input-group" v-if="modalMode === 'create'">
          <label>Senha Provisória:</label>
          <input type="password" v-model="userForm.password" placeholder="Defina uma senha" required />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeUserModal">Cancelar</button>
          <button type="submit" class="btn-save" :disabled="isSaving">
            {{ isSaving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>

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
  background-color: #6dac7e;
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

/* upload da imagem */
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

/* botao salvar alteracoes */
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

/* aba de usuarios */
.users-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.users-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  padding: 1.5rem 2.5rem;
  border: 1px solid #f0f0f0;
}

.users-header h2 {
  font-size: 22px;
  font-weight: 400;
  font-family: var(--secondary-font);
  color: #333;
}

.btn-create-user {
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

.btn-create-user:hover {
  background-color: #5c966c;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  padding: 1rem 2.5rem 1rem 1.5rem;
  border: 1px solid #f0f0f0;
}

.user-info-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f0f0f0;
}

.user-text {
  font-family: var(--primary-font);
  font-size: 16px;
  color: #333;
}

.vertical-divisor {
  width: 1px;
  height: 30px;
  background-color: #dcdcdc;
  margin: 0 2rem;
}

/* Menu de 3 pontinhos */
.dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
}

.btn-dots {
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #555;
  cursor: pointer;
  padding: 0 0.5rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  z-index: 10;
  overflow: hidden;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  font-family: var(--primary-font);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f9f9f9;
}

.text-red {
  color: #da4167;
}

/* modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: 2.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #555;
  border: none;
  border-radius: 20px;
  padding: 0.8rem 1.5rem;
  font-family: var(--primary-font);
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #e4e4e4;
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