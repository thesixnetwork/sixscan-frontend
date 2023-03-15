import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/utils/ENV";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      `${ENV.API_URL}/cosmos/base/tendermint/v1beta1/blocks/latest`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching status" });
  }
}
