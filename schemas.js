const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Create an escapeHTML() method that sanitize HTML.  
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

// Set up an extension for BaseJoi.  
const Joi = BaseJoi.extend(extension);

// Middleware function to validate schema.  
// Use joi to validate the schema, both title and content must be non-empty strings.  
// Use escapeHTML() method to sanitize HTML for all text inputs.  
module.exports.threadSchema = Joi.object({
        thread: Joi.object({
            title: Joi.string().required().escapeHTML(), 
            content: Joi.string().required().escapeHTML() 
        }).required()
    });

// Use joi to validate the schema, replyContent must not be an empty string.  
// Use escapeHTML() method to sanitize HTML for all text inputs.  
module.exports.replySchema = Joi.object({
    reply: Joi.object({
        replyContent: Joi.string().required().escapeHTML()
    }).required()
});