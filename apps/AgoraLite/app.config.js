import 'dotenv/config'

module.exports =({config}) => {
    return {
        ...config,
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