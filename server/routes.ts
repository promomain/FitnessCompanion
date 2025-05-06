import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/progress", async (req, res) => {
    try {
      // In a real app, we would get the user ID from the session
      // For now, just return mock data
      const streak = 3;
      const lastCompleted = "Ayer";
      
      res.json({ streak, lastCompleted });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el progreso" });
    }
  });

  app.post("/api/progress/complete", async (req, res) => {
    try {
      // In a real app, we would save the completion to the database
      // For now, just return success
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al guardar el progreso" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
