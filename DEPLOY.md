# Hướng dẫn Deploy lên Mạng (Internet)

Để đưa trang web này lên internet (public) để mọi người cùng truy cập, bạn có thể sử dụng các dịch vụ cloud hosting miễn phí/giá rẻ như **Render** hoặc **Railway**.

## 1. Chuẩn bị (Đã xong)
Chúng tôi đã cấu hình mã nguồn để sẵn sàng deploy:
- **API URLs**: Đã chuyển thành đường dẫn tương đối (không còn `localhost`).
- **Start Script**: Đã thêm lệnh `npm start`.
- **Database**: Đã cấu hình để đọc từ biến môi trường.

## 2. Các bước Deploy (Ví dụ với Render.com)

**Bước 1: Đẩy code lên GitHub**
Bạn cần đưa thư mục code này lên một GitHub Repository.
1. Tạo repo mới trên GitHub.
2. Mở terminal tại thư mục dự án và chạy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <LINK_REPO_GITHUB_CUA_BAN>
   git push -u origin main
   ```

**Bước 2: Tạo Web Service trên Render**
1. Đăng ký tài khoản tại [render.com](https://render.com).
2. Chọn **New +** -> **Web Service**.
3. Kết nối với GitHub repo bạn vừa tạo.
4. Điền thông tin:
   - **Name**: `shop-dien-nuoc` (tùy ý)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Quan trọng - Biến môi trường (Environment Variables)**:
   - Thêm `DATABASE_URL`: `file:./dev.db` (Để dùng SQLite đơn giản) Hoặc kết nối Postgres nếu muốn chuyên nghiệp hơn.
   - Thêm `JWT_SECRET`: Nhập một chuỗi ngẫu nhiên bí mật.

6. Nhấn **Create Web Service**.

**Bước 3: Hoàn tất**
Render sẽ tự động build và deploy. Sau vài phút, bạn sẽ nhận được một đường link kiểu `https://shop-dien-nuoc.onrender.com`.

## Lưu ý về Cơ sở dữ liệu (Database)
Hiện tại dự án dùng **SQLite** (file `dev.db`).
- Trên các gói miễn phí của Render/Heroku, file này **sẽ bị reset** mỗi khi deploy lại (do hệ thống file ephemeral).
- Để dữ liệu không bị mất, bạn nên dùng **PostgreSQL** (Railway hoặc Render có cung cấp) và cập nhật biến `DATABASE_URL` thành link Postgres.
