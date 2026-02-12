import prisma from "../utils/prisma.js";

export const createTrade = async (req, res) => {
  try {
    // mode: FIAT, CRYPTO
    const { buyOrderId, sellOrderId, assetId, fiatId, value, mode } = req.body;

    const tradeResult = await prisma.$transaction(async (tx) => {
      const buyOrder = await tx.order.findUnique({
        where: { id: parseInt(buyOrderId) },
      });
      const sellOrder = await tx.order.findUnique({
        where: { id: parseInt(sellOrderId) },
      });

      if (!buyOrder || !sellOrder) throw new Error("Order not found");
      if (buyOrder.userId === sellOrder.userId)
        throw new Error("Cannot trade with yourself");

      const tradePrice = parseFloat(sellOrder.price);
      let tradeAmount;
      let totalPrice;

      if (mode === "FIAT") {
        const inputFiat = parseFloat(value);
        const maxFiat = parseFloat(sellOrder.amount) * tradePrice;
        totalPrice = Math.min(inputFiat, maxFiat);
        tradeAmount = totalPrice / tradePrice;
      } else {
        const inputAmount = parseFloat(value);
        const maxAmount = parseFloat(sellOrder.amount);
        tradeAmount = Math.min(inputAmount, maxAmount);
        totalPrice = tradeAmount * tradePrice;
      }

      // proceed to check the buyer's wallet balance

      // seller have enough coins to sell?
      if (parseFloat(sellOrder.amount) < tradeAmount) {
        throw new Error("Order has insufficient crypto remaining");
      }

      // buyer have enough balance to pay?
      const buyerFiatWallet = await tx.wallet.findUnique({
        where: {
          userId_assetId: {
            userId: buyOrder.userId,
            assetId: parseInt(fiatId),
          },
        },
      });
      if (!buyerFiatWallet || buyerFiatWallet.balance < totalPrice) {
        throw new Error("Your fiat balance is insufficient");
      }

      // seller actually have the coins in their wallet?
      const sellerCryptoWallet = await tx.wallet.findUnique({
        where: {
          userId_assetId: {
            userId: sellOrder.userId,
            assetId: parseInt(assetId),
          },
        },
      });
      if (!sellerCryptoWallet || sellerCryptoWallet.balance < tradeAmount) {
        throw new Error("Seller has insufficient crypto in wallet");
      }

      // Asset Exchange
      // buyer -> Transfer to the seller
      await tx.wallet.update({
        where: {
          userId_assetId: {
            userId: buyOrder.userId,
            assetId: parseInt(fiatId),
          },
        },
        data: { balance: { decrement: totalPrice } },
      });
      await tx.wallet.update({
        where: {
          userId_assetId: {
            userId: sellOrder.userId,
            assetId: parseInt(fiatId),
          },
        },
        data: { balance: { increment: totalPrice } },
      });

      //  Deduct coins  seller -> Transfer to  buyer
      await tx.wallet.update({
        where: {
          userId_assetId: {
            userId: sellOrder.userId,
            assetId: parseInt(assetId),
          },
        },
        data: { balance: { decrement: tradeAmount } },
      });
      await tx.wallet.update({
        where: {
          userId_assetId: {
            userId: buyOrder.userId,
            assetId: parseInt(assetId),
          },
        },
        data: { balance: { increment: tradeAmount } },
      });

      // Record & Update Order
      const trade = await tx.trade.create({
        data: {
          orderId: sellOrder.id,
          buyerId: buyOrder.userId,
          sellerId: sellOrder.userId,
          price: tradePrice,
          amount: tradeAmount,
        },
      });

      const updateOrder = async (orderId, subAmount) => {
        const updated = await tx.order.update({
          where: { id: orderId },
          data: { amount: { decrement: subAmount } },
        });
        if (updated.amount <= 0.00000001) {
          await tx.order.update({
            where: { id: orderId },
            data: { status: "filled", amount: 0 },
          });
        }
      };

      await updateOrder(buyOrder.id, tradeAmount);
      await updateOrder(sellOrder.id, tradeAmount);

      return trade;
    });

    res
      .status(201)
      .json({ message: "Trade Successful", tradeId: tradeResult.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrade = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);

    const trades = await prisma.trade.findMany({
      where: {
        OR: [
          { buyerId: userId }, // buyer
          { sellerId: userId }, // seller
        ],
      },
      include: {
        order: {
          include: {
            asset: {
              select: { symbol: true, name: true },
            },

            user: {
              select: { username: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ trades });
  } catch (error) {
    console.error("Get Trade Error:", error);
    res.status(500).json({ message: "server error" });
  }
};
