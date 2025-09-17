/**
 * Language Helper Functions
 * Supports English, Gujarati, and Hindi
 */

const SUPPORTED_LANGUAGES = ['english', 'gujarati', 'hindi'];
const DEFAULT_LANGUAGE = 'english';

/**
 * Validate if language is supported
 * @param {string} language - Language to validate
 * @returns {boolean} - True if supported
 */
const isValidLanguage = language => {
    return SUPPORTED_LANGUAGES.includes(language?.toLowerCase());
};

/**
 * Get supported languages
 * @returns {Array} - Array of supported languages
 */
const getSupportedLanguages = () => {
    return [...SUPPORTED_LANGUAGES];
};

/**
 * Get default language
 * @returns {string} - Default language
 */
const getDefaultLanguage = () => {
    return DEFAULT_LANGUAGE;
};

/**
 * Validate multi-language object structure
 * @param {Object} multiLangObj - Object with language properties
 * @param {Array} requiredLanguages - Array of required languages
 * @returns {Object} - Validation result
 */
const validateMultiLanguageObject = (multiLangObj, requiredLanguages = SUPPORTED_LANGUAGES) => {
    const errors = [];

    if (!multiLangObj || typeof multiLangObj !== 'object') {
        return { isValid: false, errors: ['Multi-language object is required'] };
    }

    for (const lang of requiredLanguages) {
        if (!multiLangObj[lang] || typeof multiLangObj[lang] !== 'string' || multiLangObj[lang].trim() === '') {
            errors.push(`${lang} translation is required and cannot be empty`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Get text in specific language with fallback
 * @param {Object} multiLangObj - Multi-language object
 * @param {string} language - Preferred language
 * @param {string} fallbackLanguage - Fallback language
 * @returns {string} - Text in preferred or fallback language
 */
const getTextInLanguage = (multiLangObj, language = DEFAULT_LANGUAGE, fallbackLanguage = DEFAULT_LANGUAGE) => {
    if (!multiLangObj || typeof multiLangObj !== 'object') {
        return '';
    }

    const preferredLang = language?.toLowerCase();
    const fallbackLang = fallbackLanguage?.toLowerCase();

    // Try preferred language first
    if (isValidLanguage(preferredLang) && multiLangObj[preferredLang]) {
        return multiLangObj[preferredLang];
    }

    // Try fallback language
    if (isValidLanguage(fallbackLang) && multiLangObj[fallbackLang]) {
        return multiLangObj[fallbackLang];
    }

    // Try default language
    if (multiLangObj[DEFAULT_LANGUAGE]) {
        return multiLangObj[DEFAULT_LANGUAGE];
    }

    // Return first available language
    for (const lang of SUPPORTED_LANGUAGES) {
        if (multiLangObj[lang]) {
            return multiLangObj[lang];
        }
    }

    return '';
};

/**
 * Create multi-language object from request body
 * @param {Object} body - Request body
 * @param {string} fieldName - Field name (e.g., 'title', 'description')
 * @returns {Object} - Multi-language object
 */
const createMultiLanguageObject = (body, fieldName) => {
    return {
        english: body[`${fieldName}_english`] || body[`${fieldName}English`] || body[`${fieldName}_english_url`] || '',
        gujarati:
            body[`${fieldName}_gujarati`] || body[`${fieldName}Gujarati`] || body[`${fieldName}_gujarati_url`] || '',
        hindi: body[`${fieldName}_hindi`] || body[`${fieldName}Hindi`] || body[`${fieldName}_hindi_url`] || ''
    };
};

/**
 * Validate video multi-language data
 * @param {Object} body - Request body
 * @param {Object} files - Uploaded files
 * @returns {Object} - Validation result
 */
const validateVideoMultiLanguage = (body, files = {}) => {
    const errors = [];

    // Validate title
    const titleValidation = validateMultiLanguageObject(createMultiLanguageObject(body, 'title'));
    if (!titleValidation.isValid) {
        errors.push(...titleValidation.errors.map(err => `Title: ${err}`));
    }

    // Validate description (optional but if provided, should be valid)
    const descriptionObj = createMultiLanguageObject(body, 'description');
    const hasDescription = Object.values(descriptionObj).some(val => val && val.trim() !== '');

    if (hasDescription) {
        const descriptionValidation = validateMultiLanguageObject(descriptionObj);
        if (!descriptionValidation.isValid) {
            errors.push(...descriptionValidation.errors.map(err => `Description: ${err}`));
        }
    }

    // For video and thumbnail, we don't validate here as they are handled separately in the controller
    // based on videoType and thumbnailType

    return {
        isValid: errors.length === 0,
        errors,
        data: {
            title: createMultiLanguageObject(body, 'title'),
            description: descriptionObj
        }
    };
};

/**
 * Validate question multi-language data
 * @param {Object} body - Request body
 * @returns {Object} - Validation result
 */
const validateQuestionMultiLanguage = body => {
    const errors = [];

    // Validate question text
    const questionTextValidation = validateMultiLanguageObject(createMultiLanguageObject(body, 'questionText'));
    if (!questionTextValidation.isValid) {
        errors.push(...questionTextValidation.errors.map(err => `Question Text: ${err}`));
    }

    // Validate correct answer (optional but if provided, should be valid)
    const correctAnswerObj = createMultiLanguageObject(body, 'correctAnswer');
    const hasCorrectAnswer = Object.values(correctAnswerObj).some(val => val && val.trim() !== '');

    if (hasCorrectAnswer) {
        const correctAnswerValidation = validateMultiLanguageObject(correctAnswerObj);
        if (!correctAnswerValidation.isValid) {
            errors.push(...correctAnswerValidation.errors.map(err => `Correct Answer: ${err}`));
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        data: {
            questionText: createMultiLanguageObject(body, 'questionText'),
            correctAnswer: correctAnswerObj
        }
    };
};

module.exports = {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    isValidLanguage,
    getSupportedLanguages,
    getDefaultLanguage,
    validateMultiLanguageObject,
    getTextInLanguage,
    createMultiLanguageObject,
    validateVideoMultiLanguage,
    validateQuestionMultiLanguage
};
