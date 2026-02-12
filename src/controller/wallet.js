import prisma from "../utils/prisma.js";

export const createWallets = async (req, res) => {
  try {
    const { assetId } = req.body;

    // Check 1 user = 1 wallet per asset
    const existing = await prisma.wallet.findUnique({
      where: {
        userId_assetId: {
          userId: req.user.id,
          assetId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Wallet already exists" });
    }

    const wallet = await prisma.wallet.create({
      data: {
        userId: req.user.id,
        assetId,
        balance: 0,
      },
    });

    res.status(201).json({ id: wallet.id, balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWallets = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.user.id },
      include: {
        asset: {
          select: { id: true, symbol: true, name: true },
        },
      },
    });

    res.json({ wallets });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
