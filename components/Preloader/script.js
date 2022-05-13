// Vendor
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            isLoadingCompleted: 'preloader/isLoadingCompleted',
        }),
    },

    watch: {
        isLoadingCompleted(isComplete) {
            if (isComplete) this.$el.style.display = 'none';
        },
    },

    mounted() {
        this.loadResources();
    },

    methods: {
        loadResources() {
            setTimeout(() => {
                this.$store.dispatch('preloader/setLoadingCompleted');
            }, 10);

            setTimeout(() => {
                this.$store.dispatch('preloader/setCompleted');
            }, 20);
        },
    },
};
