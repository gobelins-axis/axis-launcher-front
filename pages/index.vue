<template>
    <div class="page-home">

        <GameList ref="gameList" :games="games" @selectGame="selectGameHandler" />

        <Inputs ref="inputs" :inputs="inputs" />

        <GameSplashScreen ref="gameSplashScreen" :data="selectedGame" />

    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
