<template>
    <div class="default">

        <client-only>
            <CanvasWebGL ref="canvasWebGL" />
        </client-only>

        <Logo ref="logo" class="logo" />

        <Nuxt class="page" />

        <client-only>
            <Preloader />
        </client-only>

        <client-only>
            <SleepScreen />
        </client-only>

        <!-- TPM -->
        <client-only>
            <RevealScreen />
        </client-only>

    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss" scoped></style>
