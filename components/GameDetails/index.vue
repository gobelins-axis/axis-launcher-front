<template>
    <div class="game-details">

        <h2 class="title">
            {{ game.fields.name }}
        </h2>

        <h3 class="description">
            {{ game.fields.description || 'Description' }}
        </h3>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
