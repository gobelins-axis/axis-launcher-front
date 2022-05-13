export default {
    computed: {
        lang() {
            return this.$i18n.locale;
        },

        localeCopy() {
            return this.$t('data');
        },
    },
};
