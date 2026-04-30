# Database Schema - Student Manager

## Danh sách bảng

| STT | Tên bảng | Mục đích |
|:---:|:---|:---|
| 1 | `users` | Tài khoản đăng nhập & phân quyền |
| 2 | `student_profiles` | Hồ sơ chi tiết học viên/sinh viên |
| 3 | `roles` | Vai trò ngườ dùng |
| 4 | `permissions` | Các quyền hạn trong hệ thống |
| 5 | `role_permissions` | Bảng trung gian phân quyền (N:M) |
| 6 | `training_units` | Cơ sở đào tạo |
| 7 | `universities` | Trường đại học liên kết |
| 8 | `majors` | Chuyên ngành đào tạo |
| 9 | `academic_years` | Niên khóa |
| 10 | `classes` | Lớp học |
| 11 | `semesters` | Học kỳ |
| 12 | `courses` | Môn học |
| 13 | `grades` | Điểm số |
| 14 | `grade_requests` | Yêu cầu phúc tra điểm |
| 15 | `grade_request_attachments` | Tệp đính kèm phúc tra |
| 16 | `achievements` | Thành tích / Khen thưởng |
| 17 | `schedules` | Thờ khóa biểu |
| 18 | `meal_schedules` | Lịch ăn uống |
| 19 | `tuitions` | Học phí |
| 20 | `duty_rosters` | Lịch trực / Gác |

---

## 1. users

Tài khoản đăng nhập và thông tin phân quyền. Không chứa thông tin cá nhân chi tiết.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `username` | VARCHAR(50) | NO | - | Tên đăng nhập (duy nhất) |
| `password` | VARCHAR(255) | NO | - | Mật khẩu đã hash |
| `email` | VARCHAR(100) | YES | - | Email (duy nhất) |
| `role_id` | INTEGER | NO | - | Khóa ngoại → `roles.id` |
| `is_active` | BOOLEAN | YES | `true` | Trạng thái hoạt động |
| `last_login_at` | TIMESTAMP | YES | - | Lần đăng nhập cuối |
| `is_admin` | BOOLEAN | YES | `false` | Có phải admin không |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `username`, `email`
- FOREIGN KEY: `role_id` → `roles.id`

---

## 2. student_profiles

Hồ sơ chi tiết học viên. Mỗi user có tối đa 1 profile (1:1).

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `user_id` | INTEGER | NO | - | Khóa ngoại → `users.id` (duy nhất) |
| `commander_id` | VARCHAR(36) | YES | - | ID ngườ chỉ huy quản lý trực tiếp |
| `student_code` | VARCHAR(50) | NO | - | Mã học viên (duy nhất) |
| `class_id` | INTEGER | YES | - | Khóa ngoại → `classes.id` |
| `university_id` | INTEGER | YES | - | Khóa ngoại → `universities.id` |
| `major_id` | INTEGER | YES | - | Khóa ngoại → `majors.id` |
| `academic_year_id` | INTEGER | YES | - | Khóa ngoại → `academic_years.id` |
| `training_unit_id` | INTEGER | YES | - | Khóa ngoại → `training_units.id` |
| `full_name` | VARCHAR(100) | YES | - | Họ và tên |
| `gender` | ENUM | YES | - | `MALE`, `FEMALE`, `OTHER` |
| `birthday` | DATE | YES | - | Ngày sinh |
| `place_of_birth` | VARCHAR(255) | YES | - | Nơi sinh |
| `hometown` | VARCHAR(255) | YES | - | Quê quán |
| `ethnicity` | VARCHAR(50) | YES | - | Dân tộc |
| `religion` | VARCHAR(50) | YES | - | Tôn giáo |
| `current_address` | VARCHAR(255) | YES | - | Địa chỉ hiện tại |
| `phone_number` | VARCHAR(20) | YES | - | Số điện thoại |
| `cccd` | VARCHAR(20) | YES | - | Số CCCD |
| `party_card_number` | VARCHAR(50) | YES | - | Số thẻ Đảng |
| `start_work` | DATE | YES | - | Ngày bắt đầu công tác |
| `organization` | VARCHAR(255) | YES | - | Cơ quan công tác |
| `unit` | VARCHAR(255) | YES | - | Đơn vị hiện tại |
| `rank` | VARCHAR(50) | YES | - | Quân hàm / Cấp bậc |
| `position_government` | VARCHAR(100) | YES | - | Chức vụ chính quyền |
| `position_party` | VARCHAR(100) | YES | - | Chức vụ Đảng |
| `full_party_member` | DATE | YES | - | Ngày vào Đảng chính thức |
| `probationary_party_member` | DATE | YES | - | Ngày vào Đảng dự bị |
| `date_of_enlistment` | DATE | YES | - | Ngày nhập ngũ |
| `enrollment_date` | DATE | YES | - | Ngày nhập học |
| `avatar` | VARCHAR(255) | YES | - | URL ảnh đại diện |
| `status` | ENUM | YES | `STUDYING` | `STUDYING`, `GRADUATED`, `SUSPENDED`, `DROPPED` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `user_id`, `student_code`
- FOREIGN KEY: `user_id` → `users.id`

