<template>
    <div class="axis-details">

        <h2 class="title">
            <span>{{ game.fields.name }}</span>
        </h2>

        <h3 class="description">
            <p v-for="(item, index) in game.fields.description" :key="index">
                {{ item }}
            </p>
        </h3>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
