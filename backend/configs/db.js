import mongoose from "mongoose";

const connectDb = async () => {
    try {
        let mongoUrl = process.env.MONGODB_URL;
        
        if (!mongoUrl) {
            throw new Error("MONGODB_URL environment variable is not set");
        }
        
        // Ensure the database name is 'virtualcourse'
        // MongoDB connection string format: mongodb+srv://user:pass@cluster.net/databaseName?options
        
        let connectionString = mongoUrl;
        
        // Check if database name is already specified
        const urlMatch = mongoUrl.match(/^(mongodb\+srv?:\/\/[^\/]+)\/([^?]*)(\?.*)?$/);
        
        if (urlMatch) {
            const [, baseUrl, dbName, queryParams] = urlMatch;
            // Replace database name with 'virtualcourse'
            connectionString = baseUrl + '/virtualcourse' + (queryParams || '');
        } else {
            // If pattern doesn't match, try simple approach
            // Remove everything after last / and add virtualcourse
            const lastSlashIndex = mongoUrl.lastIndexOf('/');
            if (lastSlashIndex !== -1) {
                const baseUrl = mongoUrl.substring(0, lastSlashIndex + 1);
                const afterSlash = mongoUrl.substring(lastSlashIndex + 1);
                // Check if there are query params
                const queryIndex = afterSlash.indexOf('?');
                if (queryIndex !== -1) {
                    connectionString = baseUrl + 'virtualcourse?' + afterSlash.substring(queryIndex + 1);
                } else {
                    connectionString = baseUrl + 'virtualcourse';
                }
            } else {
                // No slash found, append /virtualcourse
                connectionString = mongoUrl + '/virtualcourse';
            }
        }
        
        await mongoose.connect(connectionString, {
            // Additional options for better connection handling
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log("✅ Database connected to 'virtualcourse' database in MongoDB Atlas")
    } catch (error) {
        console.log("❌ DB connection error:", error.message)
    }
}
export default connectDb