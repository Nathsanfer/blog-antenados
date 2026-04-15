<template>
    <HeaderTemplate />
    <h1>Bem vindo a tela de Blog!</h1>
</template>

<script>
import HeaderTemplate from '../components/HeaderTemplate.vue'
import FooterTemplate from '../components/FooterTemplate.vue'
    export default {
        name: 'Destaques',
        components: {
            HeaderTemplate,
            FooterTemplate
        }
    }
</script>