import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/libs/utils/ENV";
import { getLatestAction } from "@/service/nftmngr/txs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isPage = req.query.isPage as string;
  const isPageSize = req.query.isPageSize as string;
  try {
    const LatestAction = await getLatestAction(isPage, isPageSize);
    res.status(200).json(LatestAction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}
