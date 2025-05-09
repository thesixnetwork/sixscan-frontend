import { NextApiRequest, NextApiResponse } from "next";
import { uptime } from "@/service/staking";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await uptime();
    if (!data) {
      throw new Error("Failed to fetch uptime data");
    }

    res.status(200).json({
      validators: data.validators.data,
      latestBlockRes: data.latestBlock.data,
      blocks: data.blocks,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

