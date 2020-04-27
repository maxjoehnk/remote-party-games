import { emit } from '../../socket';

export function updateUsername(username: string) {
    emit({
        type: 'user/username',
        username
    });
}

export async function updateUserImage(userId: string, img) {
    await fetch('/api/image', {
        method: 'POST',
        headers: {
            'X-UserId': userId
        },
        body: img
    });
}

export function fetchUserImage(userId: string): Promise<Image> {
    return new Promise<Image>((resolve, reject) => {
        const img = new Image();
        img.src = `/api/image/${userId}`;
        img.addEventListener('error', err => reject(err));
        img.addEventListener('load', () => resolve(img));
    });
}
