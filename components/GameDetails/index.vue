<template>
    <div class="game-details">

        <h2 class="title">
            <span>{{ game.fields.name }}</span>
        </h2>

        <GameTags v-if="game.fields.filters" :data="game.fields" />

        <h3 class="description">
            {{ game.fields.description || 'Description' }}
        </h3>

        <GameLeaderboard v-if="game.scores && game.scores.length > 0" ref="leaderboard" :data="game.scores" />

        <GameCredits v-if="game.fields.credits" :data="game.fields.credits" />

        <GameDate v-if="game.fields.date" :data="game.fields.date" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
