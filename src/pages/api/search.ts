import type { NextApiRequest, NextApiResponse } from "next";
// import fetch from 'node-fetch';

type ApiResponse = {
  results?: Array<{
    gifUrl: string;
    description: string;
  }>;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: "Missing searchTerm parameter." });
  }

  try {
    const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

    const giphyRes = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
        searchTerm as string
      )}&limit=4`
    );

    if (!giphyRes.ok) {
      throw new Error("GIPHY API request failed");
    }

    const giphyData = await giphyRes.json();

    const results = giphyData.data.map((gif: any) => ({
      gifUrl: gif.images.original.url,
      description: gif.title,
    }));

    res.status(200).json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search GIPHY." });
  }
}
