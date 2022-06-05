<template>
    <div class="game-leaderboard">

        <ul class="score-list">

            <li v-for="(item, index) in scores" :key="index" class="score-list-item">

                <Score ref="score" :data="item" :index="index" />

            </li>

        </ul>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
