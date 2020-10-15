const { body, validationResult } = require('express-validator');

const registerValidationRules = () => {
  return [
    body('username')
      .trim()
      .isLength({ min: 6, max: 16 })
      .withMessage('username must be  6 to 16 characters')
      .isAlpha()
      .withMessage('Use only letters'),
    body('email').trim().isEmail().withMessage('email format is incorrect'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password is too short'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  registerValidationRules,
  validate,
};
