import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertNewsletterSubscriptionSchema,
  insertContactMessageSchema,
  insertProgramSchema,
  insertBlogPostSchema,
  insertSiteConfigSchema,
  insertDonationSchema,
  insertValueSchema,
  insertStaffSchema,
  insertProjectSchema,
  insertImpactStatSchema,
  insertPartnerSchema,
  insertStorySchema,
  insertTrusteeSchema,
  insertEventSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(validatedData);
      res.json({ success: true, subscription });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(400).json({ message: error.message || "Failed to subscribe" });
    }
  });

  app.get("/api/newsletter", async (_req, res) => {
    try {
      const subs = await storage.getAllNewsletterSubscriptions();
      res.json(subs);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch subscriptions" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to send message" });
    }
  });

  app.get("/api/contact-messages", async (_req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch messages" });
    }
  });

  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch blog posts" });
    }
  });

  app.get("/api/programs", async (_req, res) => {
    try {
      const programs = await storage.getAllPrograms();
      res.json(programs);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch programs" });
    }
  });

  app.get("/api/stories", async (_req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch stories" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.json(story);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create story" });
    }
  });

  app.patch("/api/stories/:id", async (req, res) => {
    try {
      const validatedData = insertStorySchema.partial().parse(req.body);
      const story = await storage.updateStory(req.params.id, validatedData);
      res.json(story);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update story" });
    }
  });

  app.delete("/api/stories/:id", async (req, res) => {
    try {
      await storage.deleteStory(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete story" });
    }
  });

  // Donations
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(validatedData);
      res.json(donation);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to process donation" });
    }
  });

  app.get("/api/donations", async (_req, res) => {
    try {
      const donations = await storage.getAllDonations();
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch donations" });
    }
  });

  // Programs CRUD
  app.post("/api/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.json(program);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create program" });
    }
  });

  app.patch("/api/programs/:id", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(req.params.id, validatedData);
      res.json(program);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update program" });
    }
  });

  app.delete("/api/programs/:id", async (req, res) => {
    try {
      await storage.deleteProgram(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete program" });
    }
  });

  // Blog CRUD
  app.post("/api/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create blog post" });
    }
  });

  app.patch("/api/blog/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete blog post" });
    }
  });

  // Contact Delete
  app.delete("/api/contact/:id", async (req, res) => {
    try {
      await storage.deleteContactMessage(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete message" });
    }
  });

  // Site Config
  app.get("/api/site-config", async (_req, res) => {
    try {
      const config = await storage.getSiteConfig();
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch site config" });
    }
  });

  app.patch("/api/site-config", async (req, res) => {
    try {
      const validatedData = insertSiteConfigSchema.partial().parse(req.body);
      const config = await storage.updateSiteConfig(validatedData);
      res.json(config);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update site config" });
    }
  });

  // Values CRUD
  app.get("/api/values", async (_req, res) => {
    try {
      const values = await storage.getAllValues();
      res.json(values);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch values" });
    }
  });

  app.post("/api/values", async (req, res) => {
    try {
      const validatedData = insertValueSchema.parse(req.body);
      const value = await storage.createValue(validatedData);
      res.json(value);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create value" });
    }
  });

  app.patch("/api/values/:id", async (req, res) => {
    try {
      const validatedData = insertValueSchema.partial().parse(req.body);
      const value = await storage.updateValue(req.params.id, validatedData);
      res.json(value);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update value" });
    }
  });

  app.delete("/api/values/:id", async (req, res) => {
    try {
      await storage.deleteValue(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete value" });
    }
  });

  // Staff CRUD
  app.get("/api/staff", async (_req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const validatedData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(validatedData);
      res.json(staff);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create staff member" });
    }
  });

  app.patch("/api/staff/:id", async (req, res) => {
    try {
      const validatedData = insertStaffSchema.partial().parse(req.body);
      const staff = await storage.updateStaff(req.params.id, validatedData);
      res.json(staff);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update staff member" });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      await storage.deleteStaff(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete staff member" });
    }
  });

  // Projects CRUD
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      res.json(project);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete project" });
    }
  });

  // Impact Stats CRUD
  app.get("/api/impact-stats", async (_req, res) => {
    try {
      const stats = await storage.getAllImpactStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch impact stats" });
    }
  });

  app.post("/api/impact-stats", async (req, res) => {
    try {
      const validatedData = insertImpactStatSchema.parse(req.body);
      const stat = await storage.createImpactStat(validatedData);
      res.json(stat);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create impact stat" });
    }
  });

  app.patch("/api/impact-stats/:id", async (req, res) => {
    try {
      const validatedData = insertImpactStatSchema.partial().parse(req.body);
      const stat = await storage.updateImpactStat(req.params.id, validatedData);
      res.json(stat);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update impact stat" });
    }
  });

  app.delete("/api/impact-stats/:id", async (req, res) => {
    try {
      await storage.deleteImpactStat(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete impact stat" });
    }
  });

  // Partners CRUD
  app.get("/api/partners", async (_req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch partners" });
    }
  });

  app.post("/api/partners", async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(validatedData);
      res.json(partner);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create partner" });
    }
  });

  app.patch("/api/partners/:id", async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.partial().parse(req.body);
      const partner = await storage.updatePartner(req.params.id, validatedData);
      res.json(partner);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update partner" });
    }
  });

  app.delete("/api/partners/:id", async (req, res) => {
    try {
      await storage.deletePartner(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete partner" });
    }
  });

  // Trustees CRUD
  app.get("/api/trustees", async (_req, res) => {
    try {
      const trustees = await storage.getAllTrustees();
      res.json(trustees);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch trustees" });
    }
  });

  app.post("/api/trustees", async (req, res) => {
    try {
      const validatedData = insertTrusteeSchema.parse(req.body);
      const trustee = await storage.createTrustee(validatedData);
      res.json(trustee);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create trustee" });
    }
  });

  app.patch("/api/trustees/:id", async (req, res) => {
    try {
      const validatedData = insertTrusteeSchema.partial().parse(req.body);
      const trustee = await storage.updateTrustee(req.params.id, validatedData);
      res.json(trustee);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update trustee" });
    }
  });

  app.delete("/api/trustees/:id", async (req, res) => {
    try {
      await storage.deleteTrustee(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete trustee" });
    }
  });

  // Events CRUD
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      // Handle date string to Date object conversion if necessary (Zod handles ISO strings usually, but checks might fail if raw JSON is sent)
      // Actually Zod coerce can handle it, or we expect ISO strings.
      // Drizzle insert schema expects Date object for timestamp. Zod might need coerce.
      // However, createInsertSchema usually expects strict types.
      // Let's rely on JSON body parser -> string -> new Date(string) in strict schema?
      // Actually `insertEventSchema` on the backend expects whatever the DB column expects or Date.
      // When receiving JSON, dates are strings. createInsertSchema for timestamp usually creates a ZodDate.
      // ZodDate expects a Date object, not a string. So we might need to preprocess.
      // But let's try standard parsing first. If it fails, we add preprocess.

      const body = { ...req.body };
      if (body.date) body.date = new Date(body.date);

      const validatedData = insertEventSchema.parse(body);
      const event = await storage.createEvent(validatedData);
      res.json(event);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to create event" });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const body = { ...req.body };
      if (body.date) body.date = new Date(body.date);

      const validatedData = insertEventSchema.partial().parse(body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      res.json(event);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message || "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete event" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
