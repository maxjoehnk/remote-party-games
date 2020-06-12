import { createWriteStream, promises} from 'fs'
import { join } from 'path'

const path = process.env.STORAGE_PATH

export async function prepareStorage() {
    await promises.mkdir(path, {
        recursive: true
    })
}

export function storeImage(imageId, imageStream) {
    const filePath = join(path, imageId)
    if (!filePath.startsWith(path))
        return Promise.reject("Nice try motherfucker")
    return new Promise(((resolve, reject) => {
        const stream = createWriteStream(filePath)
        imageStream.pipe(stream)
        stream.on('error', e => reject(e))
        stream.on('finish', () => resolve())
    }))
}

export function readImage(imageId, res) {
    res.sendFile(imageId, {
        root: path
    })
}