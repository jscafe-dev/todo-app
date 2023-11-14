import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// Define the API route function
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const {email} = req.query
      console.log("user email", email)
      if (!email || (Array.isArray(email))) {
        res.status(500).json({ error: "Invalid user" });
        return 
      }
      const user = await prisma.user.findUnique({where: {email}, select: {id: true}})
      if (!user) {
        res.status(500).json({ error: "Invalid user" });
        return
      }
      const results = await prisma.task.findMany({
        where: {userId: user.id},
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      return res.status(201).json(results);
    } catch (e) {
    
      res.status(500).json({ error: "Error finding tasks" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, description, status, email } = req.body;
      console.log("create post", title, description, status, email)
      const user = await prisma.user.findUnique({where: {email}, select: {id:true}})
      if (!user) {
        res.status(500).json({ error: "Invalid user" });
        return
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
        where: {userId: user.id},
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      res.status(201).json({ tasks: results });
    } catch (e) {
        console.log(e)
      res.status(500).json({ error: "Error creating task" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { title, description, status, id } = req.body;
      const updatedTask = await prisma.task.update({
        data: {
          title,
          description,
          status,
        },
        where: {
          id,
        },
      });
      res.status(200).json({ task: updatedTask });
    } catch (e) {
        res.status(500).json({ error: "Error updating task" });
    }
  } else if (req.method === "DELETE") {
    try {
        const { id } = req.body;
        const deletedTask = await prisma.task.delete({where: {id}})
        res.status(200).json({ task: deletedTask });
    } catch(e) {
        res.status(500).json({ error: "Error deleting task" });
    }
    }
}

export default handler;
