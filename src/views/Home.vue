<template>
    <HeaderTemplate />
    <h1>Bem vindo a tela de Home!</h1>
</template>

<script>
import HeaderTemplate from '../components/HeaderTemplate.vue'
import FooterTemplate from '../components/FooterTemplate.vue'

    export default {
        name: 'Home',
        components: {
            HeaderTemplate,
            FooterTemplate
        }
    }
</script>