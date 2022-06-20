<template>
    <div class="inputs">

        <div ref="container" class="container">

            <InputIndicator v-for="(item, index) in currentInputs" :key="index" :input="item" />

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
