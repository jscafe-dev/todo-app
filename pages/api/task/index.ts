import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// Define the API route function
async function handler(req: NextApiRequest, res: NextApiResponse) {
 if (req.method === "POST") {
    try {
      const { title, description, status, email } = req.body;
      console.log("create post", title, description, status, email);
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!user) {
        res.status(500).json({ error: "Invalid user" });
        return;
      }
      await prisma.task.create({
        data: {
          title,
          description,
          status,
          userId: user.id,
        },
      });
      const results = await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      res.status(201).json({ tasks: results });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error creating task" });
    }
  }
}

export default handler;
