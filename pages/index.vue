<template>
    <div class="page-home">

        <GameList :games="games" />

        <Inputs
            :inputs="[
                { key: 'a', label: 'Sélectionner' },
                { key: 'i', label: 'Scores' },
            ]"
        />

    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
