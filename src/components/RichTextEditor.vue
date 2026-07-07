<script>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { supabase } from "../composables/useSupabase"; // Importando a conexão com o Supabase

export default {
    name: "RichTextEditor",
    components: {
        QuillEditor
    },
    props: {
        modelValue: {
            type: String,
            default: ""
        },
        placeholder: {
            type: String,
            default: "Escreva o conteúdo aqui..."
        }
    },
    data() {
        return {
            editorOptions: {
                theme: 'snow',
                placeholder: this.placeholder,
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'align': [] }],
                            ['link', 'image'],
                            ['clean']
                        ],
                        handlers: {
                            // Intercepta o comportamento padrão do botão de imagem
                            image: () => this.imageHandler()
                        }
                    }
                }
            }
        };
    },
    methods: {
        updateContent(content) {
            this.$emit("update:modelValue", content);
        },

        // Lógica Avançada: Upload direto para o Storage
        imageHandler() {
            // Cria um input de arquivo invisível e simula o clique
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (!file) return;

                try {
                    // Mostra um feedback visual de carregamento (opcional, pode ser adaptado)
                    document.body.style.cursor = 'wait';

                    // 2. Gera um nome único para o arquivo
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
                    const filePath = `editor-images/${fileName}`; // Pasta específica para imagens do texto

                    // Envia o arquivo para o bucket 'post-images'
                    const { error: uploadError } = await supabase.storage
                        .from('post-images')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    // Recupera a URL pública definitiva
                    const { data: urlData } = supabase.storage
                        .from('post-images')
                        .getPublicUrl(filePath);

                    const publicUrl = urlData.publicUrl;

                    // Injeta a imagem na exata posição onde o usuário estava digitando
                    const quill = this.$refs.quillRef.getQuill(); // Captura a instância do Quill
                    const range = quill.getSelection(true); // Descobre onde o cursor do mouse está

                    quill.insertEmbed(range.index, 'image', publicUrl);
                    quill.setSelection(range.index + 1); // Empurra o cursor pra frente da imagem

                } catch (error) {
                    console.error("Erro no upload da imagem do editor:", error);
                    alert("Erro ao fazer upload da imagem. O arquivo pode ser muito grande ou a internet instável.");
                } finally {
                    document.body.style.cursor = 'default';
                }
            };
        }
    }
};
</script>

<template>
    <div class="rich-text-container">
        <QuillEditor ref="quillRef" :content="modelValue" contentType="html" :options="editorOptions"
            @update:content="updateContent" />
    </div>
</template>

<style scoped>
.rich-text-container {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #cccccc;
    transition: border-color 0.2s;
}

.rich-text-container:focus-within {
    border-color: var(--color-green, #6dac7e);
}

:deep(.ql-toolbar) {
    border: none !important;
    border-bottom: 1px solid #eeeeee !important;
    background-color: #f9f9f9;
    font-family: var(--primary-font, sans-serif);
    border-radius: 12px 12px 0 0;
}

:deep(.ql-container) {
    border: none !important;
    min-height: 450px;
    font-family: var(--primary-font, sans-serif);
    font-size: 15px;
}

:deep(.ql-editor) {
    padding: 1.5rem;
    line-height: 1.6;
    color: #333;
}

:deep(.ql-editor img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
}
</style>