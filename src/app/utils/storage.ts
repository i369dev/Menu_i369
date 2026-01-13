import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadFileToStorage(file: File, path: string): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}
