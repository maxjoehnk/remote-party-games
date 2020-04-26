import { emit, onMessage } from '../../socket';
import { UserConfigurationModel } from '../../contracts/user-configuration.model';

export function updateUsername(username: string) {
    emit({
        type: 'user/username',
        username
    });
}

export async function updateUserImage(userId: string, img) {
    const req = await fetch("/api/image", {
        method: 'POST',
        headers: {
            "X-UserId": userId
        },
        body: img
    })
}

export function subscribeUserConfiguration(callback: (config: UserConfigurationModel) => void) {
    return onMessage('user/initial-configuration', msg => callback(msg.configuration));
}
