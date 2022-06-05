<template>
    <Transition
        :css="false"
        @enter="onEnter"
        @leave="onLeave"
    >
        <div ref="inputs" class="inputs">

            <InputIndicator v-for="(item, index) in inputs" :key="index" :input="item" />

        </div>
    </Transition>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