---

## 3. roles

Vai trò ngườ dùng trong hệ thống.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(50) | NO | - | Tên vai trò (duy nhất) |
| `description` | VARCHAR(255) | YES | - | Mô tả |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `name`

---

## 4. permissions

Các quyền hạn chi tiết trong hệ thống.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(100) | NO | - | Tên quyền (duy nhất) |
| `resource` | VARCHAR(100) | NO | - | Tài nguyên (ví dụ: `grade`, `user`) |
| `action` | VARCHAR(50) | NO | - | Hành động (`create`, `read`, `update`, `delete`) |
| `description` | VARCHAR(255) | YES | - | Mô tả |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `name`

---

## 5. role_permissions

Bảng trung gian quan hệ N:M giữa `roles` và `permissions`.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `role_id` | INTEGER | NO | - | Khóa ngoại → `roles.id` (PK) |
| `permission_id` | INTEGER | NO | - | Khóa ngoại → `permissions.id` (PK) |

**Ràng buộc:**
- PRIMARY KEY: (`role_id`, `permission_id`)

---

## 6. training_units

Cơ sở đào tạo (trường sĩ quan, trường công an, đơn vị quân đội...).

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `code` | VARCHAR(50) | NO | - | Mã cơ sở (duy nhất) |
| `name` | VARCHAR(255) | NO | - | Tên cơ sở |
| `address` | TEXT | YES | - | Địa chỉ |
| `phone` | VARCHAR(20) | YES | - | Số điện thoại |
| `commander_id` | INTEGER | YES | - | Ngườ chỉ huy cơ sở → `users.id` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `code`
- FOREIGN KEY: `commander_id` → `users.id`

---

## 7. universities

Trường đại học liên kết đào tạo.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `code` | VARCHAR(50) | NO | - | Mã trường (duy nhất) |
| `name` | VARCHAR(255) | NO | - | Tên trường |
| `address` | TEXT | YES | - | Địa chỉ |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `code`

---

## 8. majors

Chuyên ngành đào tạo, thuộc về một trường đại học.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `code` | VARCHAR(50) | NO | - | Mã ngành (duy nhất) |
| `name` | VARCHAR(255) | NO | - | Tên ngành |
| `university_id` | INTEGER | NO | - | Khóa ngoại → `universities.id` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `code`
- FOREIGN KEY: `university_id` → `universities.id`

---

## 9. academic_years

Niên khóa (ví dụ: 2024-2025).

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(50) | NO | - | Tên niên khóa |
| `start_year` | INTEGER | NO | - | Năm bắt đầu |
| `end_year` | INTEGER | NO | - | Năm kết thúc |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 10. classes

Lớp học, thuộc về một chuyên ngành và niên khóa.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `code` | VARCHAR(50) | NO | - | Mã lớp (duy nhất) |
| `name` | VARCHAR(255) | NO | - | Tên lớp |
| `major_id` | INTEGER | NO | - | Khóa ngoại → `majors.id` |
| `academic_year_id` | INTEGER | NO | - | Khóa ngoại → `academic_years.id` |
| `training_unit_id` | INTEGER | YES | - | Khóa ngoại → `training_units.id` |
| `commander_id` | INTEGER | YES | - | Cán bộ chỉ huy lớp → `users.id` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `code`
- FOREIGN KEY: `major_id`, `academic_year_id`, `training_unit_id`, `commander_id`

---

## 11. semesters

