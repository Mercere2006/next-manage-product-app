import prisma from "@/lib/prisma";
// Handle การดึงข้อมูลแบบมีเงื่อนไข PK-id
// GET (Read)
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  // เอาข้อมูลที่ส่งเป็น path parameter มาเก็บในตัวแปร เพื่อเอาไปใช้ต่อไป
  const { id } = await params;

  // handle ข้อผิดพลาดที่อาจจะเกิดขึ้นในการทำงาน
  try {
    // ดึงข้อมูล เงื่อนไขคือ id
    const result = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    // ตรวจสอบผลลัพธ์ว่ามีข้อมูลหรือไม่
    if (!result) {
      return Response.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    // ดึงข้อมูลเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง client/user
    return Response.json(result, { status: 200 });
  } catch (error) {
    // เกิดข้อผิดพลาดในการดึงข้อมูล
    console.error("Failed for: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 },
    );
  }
}

// handle การแก้ไขข้อมูลแบบมีเงื่อนไข PK-id
// PUT (Update)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  // แตกข้อมูลที่ส่งมาจาก client ที่เป็น JSON ออกมาเป็น object
  const body = await request.json();

  // เอาข้อมูลที่ส่งเป็น path parameter มาเก็บในตัวแปร เพื่อเอาไปใช้ต่อไป
  const { id } = await params;

  // handle ข้อผิดพลาดที่อาจจะเกิดขึ้นในการทำงาน
  try {
    // แก้ไขข้อมูล เงื่อนไขคือ id
    const result = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        proName: body.proName,
        proPrice: body.proPrice,
        proQuantity: body.proQuantity,
        proDescription: body.proDescription,
      }
    });
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to update product: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
}

// handle การลบข้อมูลแบบมีเงื่อนไข PK-id
// DELETE (Delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  // เอาข้อมูลที่ส่งเป็น path parameter มาเก็บในตัวแปร เพื่อเอาไปใช้ต่อไป
  const { id } = await params;

  // handle ข้อผิดพลาดที่อาจจะเกิดขึ้นในการทำงาน
  try {
    // ลบข้อมูล เงื่อนไขคือ id
    const result = await prisma.product.delete({
      where: {
        id: Number(id),
      }
    });
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}