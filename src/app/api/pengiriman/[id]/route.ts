import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET":
        const pengiriman = await prisma.pengiriman.findUnique({
          where: { id: parseInt(id) },
        });
        if (!pengiriman) {
          return res.status(404).json({ message: "Data not found" });
        }
        return res.status(200).json(pengiriman);

      case "PUT":
        const updated = await prisma.pengiriman.update({
          where: { id: parseInt(id) },
          data: { ...req.body },
        });
        return res.status(200).json(updated);

      case "DELETE":
        await prisma.pengiriman.delete({
          where: { id: parseInt(id) },
        });
        return res.status(204).end();

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
}
