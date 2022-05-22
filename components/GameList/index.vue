<template>
    <ul class="game-list">

        <li v-for="(item, i) in gameCards" ref="listItem" :key="i" class="game-list-item">

            <GameCard ref="card" :game="item" :active="index === i" />

        </li>

    </ul>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
