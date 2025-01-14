const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 6;
};

const isValidUsername = (username) => {
    return username && username.length >= 3 && username.length <= 30;
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidUsername
};