Học kỳ trong niên khóa.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(100) | NO | - | Tên học kỳ |
| `academic_year_id` | INTEGER | NO | - | Khóa ngoại → `academic_years.id` |
| `start_date` | DATE | NO | - | Ngày bắt đầu |
| `end_date` | DATE | NO | - | Ngày kết thúc |
| `registration_start` | DATE | YES | - | Ngày bắt đầu đăng ký |
| `registration_end` | DATE | YES | - | Ngày kết thúc đăng ký |
| `exam_start` | DATE | YES | - | Ngày bắt đầu thi |
| `exam_end` | DATE | YES | - | Ngày kết thúc thi |
| `grade_entry_deadline` | DATE | YES | - | Hạn nhập điểm |
| `is_active` | BOOLEAN | YES | `true` | Đang hoạt động |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 12. courses

Danh sách môn học.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `code` | VARCHAR(50) | NO | - | Mã môn (duy nhất) |
| `name` | VARCHAR(255) | NO | - | Tên môn học |
| `credits` | INTEGER | YES | `0` | Số tín chỉ |
| `description` | TEXT | YES | - | Mô tả |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

**Ràng buộc:**
- UNIQUE: `code`

---

## 13. grades

Điểm số của học viên cho từng môn học.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `student_id` | INTEGER | NO | - | Khóa ngoại → `student_profiles.id` |
| `course_id` | INTEGER | NO | - | Khóa ngoại → `courses.id` |
| `semester_id` | INTEGER | NO | - | Khóa ngoại → `semesters.id` |
| `score_10` | FLOAT | YES | - | Điểm hệ 10 |
| `score_4` | FLOAT | YES | - | Điểm hệ 4 |
| `letter_grade` | VARCHAR(5) | YES | - | Điểm chữ (A, B, C...) |
| `status` | ENUM | YES | `PENDING` | `PASSED`, `FAILED`, `PENDING` |
| `created_by` | INTEGER | YES | - | Ngườ nhập điểm → `users.id` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 14. grade_requests

Yêu cầu phúc tra / hiệu chỉnh điểm.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `student_id` | INTEGER | NO | - | Khóa ngoại → `student_profiles.id` |
| `course_id` | INTEGER | NO | - | Khóa ngoại → `courses.id` |
| `semester_id` | INTEGER | NO | - | Khóa ngoại → `semesters.id` |
| `request_type` | ENUM | NO | - | `ADD`, `UPDATE`, `DELETE` |
| `reason` | TEXT | YES | - | Lý do yêu cầu |
| `proposed_score_10` | FLOAT | YES | - | Điểm đề xuất |
| `status` | ENUM | YES | `PENDING` | `PENDING`, `APPROVED`, `REJECTED` |
| `reviewer_id` | INTEGER | YES | - | Ngườ xét duyệt → `users.id` |
| `review_note` | TEXT | YES | - | Ghi chú xét duyệt |
| `reviewed_at` | TIMESTAMP | YES | - | Thờ gian xét duyệt |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 15. grade_request_attachments

Tệp đính kèm theo yêu cầu phúc tra.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `grade_request_id` | INTEGER | NO | - | Khóa ngoại → `grade_requests.id` |
| `file_name` | VARCHAR(255) | YES | - | Tên file |
| `file_url` | VARCHAR(500) | NO | - | Đường dẫn file |
| `file_type` | VARCHAR(50) | YES | - | Loại file |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |

---

## 16. achievements

Thành tích, khen thưởng, đề tài của học viên.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `student_id` | INTEGER | NO | - | Khóa ngoại → `student_profiles.id` |
| `title` | VARCHAR(255) | NO | - | Tên thành tích |
| `achievement_type` | ENUM | NO | - | `REWARD`, `SCIENTIFIC_TOPIC`, `TRAINING` |
| `level` | VARCHAR(100) | YES | - | Cấp độ (cấp trường, quân khu...) |
| `issue_date` | DATE | YES | - | Ngày cấp |
| `description` | TEXT | YES | - | Mô tả |
| `file_url` | VARCHAR(500) | YES | - | File minh chứng |
| `created_by` | INTEGER | YES | - | Ngườ ghi nhận → `users.id` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 17. schedules

