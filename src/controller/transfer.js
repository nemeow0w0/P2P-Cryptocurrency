import prisma from "../utils/prisma.js";

export const transferAsset = async (req, res) => {
  try {
    const { assetId, amount, type, receiverAddress, externalAddress } =
      req.body;
    const senderId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: {
          userId_assetId: { userId: senderId, assetId: parseInt(assetId) },
        },
      });

      if (!senderWallet || senderWallet.balance < amount) {
        throw new Error("Insufficient wallet balance");
      }

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } },
      });

      let receiverId = null;

      if (type === "INTERNAL") {
        const receiverWallet = await tx.wallet.findUnique({
          where: { walletAddress: receiverAddress },
        });
        if (!receiverWallet) throw new Error("walletaddress not found");
        receiverId = receiverWallet.userId;

        await tx.wallet.update({
          where: { id: receiverWallet.id },
          data: { balance: { increment: amount } },
        });
      }

      return await tx.transfer.create({
        data: {
          senderId,
          receiverId,
          assetId: parseInt(assetId),
          amount,
          type,
          externalAddress: type === "EXTERNAL" ? externalAddress : null,
        },
      });
    });
    res.json({ message: "Transfer successful", data: result });
  } catch (error) {
    res.status(500).json({ message: "Transaction failed: " + error.message });
  }
};

export const getTransferHistory = async (req, res) => {
  try {
    const transfers = await prisma.transfer.findMany({
      where: {
        OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      include: { asset: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: "ดึงประวัติการโอนไม่สำเร็จ" });
  }
};
