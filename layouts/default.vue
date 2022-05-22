<template>
    <div class="default">

        <client-only>
            <CanvasWebGL ref="canvasWebGL" />
        </client-only>

        <Nuxt class="page" />

        <client-only>
            <Preloader />
        </client-only>

    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss" scoped></style>
