// Vendor
import { mapGetters } from 'vuex';

export default {
    props: ['error'],

    computed: {
        ...mapGetters({
            isProduction: 'context/isProduction',
        }),
    },

    mounted() {
        if (this.isProduction) this.$router.push('/error');
    },
};
