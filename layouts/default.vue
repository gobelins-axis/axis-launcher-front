<template>
    <div class="default">

        <client-only>
            <CanvasWebGL ref="canvasWebGL" />
        </client-only>

        <Logo v-if="isStartAllowed" ref="logo" class="logo" />

        <Nuxt v-if="isStartAllowed" class="page" />

        <client-only>
            <Preloader v-if="isStartAllowed" />
        </client-only>

        <client-only>
            <SleepScreen v-if="isStartAllowed" />
        </client-only>

    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss" scoped></style>
