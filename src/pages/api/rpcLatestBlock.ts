import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/libs/utils/ENV";
import { getLatestBlock } from "@/service/block";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const latestBlock = await getLatestBlock();
    res.status(200).json(latestBlock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}
