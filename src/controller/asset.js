import prisma from "../utils/prisma.js";

export const createAssets = async (req, res) => {
  try {
    const { symbol, name, type } = req.body;
    if (!symbol || !name || !type) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const asset = await prisma.asset.create({
      data: {
        symbol,
        name,
        type,
      },
    });

    res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (error) {
    if (error === "p2002") {
      return res.status(400).json({ message: "symbol already exists" });
    }
    res.status(500).json({ message: "server error" });
  }
};
export const getAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json({ assets });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
