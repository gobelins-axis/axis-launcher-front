<template>
    <div class="score">

        <div class="col-left">

            <div v-if="index === 0" class="ranking">
                <IconFirst />
            </div>

            <div v-else class="ranking">
                {{ index + 1 }}
            </div>

            <div class="username">
                {{ data.username }}
            </div>

        </div>

        <div class="col-right">

            <div ref="value" class="value">
                {{ data.valueString || data.value }}
            </div>

            <div ref="date" class="date">
                {{ date }}
            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
