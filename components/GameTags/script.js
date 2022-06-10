// Components
import GameTag from '@/components/GameTag';

export default {
    props: ['data'],

    computed: {
        tags() {
            const tags = [];

            if (this.data.filters.onePlayer) tags.push({ type: 'solo' });
            if (this.data.filters.multiPlayer) tags.push({ type: 'multi' });
            if (this.data.filters.game) tags.push({ type: 'game' });
            if (this.data.filters.experience) tags.push({ type: 'experience' });

            return tags;
        },
    },

    components: {
        GameTag,
    },
};
