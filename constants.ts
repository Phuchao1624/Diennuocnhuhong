import { Product, Category, Feature } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Bóng Đèn LED Rạng Đông 9W - Ánh sáng trắng 6500K",
    price: 45000,
    originalPrice: 53000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX-j61JxZZnsJXe-wvkmddiDlPBcTVlOymb9QgNPRLEao9CCCGcNmKlCN3bAq4nmYkPII9Mf40D50a3r_B5Vx_au_Ug2K1PV27wHNjQZw0QAZc3HwcIdBym734hJf4AVzQlT6zO04AQdGWF4WVWHF2rOJE5wdBXzx9xyhFNDPRcQenmkGt0_I1bw862AWuAKqCQqFHKQa2RXnFxJKOkI_Roqi06QvD8c7oWs5UMz4FplijqX2H46QtY9AYB0Dl_bNR7jBAatqIgj8",
    rating: 4.5,
    reviews: 45,
    discount: 15
  },
  {
    id: 2,
    name: "Ống Nhựa Bình Minh Ø27 - Độ bền cao (m)",
    price: 12000,
    unit: "/mét",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDRJuBr48j7mtypMbVQr23Gb9wqYWZESJcwdFpFNmaGk4lEskYgMzRhZn0pUmzIBjlI3C9WnwgQ7Xl8oQ29Q3woIBBPVzxIuGKp0DngvN77lc09YwkHfsU7bhLRoIcU2X2DWMguxKuVlQ6xH49XQxADMItt_iq9j2Bfl4-O3sQCfqp8tVeomzElUv0a4ouVO_MXzwyj8RLui4wBuoon95PFMoi5h3uX0HqQSinr5PKqS8izUn7zWqkchHniaPOdC5gHr06r-_VHs4",
    rating: 5,
    reviews: 120
  },
  {
    id: 3,
    name: "CB Tép Panasonic 20A - An toàn vượt trội",
    price: 150000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe2VLDZGZtSAG8SZMOS5ktMttS-4qxHBGinRmpyPTYlw7PC6euYNL9FpqHtyhcNPTjsteph20xrtUqrmCods1obKSph9s3gDmdwpsIY3QqL1Yi0xXxRf5i0RuHRB2rYZKaR0uX0rRyDR167Nlh5fv4Ee-u6dOj2sfNQEuDXEM7zJkrj63z-vlJl1pd3NJWIunLAj9tLLDo5dd8Bo-XHzrtDt19TfQiPtyazbRYzvcpgvrieE9ygyXogPdkmIiQnQsWBY_fQw_SCp4",
    rating: 4.8,
    reviews: 8
  },
  {
    id: 4,
    name: "Máy Khoan Động Lực Bosch 550W - Chuyên dụng",
    price: 1200000,
    originalPrice: 1350000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-W_lJf-Prbl3tSgzIXZow2cJ14ld-ncGj_RAYs6w2px_Hw9n3xCJeHppCE3txB6W8CljOtMFkZx1td14PMmUDmFB4SCJqgQ4np7XyYkSEh0vrjSxwCvqg9ooUS5nQZA55V2rFHOL6gDhJdCnqV7RH0S53NGztPwvgBDwJfVGY530xwb2Js3nmfaipq-VfTmzSBuRmZXLUlhZM-FmCVM8tjjTDoxGYkP72lFJ15ziIMfGx77Mj3r3rR3XewCdRJDKrvm0AJFYdHSQ",
    rating: 5,
    reviews: 210,
    discount: 10
  }
];

export const CATEGORIES: Category[] = [
  { id: 1, name: "Dây & Cáp điện", icon: "cable" },
  { id: 2, name: "Ống nước & Phụ kiện", icon: "water_drop" },
  { id: 3, name: "Thiết bị chiếu sáng", icon: "lightbulb" },
  { id: 4, name: "Máy & Dụng cụ", icon: "construction" }
];

export const FEATURES: Feature[] = [
  { id: 1, title: "Giao hàng nhanh", description: "Trong 24 giờ", icon: "local_shipping" },
  { id: 2, title: "Chính hãng", description: "Cam kết 100%", icon: "verified_user" },
  { id: 3, title: "Hỗ trợ tận tình", description: "Tư vấn kỹ thuật", icon: "support_agent" },
  { id: 4, title: "Thanh toán linh hoạt", description: "COD & Chuyển khoản", icon: "payments" }
];

export const MENU_ITEMS = [
  "Tất cả",
  "Điện dân dụng",
  "Vật tư nước",
  "Thiết bị chiếu sáng",
  "Dụng cụ cầm tay",
  "Thương hiệu"
];