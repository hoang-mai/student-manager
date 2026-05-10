import { z } from "zod";

/**
 * Schema validation cho form đăng nhập
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Schema validation cho form đổi mật khẩu
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Mật khẩu cũ không được để trống"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * Schema validation cho form đặt lại mật khẩu (Admin)
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu mới phải ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/**
 * Schema validation cho form thêm/sửa tài khoản (Admin)
 */
const baseProfileSchema = z.object({
  code: z.string().nullable().or(z.literal("")).optional(),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  email: z.email("Email không hợp lệ").nullable().or(z.literal("")).optional(),
  phoneNumber: z.string().nullable().or(z.literal("")).optional(),
  birthday: z
    .string()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .optional(),
  cccd: z.string().nullable().or(z.literal("")).optional(),
  gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
  hometown: z.string().nullable().or(z.literal("")).optional(),
  placeOfBirth: z.string().nullable().or(z.literal("")).optional(),
  ethnicity: z.string().nullable().or(z.literal("")).optional(),
  religion: z.string().nullable().or(z.literal("")).optional(),
  rank: z.string().nullable().or(z.literal("")).optional(),
  unit: z.string().nullable().or(z.literal("")).optional(),
  positionGovernment: z.string().nullable().or(z.literal("")).optional(),
  positionParty: z.string().nullable().or(z.literal("")).optional(),
  currentAddress: z.string().nullable().or(z.literal("")).optional(),
  dateOfEnlistment: z
    .string()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .optional(),
  partyMemberCardNumber: z.string().nullable().or(z.literal("")).optional(),
  probationaryPartyMember: z
    .string()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .optional(),
  fullPartyMember: z
    .string()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .optional(),
  familyMember: z.string().nullable().or(z.literal("")).optional(),
  foreignRelations: z.string().nullable().or(z.literal("")).optional(),
});

const studentFields = z.object({
  enrollment: z.coerce.number().nullable().optional(),
  currentCpa4: z.coerce.number().nullable().optional(),
  currentCpa10: z.coerce.number().nullable().optional(),
  graduationDate: z
    .string()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .optional(),
});

const commanderFields = z.object({
  startWork: z.coerce.number().nullable().optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(3, "Username phải ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ").optional().or(z.literal("")),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  role: z.enum(["STUDENT", "COMMANDER", "ADMIN"]),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, "Username phải ít nhất 3 ký tự"),
  code: z.string().min(1, "Mã không được để trống"),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  email: z.email("Email không hợp lệ").nullable().or(z.literal("")).optional(),
  phoneNumber: z.string().nullable().or(z.literal("")).optional(),
  birthday: z.string().nullable().or(z.literal("")).optional(),
  cccd: z.string().nullable().or(z.literal("")).optional(),
  gender: z.enum(["MALE", "FEMALE"], "Giới tính không được để trống"),
  hometown: z.string().nullable().or(z.literal("")).optional(),
  placeOfBirth: z.string().nullable().or(z.literal("")).optional(),
  ethnicity: z.string().nullable().or(z.literal("")).optional(),
  religion: z.string().nullable().or(z.literal("")).optional(),
  rank: z.string().nullable().or(z.literal("")).optional(),
  unit: z.string().nullable().or(z.literal("")).optional(),
  positionGovernment: z.string().nullable().or(z.literal("")).optional(),
  positionParty: z.string().nullable().or(z.literal("")).optional(),
  currentAddress: z.string().nullable().or(z.literal("")).optional(),
  dateOfEnlistment: z.string().nullable().or(z.literal("")).optional(),
  partyMemberCardNumber: z.string().nullable().or(z.literal("")).optional(),
  probationaryPartyMember: z.string().nullable().or(z.literal("")).optional(),
  fullPartyMember: z.string().nullable().or(z.literal("")).optional(),
  familyMember: z.string().nullable().or(z.literal("")).optional(),
  foreignRelations: z.string().nullable().or(z.literal("")).optional(),
  enrollment: z.number().nullable().optional(),
  currentCpa4: z.number().nullable().optional(),
  currentCpa10: z.number().nullable().optional(),
  graduationDate: z.string().nullable().or(z.literal("")).optional(),
  startWork: z.number().nullable().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

/**
 * Schema cho việc tạo tài khoản hàng loạt từ Excel
 */
export const batchUserSchema = z.array(
  z.object({
    username: z.string().min(3, "Username phải ít nhất 3 ký tự"),
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    email: z
      .email("Email không hợp lệ")
      .nullable()
      .or(z.literal(""))
      .optional(),
    role: z.enum(["STUDENT", "COMMANDER", "ADMIN"], "Role không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").optional(),
  })
);

export type BatchUserValues = z.infer<typeof batchUserSchema>;

/**
 * Schema cho file Excel tải lên
 */
export const batchExcelFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, "Dung lượng file tối đa là 5MB")
    .refine(
      (f) => /\.(xlsx|xls)$/i.test(f.name),
      "Chỉ chấp nhận file Excel (.xlsx, .xls)"
    ),
});

export type BatchExcelFileValues = z.infer<typeof batchExcelFileSchema>;

/**
 * Schema cho việc cập nhật học viên hàng loạt từ Excel
 */
