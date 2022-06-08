import dayjs from 'dayjs';
import { Input } from '../types/Input';
import { WeatherProvider } from '../types/WeatherProvider';

type Props = Pick<WeatherProvider, "snaps"> & Pick<Input, "tomorrow">

export const validateSnapTiming = ({ tomorrow, snaps }: Props) => {
    if (snaps.length !== 10) {
        return false;
    }

    for (let i = 0; i < snaps.length; i++) {
        const tomorrowTarget = dayjs(tomorrow).set('hour', i);
        const good = dayjs.unix(snaps[i].time).isSame(tomorrowTarget, 'hour');

        if (!good) {
            return false;
        }
    }

    return true;
}