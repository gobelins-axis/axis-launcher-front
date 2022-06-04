// Components
import IconFirst from '@/assets/icons/first.svg?inline';

export default {
    props: ['data'],

    data() {
        return {
            scores: [
                { username: 'JuJU', value: '1', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
            ],
        };
    },

    components: {
        IconFirst,
    },
};
