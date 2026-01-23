import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS = [
  // MPE Products
  {
    name: 'Bóng đèn LED Bulb MPE 30W LBD-30W',
    price: 155000,
    originalPrice: 185000,
    image: 'https://placehold.co/400x400?text=Den+MPE+30W',
    rating: 5,
    reviewCount: 42,
    discount: 16,
    unit: 'Cái',
    categoryId: 3
  },
  {
    name: 'Bóng đèn LED Bulb MPE 40W LBD-40W',
    price: 215000,
    originalPrice: 250000,
    image: 'https://placehold.co/400x400?text=Den+MPE+40W',
    rating: 4.5,
    reviewCount: 28,
    discount: 14,
    unit: 'Cái',
    categoryId: 3
  },
  {
    name: 'Đèn LED Downlight MPE Âm Trần 9W RPL-9T',
    price: 110000,
    originalPrice: 145000,
    image: 'https://placehold.co/400x400?text=Den+Downlight+9W',
    rating: 5,
    reviewCount: 56,
    discount: 24,
    unit: 'Cái',
    categoryId: 3
  },
  {
    name: 'Đèn LED Panel MPE Vuông 40W FPL-6060T',
    price: 850000,
    originalPrice: 1100000,
    image: 'https://placehold.co/400x400?text=Den+Panel+40W',
    rating: 5,
    reviewCount: 12,
    discount: 23,
    unit: 'Cái',
    categoryId: 3
  },
  {
    name: 'Bóng Đèn LED Tuýp Thủy Tinh MPE 22W GT8-120T',
    price: 85000,
    originalPrice: 95000,
    image: 'https://placehold.co/400x400?text=Den+Tuyp+22W',
    rating: 4.5,
    reviewCount: 89,
    discount: 10,
    unit: 'Cái',
    categoryId: 3
  },
  {
    name: 'Đèn Pha LED MPE Series FLD2 50W',
    price: 550000,
    originalPrice: 680000,
    image: 'https://placehold.co/400x400?text=Den+Pha+50W',
    rating: 5,
    reviewCount: 15,
    discount: 19,
    unit: 'Cái',
    categoryId: 3
  },
  {
    name: 'Đèn Bán Nguyệt MPE 40W BN-40T',
    price: 240000,
    originalPrice: 290000,
    image: 'https://placehold.co/400x400?text=Den+Ban+Nguyet',
    rating: 4,
    reviewCount: 22,
    discount: 17,
    unit: 'Cái',
    categoryId: 3
  },
  // Nhua Binh Minh
  {
    name: 'Ống Nhựa PVC-u Bình Minh D21 (Dày 1.6mm)',
    price: 10500,
    originalPrice: 12000,
    image: 'https://placehold.co/400x400?text=Ong+Nhua+D21',
    rating: 5,
    reviewCount: 120,
    discount: 12,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Ống Nhựa PVC-u Bình Minh D27 (Dày 1.8mm)',
    price: 15000,
    originalPrice: 17000,
    image: 'https://placehold.co/400x400?text=Ong+Nhua+D27',
    rating: 5,
    reviewCount: 95,
    discount: 11,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Ống Nhựa PVC-u Bình Minh D90 (Dày 2.9mm)',
    price: 110000,
    originalPrice: 125000,
    image: 'https://placehold.co/400x400?text=Ong+Nhua+D90',
    rating: 5,
    reviewCount: 45,
    discount: 12,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Co 90 Độ Nhựa Bình Minh D27',
    price: 5000,
    image: 'https://placehold.co/400x400?text=Co+90+Do',
    rating: 5,
    reviewCount: 200,
    unit: 'Cái',
    categoryId: 2
  },
  {
    name: 'Tê Đều Nhựa Bình Minh D21',
    price: 4000,
    image: 'https://placehold.co/400x400?text=Te+Deu+D21',
    rating: 5,
    reviewCount: 180,
    unit: 'Cái',
    categoryId: 2
  },
  {
    name: 'Keo Dán Ống Nhựa Bình Minh 200g',
    price: 35000,
    image: 'https://placehold.co/400x400?text=Keo+Dan',
    rating: 4.5,
    reviewCount: 60,
    unit: 'Lon',
    categoryId: 2
  },
  // Dat Hoa Products
  {
    name: 'Ống HDPE Đạt Hòa D50 PN10',
    price: 45000,
    originalPrice: 50000,
    image: 'https://placehold.co/400x400?text=Ong+HDPE+D50',
    rating: 4.5,
    reviewCount: 15,
    discount: 10,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Ống Cống Chịu Lực HDPE Đạt Hòa D300',
    price: 450000,
    originalPrice: 500000,
    image: 'https://placehold.co/400x400?text=Ong+Cong+HDPE',
    rating: 5,
    reviewCount: 8,
    discount: 10,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Ống uPVC Đạt Hòa D114 (Dày 3.2mm)',
    price: 125000,
    originalPrice: 140000,
    image: 'https://placehold.co/400x400?text=Ong+uPVC+D114',
    rating: 4,
    reviewCount: 20,
    discount: 11,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Phụ Kiện HDPE Đạt Hòa - Nối Thẳng D50',
    price: 65000,
    image: 'https://placehold.co/400x400?text=Noi+Thang+D50',
    rating: 4.5,
    reviewCount: 12,
    unit: 'Cái',
    categoryId: 2
  },
  {
    name: 'Van Cầu Nhựa uPVC Đạt Hòa D27',
    price: 25000,
    image: 'https://placehold.co/400x400?text=Van+Cau+D27',
    rating: 4,
    reviewCount: 45,
    unit: 'Cái',
    categoryId: 2
  },
  {
    name: 'Ống lưới dẻo PVC Đạt Hòa D16',
    price: 12000,
    image: 'https://placehold.co/400x400?text=Ong+Luoi+D16',
    rating: 5,
    reviewCount: 67,
    unit: 'Mét',
    categoryId: 2
  },
  {
    name: 'Máng Gene Luồn Dây Điện Vuông Đạt Hòa 24x14',
    price: 18000,
    image: 'https://placehold.co/400x400?text=Mang+Gene+24x14',
    rating: 4.5,
    reviewCount: 90,
    unit: 'Cây',
    categoryId: 1
  }
];

const CATEGORIES = [
  { id: 1, name: 'Điện dân dụng', icon: 'lightbulb' },
  { id: 2, name: 'Ống nước & Phụ kiện', icon: 'water_drop' },
  { id: 3, name: 'Thiết bị điện MPE', icon: 'bolt' },
  { id: 4, name: 'Dây cáp điện', icon: 'cable' },
  { id: 5, name: 'Công tắc & Ổ cắm', icon: 'toggle_on' },
  { id: 6, name: 'Đèn trang trí', icon: 'tungsten' },
  { id: 7, name: 'Quạt điện', icon: 'mode_fan' },
  { id: 8, name: 'Kim khí tổng hợp', icon: 'build' }
];

async function main() {
  console.log('Seeding database...');

  // Upsert Categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat
    });
  }

  // Create Products if empty
  const count = await prisma.product.count();
  if (count === 0) {
    console.log('No products found, seeding...');
    for (const p of PRODUCTS) {
      await prisma.product.create({ data: p });
    }
    console.log(`Seeded ${PRODUCTS.length} products.`);
  } else {
    console.log('Products already exist, skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
