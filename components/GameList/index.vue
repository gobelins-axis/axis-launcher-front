<template>
    <ul class="game-list">

        <li v-for="(item, i) in gameList" ref="listItem" :key="i" class="game-list-item">

            <GameDetailsComingSoon v-if="item.fields.isComingSoon" ref="details" :game="item" :active="gameIndex === i" />
            <GameDetails v-else-if="!item.isPlaceholder" ref="details" :game="item" :active="gameIndex === i" />
            <AxisDetails v-else ref="details" :game="item" :active="gameIndex === i" />

        </li>

    </ul>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
