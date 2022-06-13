import Axis from 'axis-api';
// import Axis from '../../axis-api/build/bundle';
import { gsap } from 'gsap';

export default (context, inject) => {
    Axis.registerKeys('Enter', 'a', 1);
    Axis.registerKeys('x', 'x', 1);
    Axis.registerKeys('i', 'i', 1);

    const gamepadEmulator = Axis.createGamepadEmulator(0);
    Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0); // Left
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, 'a', 1);
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 1, 'x', 1);
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 2, 'i', 1);
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, 's', 1);

    gsap.ticker.add(() => {
        gamepadEmulator.update();
    });

    inject('axis', Axis);
};
