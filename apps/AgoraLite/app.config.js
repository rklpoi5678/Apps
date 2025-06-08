import 'dotenv/config'

const VERSION_NAME = "1.0.0"
const VERSION_CODE = 1000001

module.exports =({config}) => {
    return {
        ...config,
        version: VERSION_NAME,
        ios: {
            buildNumber: VERSION_CODE + "",
            bundleIdentifier: "com.youngikim.agoralite"
        },
        android:{
            versionCode: VERSION_CODE,
            package: "com.youngikim.agoralite"
        },
        extra:{
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID,
        }
    }
}