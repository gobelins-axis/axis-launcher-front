<template>
    <div class="game-splash-screen">

        <div ref="name" class="name">
            <Loading ref="loadingIcon" class="loading-icon" />
            {{ data ? data.fields.name : '' }}
        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
