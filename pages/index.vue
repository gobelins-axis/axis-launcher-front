<template>
    <div class="page-home">

        <GameList :games="games" @selectGame="selectGameHandler" />

        <Inputs
            ref="inputs"
            :inputs="[
                { key: 'a', label: 'Sélectionner' },
                { key: 'i', label: 'Scores' },
            ]"
        />

        <GameSplashScreen ref="gameSplashScreen" :data="selectedGame" />

    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
