import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
        /[@$!%*?&#^~]/,
        "Password must include at least one special character (@, $, !, %, *, ?, &, #, ^, ~)"
    );

const usernameSchema = z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(32, "Username must not exceed 32 characters")
    .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, hyphens, and underscores"
    )
    .refine((value) => !/^\d+$/.test(value), {
        message: "Username cannot be only numbers",
    })
    .refine((value) => !/[@$!%*?&]/.test(value), {
        message: "Username cannot contain special characters like @$!%*?&",
    });

const login = z.object({
    body: z
        .object({
            login: z.string().min(1, "Login is required"),
            password: z.string().min(1, "Password is required"),
        })
        .transform((data) => {
            const isEmail = z.email().safeParse(data.login).success;
            return {
                ...data,
                inputType: isEmail ? ("email" as const) : ("username" as const),
            };
        }),
});

const register = z.object({
    body: z
        .object({
            username: usernameSchema,
            email: z.email("Invalid email format"), //.string().trim().min(1, "Email is required")
            password: passwordSchema,
            password_confirmation: z
                .string()
                .min(1, "Password confirmation is required"),
        })
        .refine((data) => data.password === data.password_confirmation, {
            path: ["password_confirmation"],
            message: "Passwords do not match",
        }),
});

const authSchema = {
    login,
    register,
};

export default authSchema;

// const loginSchema = z.object({
//     identifier: z.string().min(1, "Identifier is required"),
//     inputType: "",
// }).superRefine((data, ctx) => {
//     if (data.identifier.includes('@')) {
//         const emailValidationResult = z.email("Invalid email format").safeParse(data.identifier);
//         if (!emailValidationResult.success) {
//             ctx.addIssue({
//                 code: "custom",
//                 message: emailValidationResult.error.message,
//                 path: ['identifier'],
//             });
//         } else {
//             data.inputType = 'email';
//         }
//     } else {
//         const usernameValidationResult = z.string()
//             .min(4, "Username must be at least 4 characters long")
//             .max(32, "Username must not exceed 32 characters")
//             .safeParse(data.identifier);

//         if (!usernameValidationResult.success) {
//             ctx.addIssue({
//                 code: "custom",
//                 message: usernameValidationResult.error.message,
//                 path: ['identifier'],
//             });
//         } else {
//             data.inputType = 'username';
//         }
//     }
// });
