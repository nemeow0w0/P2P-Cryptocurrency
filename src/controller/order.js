import prisma from "../utils/prisma.js";

export const createOrder = async (req, res) => {
  try {
    const { assetId, fiatId, side, price, amount } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        assetId: parseInt(assetId),
        fiatId: parseInt(fiatId),
        side,
        price,
        amount,
        status: "open",
      },
    });

    res.status(201).json({ id: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { side, assetId } = req.query;

    const where = {
      status: { in: ["open", "partially_filled"] },
    };

    if (side) where.side = side;
    if (assetId) where.assetId = parseInt(assetId);

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true },
        },
        asset: {
          select: { id: true, symbol: true, name: true },
        },
      },
      orderBy: { price: "desc" },
      take: 50,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateOrders = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { amount },
    });
    res.json({ message: "แก้ไขสำเร็จ", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const cancelOrders = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "cancelled" },
    });

    res.json({ message: "cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
