export default {
    props: ['game', 'active'],

    mounted() {
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Private
         */
        setupEventListeners() {
            this.$axis.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            this.$axis.removeEventListener('keydown', this.keydownHandler);
        },

        keydownHandler(e) {
            if (!this.active) return;

            if (e.key === 'a') {
                // this.$axis.ipcRenderer?.send('url:changed', { url: 'https://google.com' });
            }
        },
    },
};
