"use client";

import Link from "next/link";
import { useState, useEffect , type SubmitEvent} from "react";
import { useRouter , useParams  } from "next/navigation";

export default function Page() {
  // เอาข้อมูลที่ส่งมาเก็บในตัวแปร
  const { id } = useParams();

  // สร้าง state สำหรับเก็บข้อมูลสินค้า
  const [proName, setProName] = useState("");
  const [proPrice, setProPrice] = useState("");
  const [proQuantity, setProQuantity] = useState("");
  const [proDescription, setProDescription] = useState("");

  // สร้าง router สำหรับเปิดหน้าเพจ
  const router = useRouter();


  // สร้าง state สำหรับเก็บข้อความ error
  const [error, setError] = useState<string | null>(null);

  // สร้าง state ใช้สำหรับเช็กการบันทึกข้อมูลไปยัง API
  const [saving, setSaving] = useState<boolean>(false);

  // สร้าง state ใช้สำหรับเช็กการโหลดข้อมูลจาก API
  const [loading, setLoading] = useState<boolean>(true);

  // ดึงข้อมูลสินค้าตาม id ที่ส่งผ่าน path parameter
  useEffect(() => {
    // ฟังก์ชัน
    async function fetchProductById() {
      try{
        const data = await fetch(`/api/products/${id}`);
        if(!data.ok){
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
        // แปลงข้อมูลที่ได้จาก API เป็น JSON มาเป็น Object และเก็บใน state
        const product_data = await data.json();
        setProName(product_data.proName);
        setProPrice(product_data.proPrice);
        setProQuantity(product_data.proQuantity);
        setProDescription(product_data.proDescription);
      }catch(error){
        setError(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${error}`);
      }finally{
        setLoading(false);
      }
    }
    // เรียกใช้ฟังก์ชัน
    fetchProductById();
  }, [])

  // สร้างฟังก์ชันบันทึกการแก้ไขข้อมูล
  async function updateProduct(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Validate UI
    if (!proName || !proPrice || !proQuantity || !proDescription) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setSaving(true);

    // Validate ผ่านให้ทำการบันทึกข้อมูลลง DB ผ่าน API
    try {
      // แพ็คข้อมูลเป็น JSON แล้วส่งผ่าน API เพื่อไปบันทึกลง DB
      const data = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proName: proName.trim(),
          proPrice: Number(proPrice),
          proQuantity: Number(proQuantity),
          proDescription: proDescription.trim(),
        })
      })
      // ตรวจสอบว่าบันทึกข้อมูลสำเร็จหรือไม่
      if (!data.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูล");
      }
      // แสดงข้อความแจ้งเตือนว่าบันทึกข้อมูลสำเร็จ
      alert("บันทึกการแก้ไขข้อมูลสำเร็จ");
      // แล้วเปิดกลับไปหน้าสินค้าทั้งหมดโดยอัตโนมัติ
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูล");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* แสดงชื่อหน้าเพจ */}
      <div className="flex justify-center mt-10 mb-10">
        <p className="text-2xl font-bold">Edit Product</p>
      </div>

      {/* แสดงปุ่มเปิดกลับไปหน้าสินค้าทั้งหมด */}
      <div className="flex justify-end mr-15 mb-8 w-[75%] mx-auto">
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          กลับไปหน้าสินค้าทั้งหมด
        </Link>
      </div>

      {/*  แสดงฟอร์มสำหรับเพิ่มสินค้า */}
      <div className="flex w-[75%] mx-auto mb-8">
        <form className="w-full" onSubmit={updateProduct}>
          {/* ป้อนชื่อสินค้า */}
          <div className="mb-4 flex flex-col">
            <label className="block text-gray-700 font-bold mb-2">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2"
              value={proName}
              onChange={(e) => setProName(e.target.value)}
            />
          </div>

          {/* ป้อนราคาสินค้า */}
          <div className="mb-4 flex flex-col">
            <label className="block text-gray-700 font-bold mb-2">ราคา</label>
            <input
              type="number"
              className="border border-gray-300 p-2"
              value={proPrice}
              onChange={(e) => setProPrice(e.target.value)}
            />
          </div>

          {/* ป้อนจำนวนสินค้า */}
          <div className="mb-4 flex flex-col">
            <label className="block text-gray-700 font-bold mb-2">จำนวน</label>
            <input
              type="number"
              className="border border-gray-300 p-2"
              value={proQuantity}
              onChange={(e) => setProQuantity(e.target.value)}
            />
          </div>

          {/* ป้อนคำอธิบายสินค้า */}
          <div className="mb-4 flex flex-col">
            <label className="block text-gray-700 font-bold mb-2">
              คำอธิบาย
            </label>
            <textarea
              className="border border-gray-300 p-2"
              value={proDescription}
              onChange={(e) => setProDescription(e.target.value)}
            />
          </div>

          {/* ปุ่มสำหรับบันทึกข้อมูล */}
          <div className="flex justify-between gap-5">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded w-full cursor-pointer"
            >
              {saving ? "กำลังบันทึกแก้ไขข้อมูล..." : "บันทึกแก้ไขข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
  