Thờ khóa biểu học tập.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `class_id` | INTEGER | YES | - | Khóa ngoại → `classes.id` |
| `student_id` | INTEGER | YES | - | Khóa ngoại → `student_profiles.id` |
| `course_id` | INTEGER | NO | - | Khóa ngoại → `courses.id` |
| `semester_id` | INTEGER | NO | - | Khóa ngoại → `semesters.id` |
| `day_of_week` | INTEGER | NO | - | Thứ trong tuần (0-6) |
| `start_time` | TIME | NO | - | Giờ bắt đầu |
| `end_time` | TIME | NO | - | Giờ kết thúc |
| `room` | VARCHAR(100) | YES | - | Phòng học |
| `schedule_type` | ENUM | YES | `CLASS` | `CLASS` (cả lớp) / `PERSONAL` (cá nhân) |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 18. meal_schedules

Lịch đăng ký / hủy ăn của học viên.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `student_id` | INTEGER | NO | - | Khóa ngoại → `student_profiles.id` |
| `schedule_date` | DATE | NO | - | Ngày ăn |
| `session` | ENUM | NO | - | `MORNING`, `NOON`, `AFTERNOON`, `EVENING` |
| `status` | ENUM | YES | `REGISTERED` | `REGISTERED`, `CANCELLED` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 19. tuitions

Thông tin học phí của học viên.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `student_id` | INTEGER | NO | - | Khóa ngoại → `student_profiles.id` |
| `semester_id` | INTEGER | NO | - | Khóa ngoại → `semesters.id` |
| `amount` | DECIMAL(15,2) | NO | - | Số tiền phải đóng |
| `paid_amount` | DECIMAL(15,2) | YES | `0.00` | Số tiền đã đóng |
| `status` | ENUM | YES | `UNPAID` | `PAID`, `UNPAID`, `PARTIAL` |
| `due_date` | DATE | YES | - | Hạn đóng |
| `paid_at` | TIMESTAMP | YES | - | Thờ gian đóng tiền |
| `note` | TEXT | YES | - | Ghi chú |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## 20. duty_rosters

Lịch trực, gác, hoặc nhiệm vụ.

| Cột | Kiểu | NULL | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | INTEGER | NO | AUTO_INCREMENT | Khóa chính |
| `user_id` | INTEGER | NO | - | Khóa ngoại → `users.id` (ngườ trực) |
| `duty_date` | DATE | NO | - | Ngày trực |
| `shift` | ENUM | NO | - | `MORNING`, `AFTERNOON`, `NIGHT`, `FULL` |
| `duty_type` | ENUM | YES | `OTHER` | `COMMAND`, `SECURITY`, `OTHER` |
| `note` | TEXT | YES | - | Ghi chú |
| `created_by` | INTEGER | YES | - | Ngườ lập lịch → `users.id` |
| `created_at` | TIMESTAMP | YES | NOW | Thờ gian tạo |
| `updated_at` | TIMESTAMP | YES | NOW | Thờ gian cập nhật |

---

## Mối quan hệ giữa các bảng

```
users (1) ──────── (N) student_profiles
 │
 ├── (1) ──────── (N) training_units (commander)
 ├── (1) ──────── (N) classes (commander)
 ├── (1) ──────── (N) grades (created_by)
 ├── (1) ──────── (N) grade_requests (reviewer)
 ├── (1) ──────── (N) achievements (created_by)
 ├── (1) ──────── (N) duty_rosters
 └── (1) ──────── (N) duty_rosters (created_by)

roles (1) ──────── (N) users
roles (N) ──────── (N) permissions
       through: role_permissions

universities (1) ──────── (N) majors
universities (1) ──────── (N) student_profiles

majors (1) ──────── (N) classes
majors (1) ──────── (N) student_profiles

academic_years (1) ──────── (N) classes
academic_years (1) ──────── (N) semesters
academic_years (1) ──────── (N) student_profiles

training_units (1) ──────── (N) classes
training_units (1) ──────── (N) student_profiles

classes (1) ──────── (N) student_profiles
classes (1) ──────── (N) schedules

semesters (1) ──────── (N) grades
semesters (1) ──────── (N) grade_requests
semesters (1) ──────── (N) schedules
semesters (1) ──────── (N) tuitions

courses (1) ──────── (N) grades
courses (1) ──────── (N) grade_requests
courses (1) ──────── (N) schedules

student_profiles (1) ──────── (N) grades
student_profiles (1) ──────── (N) grade_requests
student_profiles (1) ──────── (N) achievements
student_profiles (1) ──────── (N) schedules
student_profiles (1) ──────── (N) meal_schedules
student_profiles (1) ──────── (N) tuitions

grade_requests (1) ──────── (N) grade_request_attachments
```
