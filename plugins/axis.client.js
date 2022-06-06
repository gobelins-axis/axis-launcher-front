// import Axis from 'axis-api';
import Axis from '../../axis-api/src/index';
import { gsap } from 'gsap';

export default (context, inject) => {
    Axis.registerKeys('Enter', 'a', 1);
    Axis.registerKeys('x', 'b', 1);
    Axis.registerKeys('i', 'c', 1);

    const gamepadEmulator = Axis.createGamepadEmulator(0);
    Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0); // Left
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 1, 'a', 1);
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, 'b', 1);
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 2, 'c', 1);
    Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, 'd', 1);

    gsap.ticker.add(() => {
        gamepadEmulator.update();
    });

    inject('axis', Axis);
};
