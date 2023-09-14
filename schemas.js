const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.threadSchema = Joi.object({
    thread: Joi.object({
        title: Joi.string().required().escapeHTML(), 
        content: Joi.string().required().escapeHTML() 
    }).required()
});

module.exports.replySchema = Joi.object({
    reply: Joi.object({
        replyContent: Joi.string().required().escapeHTML()
    }).required()
});
