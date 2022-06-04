<template>
    <div class="game-tags">

        <GameTag v-for="(item, index) in tags" :key="index" :data="item" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
