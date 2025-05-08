import { NextApiRequest, NextApiResponse } from "next";
import { getNFTCollectionTrending } from "@/service/nftmngr/stats";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schemaCode = req.query.schemaCode as string;
  const pageNumber = req.query.pageNumber as string;
  const limit = req.query.limit as string;
  try {
    const ActionStat = await getNFTCollectionTrending(
      schemaCode,
      pageNumber,
      limit
    );
    res.status(200).json(ActionStat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}
