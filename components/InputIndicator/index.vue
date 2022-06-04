<template>
    <div class="input-indicator">

        <component :is="icon"></component>

        <span class="label">{{ input.label }}</span>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
