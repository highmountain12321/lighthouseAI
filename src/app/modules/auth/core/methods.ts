export const isAccessTokenExpired = (user: any) => {
    // Get the current time in milliseconds
    const currentTime = new Date().getTime();

    // Get the expiration time of the access token from the user object
    const expirationTime = user?.stsTokenManager?.expirationTime;

    // Check if expirationTime exists and is greater than the current time
    return expirationTime && expirationTime < currentTime;
};