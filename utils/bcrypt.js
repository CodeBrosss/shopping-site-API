const bcrypt = require('bcryptjs');
 
const hashPassword = async (password, salt = 12) => {
	const hashPassword = await bcrypt.hash(password, salt);
	return hashPassword;
};

const validatePassword = async (plainPassword, hashedPassword) => {
	return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    validatePassword
}