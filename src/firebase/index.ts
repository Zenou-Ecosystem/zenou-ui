import firebase from "firebase/app";
import Config from "../constants/config.constants";
function useFirebase() {
    const app = firebase.initializeApp(Config.firebaseConfig)
    return {
        googleAuth: [],
        emailPasswordAuth: [],
        fileUpload: {
            upload: [],
            uploadMany: [],
            pause: [],
            resume: [],
            download: []
        }
    }
}

export default useFirebase;