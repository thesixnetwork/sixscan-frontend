import { NextApiRequest, NextApiResponse } from "next";
import { getSIXPrice } from "@/service/sixprice";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenName = req.query.tokenName as string;
  try {
    const price = await getSIXPrice(tokenName);
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json({ message: "Error fetching six price" });
  }
}
