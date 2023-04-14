const Config = {
    baseUrl: process.env.REACT_APP_BASEURL ?? "http://localhost:3001",
    authBaseUrl: process.env.REACT_APP_AUTH_BASEURL ?? 'http://localhost:3002',
    firebaseConfig: {
        apiKey: process.env.REACT_APP_FB_API_KEY,
        authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FB_PROJECTID,
        storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FB_MESSAGING_ID,
        appId: process.env.REACT_APP_FB_APP_ID,
        measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID
    }
}
export default Config;