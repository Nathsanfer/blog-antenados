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

<template>
    <HeaderTemplate />
    <div class="banner">
        <img src="../assets/banner.png" alt="Banner">
    </div>
</template>

<style scoped>

</style>