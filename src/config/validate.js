import joi from "joi";
const Loginschema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .required(),
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
export { Loginschema, postSchema };
