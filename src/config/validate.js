import joi from "joi";
const Loginschema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be a valid address with .com or .net",
      "string.min": "Email must be at least 6 characters",
      "string.max": "Email must be less than or equal to 60 characters",
      "string.empty": "Email is required",
    }),
  password: joi
    .string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
      "string.empty": "Password is required",
    }),
});
const postSchema = joi.object({
  title: joi.string().min(5).max(200).required(),
  description: joi.string().min(10).required(),

  articleImages: joi
    .array()
    .items(
      joi.object({
        url: joi.string().uri().required().allow(""),
      })
    )
    .optional(),
  Imagecaption: joi.string().optional(),
});
const Email = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be a valid address with .com or .net",
      "string.min": "Email must be at least 6 characters",
      "string.max": "Email must be less than or equal to 60 characters",
      "string.empty": "Email is required",
    }),
});
export { Loginschema, postSchema, Email };
