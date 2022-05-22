<template>
    <div class="page-home">

        <h1>
            Games
        </h1>

        <div v-for="(item, index) in games" :key="index">
            {{ item.fields.title }}
        </div>

    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
