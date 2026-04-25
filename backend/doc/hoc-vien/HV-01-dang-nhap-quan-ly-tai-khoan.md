# HV-01 - Đăng nhập & quản lý tài khoản

## Thông tin chung
- **Nhóm người dùng:** Học viên
- **Mã chức năng:** HV-01
- **Tên chức năng:** Đăng nhập & quản lý tài khoản

## Mô tả
Đăng nhập bằng tài khoản được cấp, đổi mật khẩu, bảo mật tài khoản.

## Module liên quan
- Auth Module
- User Module
- Security Middleware

## Luồng hoạt động chi tiết
1. Người dùng truy cập màn hình đăng nhập và nhập tên đăng nhập/mật khẩu.
2. Hệ thống xác thực thông tin qua Auth Module.
3. Sau đăng nhập thành công, cấp JWT token và lưu session.
4. Học viên có thể vào trang cá nhân để đổi mật khẩu.
5. Mật khẩu được mã hóa (bcrypt) trước khi lưu vào DB.

## Giao diện & API
- *(Cập nhật sau khi thiết kế UI/UX và API endpoints)*

## Dữ liệu & Database
- *(Cập nhật sau khi thiết kế schema)*

## Lưu ý bảo mật / Quyền hạn
- *(Cập nhật theo phân quyền chi tiết)*