export const batchUpdateStudentSchema = z.array(
  z.object({
    code: z.string().min(1, "Mã học viên không được để trống"),
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    email: z
      .email("Email không hợp lệ")
      .nullable()
      .or(z.literal(""))
      .optional(),
    phoneNumber: z.string().nullable().or(z.literal("")).optional(),
    birthday: z.string().nullable().or(z.literal("")).optional(),
    cccd: z.string().nullable().or(z.literal("")).optional(),
    gender: z.enum(["MALE", "FEMALE"], "Giới tính không được để trống"),
    hometown: z.string().nullable().or(z.literal("")).optional(),
    placeOfBirth: z.string().nullable().or(z.literal("")).optional(),
    ethnicity: z.string().nullable().or(z.literal("")).optional(),
    religion: z.string().nullable().or(z.literal("")).optional(),
    rank: z.string().nullable().or(z.literal("")).optional(),
    unit: z.string().nullable().or(z.literal("")).optional(),
    positionGovernment: z.string().nullable().or(z.literal("")).optional(),
    positionParty: z.string().nullable().or(z.literal("")).optional(),
    currentAddress: z.string().nullable().or(z.literal("")).optional(),
    dateOfEnlistment: z.string().nullable().or(z.literal("")).optional(),
    enrollment: z.number().nullable().optional(),
    currentCpa4: z.number().nullable().optional(),
    currentCpa10: z.number().nullable().optional(),
    graduationDate: z.string().nullable().or(z.literal("")).optional(),
    partyMemberCardNumber: z.string().nullable().or(z.literal("")).optional(),
    probationaryPartyMember: z.string().nullable().or(z.literal("")).optional(),
    fullPartyMember: z.string().nullable().or(z.literal("")).optional(),
  })
);

export type BatchUpdateStudentValues = z.infer<typeof batchUpdateStudentSchema>;

/**
 * Schema validation cho form thêm/sửa trường đại học
 */
export const universitySchema = z.object({
  universityCode: z
    .string()
    .min(1, "Mã trường là bắt buộc")
    .max(50, "Tối đa 50 ký tự"),
  universityName: z
    .string()
    .min(1, "Tên trường là bắt buộc")
    .max(255, "Tối đa 255 ký tự"),
  status: z.enum(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ"),
});

export type UniversityFormValues = z.infer<typeof universitySchema>;

/**
 * Schema validation cho form cập nhật thông tin cá nhân (Profile)
 */
export const profileSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.email("Email không hợp lệ").nullable().or(z.literal("")).optional(),
  phoneNumber: z.string().nullable().or(z.literal("")).optional(),
  birthday: z.string().nullable().or(z.literal("")).optional(),
  gender: z.enum(["MALE", "FEMALE"], "Giới tính không hợp lệ"),
  cccd: z.string().nullable().or(z.literal("")).optional(),
  currentAddress: z.string().nullable().or(z.literal("")).optional(),
  hometown: z.string().nullable().or(z.literal("")).optional(),
  placeOfBirth: z.string().nullable().or(z.literal("")).optional(),
  ethnicity: z.string().nullable().or(z.literal("")).optional(),
  religion: z.string().nullable().or(z.literal("")).optional(),
  rank: z.string().nullable().or(z.literal("")).optional(),
  unit: z.string().nullable().or(z.literal("")).optional(),
  positionGovernment: z.string().nullable().or(z.literal("")).optional(),
  positionParty: z.string().nullable().or(z.literal("")).optional(),
  startWork: z.number().nullable().optional(),
  dateOfEnlistment: z.string().nullable().or(z.literal("")).optional(),
  probationaryPartyMember: z.string().nullable().or(z.literal("")).optional(),
  fullPartyMember: z.string().nullable().or(z.literal("")).optional(),
  partyMemberCardNumber: z.string().nullable().or(z.literal("")).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Schema validation cho form thêm đơn vị (Organization)
 */
export const createOrganizationSchema = z.object({
  organizationName: z.string().min(1, "Tên đơn vị là bắt buộc"),
  travelTime: z.number().min(0, "Thời gian di chuyển không được âm"),
  universityId: z.string().min(1, "University ID là bắt buộc"),
});

export type CreateOrganizationFormValues = z.infer<
  typeof createOrganizationSchema
>;

/**
 * Schema validation cho form cập nhật đơn vị (Organization)
 */
export const updateOrganizationSchema = z.object({
  organizationName: z.string().min(1, "Tên đơn vị là bắt buộc"),
  travelTime: z.number().min(0, "Thời gian di chuyển không được âm"),
  universityId: z.string().min(1, "University ID là bắt buộc"),
});

export type UpdateOrganizationFormValues = z.infer<
  typeof updateOrganizationSchema
>;

/**
 * Schema validation cho form thêm trình độ (EducationLevel)
 */
export const createEducationLevelSchema = z.object({
  levelName: z.string().min(1, "Tên trình độ là bắt buộc"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type CreateEducationLevelFormValues = z.infer<
  typeof createEducationLevelSchema
>;

/**
 * Schema validation cho form cập nhật trình độ (EducationLevel)
 */
export const updateEducationLevelSchema = z.object({
  levelName: z.string().min(1, "Tên trình độ là bắt buộc"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type UpdateEducationLevelFormValues = z.infer<
  typeof updateEducationLevelSchema
>;

/**
 * Schema validation cho form thêm lớp học (Class)
 */
export const createClassSchema = z.object({
  className: z.string().min(1, "Tên lớp là bắt buộc"),
  studentCount: z.number().min(0, "Số lượng học viên không được âm"),
  educationLevelId: z.string().min(1, "Education Level ID là bắt buộc"),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;

/**
 * Schema validation cho form cập nhật lớp học (Class)
 */
export const updateClassSchema = z.object({
  className: z.string().min(1, "Tên lớp là bắt buộc"),
  studentCount: z.number().min(0, "Số lượng học viên không được âm"),
  educationLevelId: z.string().min(1, "Education Level ID là bắt buộc"),
});

export type UpdateClassFormValues = z.infer<typeof updateClassSchema>;
