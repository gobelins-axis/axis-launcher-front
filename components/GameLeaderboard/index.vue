<template>
    <div class="game-leaderboard">

        <ul class="score-list">

            <li v-for="(item, index) in scores" :key="index" class="score-list-item">

                <div class="col-left">

                    <div v-if="index === 0" class="ranking">
                        <IconFirst />
                    </div>
                    <div v-else class="ranking">
                        {{ index + 1 }}
                    </div>

                    <div class="username">
                        Leotte
                        <!-- {{ item.username }} -->
                    </div>

                </div>

                <div class="col-right">

                    <div class="score">
                        {{ item.value }}
                    </div>

                    <div class="date">
                        {{ item.date }}
                    </div>

                </div>

            </li>

        </ul>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
