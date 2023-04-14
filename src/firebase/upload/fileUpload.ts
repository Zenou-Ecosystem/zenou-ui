import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Config from "../../constants/config.constants";



export const upload = async (file: File, dirname?: string) => {
    const app = initializeApp(Config.firebaseConfig);
    const store = getStorage(app);
    const storageRef = ref(store, `/${dirname ? dirname : "files"}/${file.name}`)
    await uploadBytesResumable(storageRef, file);
    const stringUrl = await getDownloadURL(storageRef);
    return stringUrl;
}