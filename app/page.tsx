"use client";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

type Product = {
  id: number;
  proName: string;
  proPrice: number;
  proQuantity: number;
  proDescription: string;
};

export default function Page() {
  // สร้าง state สำหรับเก็บรายการสินค้าที่ดึงมาจา DB ผ่าน API
  const [products, setProducts] = useState<Product[]>([]);

  // สร้าง state ใช้สำหรับเช็กการโหลดข้อมูลจาก API
  const [loading, setLoading] = useState<boolean>(true);

  // สร้าง state สำหรับเก็บข้อความ error
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลสินค้าจาก API ผ่าน useEffect
  useEffect(() => {
    async function fetchProducts() {
      try {
        // ดึงข้อมูลจาก API
        const data = await fetch("/api/products");
        // ตรวจสอบว่าดึงข้อมูลมาได้สำเร็จหรือไม่
        if (!data.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
        // กรณีไม่มีข้อผิดพลาดในการดึงข้อมูล ให้แปลงข้อมูลที่ได้จาก API เป็น JSON มาเป็น Object และเก็บใน state
        const products_data = await data.json();
        setProducts(products_data);
      } catch (error) {
        setError(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    // เรียกใช้ฟังก์ชันที่ไปดึงข้อมูล
    fetchProducts();
  }, []);

  // สร้างฟังก์ชันสำหรับลบข้อมูลสินค้าออกจาก DB ผ่าน API
  async function deleteProduct(id: number) {
    // ก่อนลบควรมี Confirm เพื่อให้ผู้ใช้ยืนยันการลบข้อมูล
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) {
      return;
    }
    try {
      // ลบข้อมูลสินค้าออกจาก DB ผ่าน API
      const data = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      // ตรวจสอบว่าลบข้อมูลสำเร็จหรือไม่
      if (!data.ok) {
        throw new Error("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
      // แสดงข้อความแจ้งเตือนว่าลบข้อมูลสำเร็จ
      alert("ลบข้อมูลสำเร็จ");
      // Update ตารางผ่าน state -> products
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      setError(`เกิดข้อผิดพลาดในการลบข้อมูล: ${error}`);
    }
  }
  return (
    <>
      {/* แสดงชื่อหน้าเพจ */}
      <div className="flex justify-center mt-10">
        <p className="text-2xl font-semibold">Show All Products</p>
      </div>

      {/* แสดงปุ่มเปืดไปหน้าเพิ่มสินค้า */}
      <div className="flex justify-end mr-25 mb-8 w-[75%] mx-auto">
        <Link
          href="/products/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          เพิ่มสินค้า
        </Link>
      </div>

      {/* แสดงรายการสินค้าในรูปแบบตาราง โดยแต่ละรายการจะมีลิงก์ไปหน้าแก้ไขสินค้า และปุ่มลบสินค้า */}
      {/* ก่อนแสดงตารางตรวจสอบว่าได้โหลดข้อมูลมาครบแล้วหรือยัง */}
      {loading ? (
        <p className="text-center">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="flex justify-center w-[75%] mx-auto">
          <table className="border border-gray-400 w-full">
            {/* หัวตาราง */}
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ชื่อสินค้า</th>
                <th className="border border-gray-300 p-2">ราคา</th>
                <th className="border border-gray-300 p-2">จำนวน</th>
                <th className="border border-gray-300 p-2">รายละเอียด</th>
                <th className="border border-gray-300 p-2"></th>
              </tr>
            </thead>
            {/* รายละเอียดสินค้าในตาราง */}
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">
                    {product.proName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.proPrice}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.proQuantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.proDescription}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {/* แก้ไขจะเป็นลิงก์ไปยังหน้าแก้ไขสินค้า */}
                    <Link href={`/products/${product.id}`}>แก้ไข</Link>|
                    {/*การลบจะเป็นปุ่มทำการลบข้อมูลสินค้าออกจาก DB ผ่าน API  */}
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2 cursor-pointer"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
