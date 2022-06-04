// Components
import IconSolo from '@/assets/icons/solo.svg?inline';
import IconMulti from '@/assets/icons/multi.svg?inline';
import IconGame from '@/assets/icons/game.svg?inline';
import IconExperience from '@/assets/icons/experience.svg?inline';

export default {
    props: ['data'],

    computed: {
        content() {
            let content = '';

            if (this.data.type === 'solo') content = '1 joueur';

            if (this.data.type === 'multi') content = `${this.data.players} Joueurs`;

            if (this.data.type === 'game') content = 'Jeu';

            if (this.data.type === 'experience') content = 'Experience';

            return content;
        },

        icon() {
            let icon = '';

            if (this.data.type === 'solo') icon = 'IconSolo';

            if (this.data.type === 'multi') icon = 'IconMulti';

            if (this.data.type === 'game') icon = 'IconGame';

            if (this.data.type === 'experience') icon = 'IconExperience';

            return icon;
        },
    },

    components: {
        IconSolo,
        IconMulti,
        IconGame,
        IconExperience,
    },
};
