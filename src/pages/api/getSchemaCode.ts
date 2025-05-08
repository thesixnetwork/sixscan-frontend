import { NextApiRequest, NextApiResponse } from "next";
import { getSchemaByCodeAddr2 } from "@/service/nftmngr/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.query.input as string;
  try {
    const SchemaCode = await getSchemaByCodeAddr2(input);
    res.status(200).json(SchemaCode);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}
