// Components
import InputA from '@/assets/icons/input-a.svg?inline';
import InputX from '@/assets/icons/input-x.svg?inline';
import InputI from '@/assets/icons/input-i.svg?inline';
import InputS from '@/assets/icons/input-s.svg?inline';

export default {
    props: ['input'],

    computed: {
        icon() {
            if (this.input.key === 'a') return InputA;
            if (this.input.key === 'x') return InputX;
            if (this.input.key === 'i') return InputI;
            if (this.input.key === 's') return InputS;
        },
    },
};
