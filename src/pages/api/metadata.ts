import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/libs/utils/ENV";
import { getNftCollectionByClient } from "@/service/nftmngr/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schemaCode = req.query.schemaCode as string;
  const isPageNumber = req.query.isPage as string;
  const pasgSize = req.query.pasgSize as string;
  try {
    const metadata = await getNftCollectionByClient(
      schemaCode,
      isPageNumber,
      pasgSize
    );
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}
