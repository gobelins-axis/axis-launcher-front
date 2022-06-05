<template>
    <div class="inputs">

        <InputIndicator v-for="(item, index) in currentInputs" :key="index" :input="item" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
