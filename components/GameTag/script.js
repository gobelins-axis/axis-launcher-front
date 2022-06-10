// Components
import IconSolo from '@/assets/icons/solo.svg?inline';
import IconMulti from '@/assets/icons/multi.svg?inline';
import IconGame from '@/assets/icons/game.svg?inline';
import IconExperience from '@/assets/icons/experience.svg?inline';

export default {
    props: ['data'],

    computed: {
        content() {
            if (this.data.type === 'solo') return 'Solo';
            if (this.data.type === 'multi') return 'Multi';
            if (this.data.type === 'game') return 'Jeu';
            if (this.data.type === 'experience') return 'Experience';
        },

        icon() {
            if (this.data.type === 'solo') return 'IconSolo';
            if (this.data.type === 'multi') return 'IconMulti';
            if (this.data.type === 'game') return 'IconGame';
            if (this.data.type === 'experience') return 'IconExperience';
        },
    },

    components: {
        IconSolo,
        IconMulti,
        IconGame,
        IconExperience,
    },
};
