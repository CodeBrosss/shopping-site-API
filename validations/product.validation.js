const Joi = require("joi");

function validateProduct(product) {
	const Schema = Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().required(),
	});

	return Schema.validate(product);
}

module.exports = { validateProduct };