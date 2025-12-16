import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  // Extended details
  duration: text("duration"),
  beneficiaries: text("beneficiaries"),
  partners: text("partners"),
  outcomes: text("outcomes"),
});

export const siteConfig = pgTable("site_config", {
  id: integer("id").primaryKey().default(1), // Single row table
  email: text("email").notNull().default("inquiries@techxplorers.in"),
  phone: text("phone").notNull().default("+91 85220 90765"),
  address: text("address").notNull().default("Maruthi Nagar 3rd cross, Near Panda Mini mart, Anantapur, 515001"),
  workingHours: text("working_hours").notNull().default("Monday – Friday, 9:00 AM – 6:00 PM IST"),
  // Contact Page Headings
  contactHeroTitle: text("contact_hero_title").notNull().default("Get in Touch"),
  contactHeroSubtitle: text("contact_hero_subtitle").notNull().default("Have questions or want to get involved? We'd love to hear from you."),
  contactFormTitle: text("contact_form_title").notNull().default("Send us a message"),
  contactFormSubtitle: text("contact_form_subtitle").notNull().default("Fill out the form below and we'll get back to you within 24 hours."),
  // About Page
  aboutHeroTitle: text("about_hero_title").notNull().default("About TGF"),
  aboutHeroSubtitle: text("about_hero_subtitle").notNull().default("Community Advocacy for Gender and Development"),
  missionTitle: text("mission_title").notNull().default("Our Mission"),
  missionDescription: text("mission_description").notNull().default("To empower African communities through sustainable development programs that promote gender equality, youth development, and economic empowerment. We work alongside local communities to create lasting change that transforms lives and builds resilient societies."),
  visionTitle: text("vision_title").notNull().default("Our Vision"),
  visionDescription: text("vision_description").notNull().default("A future where every community in Africa has equal access to opportunities, resources, and the power to shape their own development. We envision thriving communities where gender equality is the norm, youth are empowered to lead, and sustainable development is a reality."),
  approachTitle: text("approach_title").notNull().default("Our Approach"),
  approachDescription: text("approach_description").notNull().default("We believe in community-led development. Our approach centers on listening to the voices of those we serve, partnering with local leaders, and implementing programs that address the root causes of inequality and poverty. Through capacity building, advocacy, and direct service delivery, we create sustainable impact that extends beyond our immediate interventions."),
  valuesTitle: text("values_title").notNull().default("Our Values"),
  valuesDescription: text("values_description").notNull().default("The principles that guide our work and define who we are as an organization."),
  teamTitle: text("team_title").notNull().default("Meet Our Team"),
  teamDescription: text("team_description").notNull().default("Dedicated professionals committed to creating sustainable change in communities across Africa."),
});

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  quote: text("quote").notNull(),
  image: text("image").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  readTime: integer("read_time").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  email: text("email"),
  linkedin: text("linkedin"),
  instagram: text("instagram"),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* -------------------- NEW DYNAMIC CONTENT -------------------- */

export const heroSlides = pgTable("hero_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  image: text("image").notNull(),
  programPath: text("program_path").notNull(),
  order: integer("order").notNull().default(0),
});

export const impactStats = pgTable("impact_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  value: integer("value").notNull(),
  suffix: text("suffix").notNull(),
  icon: text("icon").notNull(), // Lucide icon name
  order: integer("order").notNull().default(0),
});

export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  category: text("category").notNull(), // Funding, Implementation, Community
  website: text("website"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  // Stats fields
  duration: text("duration").notNull(),
  beneficiaries: text("beneficiaries").notNull(),
  partners: text("partners").notNull(),
  outcomes: text("outcomes").notNull(),
});

export const values = pgTable("values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

/* -------------------- TRUSTEES -------------------- */

export const trustees = pgTable("trustees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  category: text("category").notNull(), // "Board of Trustees", "Advisory Board", etc.
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  linkedin: text("linkedin"),
});

/* -------------------- EVENTS -------------------- */

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
});

/* -------------------- DONATIONS -------------------- */

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: integer("amount").notNull(),
  donorName: text("donor_name"),
  donorEmail: text("donor_email").notNull(),
  // program here is stored as text, but we restrict allowed values in the Zod schema
  program: text("program").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* -------------------- INSERT SCHEMAS -------------------- */

export const insertProgramSchema = createInsertSchema(programs).omit({ id: true });
export const insertStorySchema = createInsertSchema(stories).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, publishedAt: true });
export const insertStaffSchema = createInsertSchema(staff).omit({ id: true });
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions)
  .omit({ id: true, subscribedAt: true })
  .extend({
    email: z.string().email("Please enter a valid email address"),
  });
export const insertContactMessageSchema = createInsertSchema(contactMessages)
  .omit({ id: true, createdAt: true })
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  });

export const insertDonationSchema = createInsertSchema(donations)
  .omit({ id: true, createdAt: true })
  .extend({
    amount: z.number().min(1, "Donation amount must be at least ₹1"),
    donorEmail: z.string().email("Please enter a valid email address"),
    donorName: z.string().optional(),
    program: z.enum(["general", "education", "nutrition", "healthcare"]),
  });

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({ id: true });
export const insertImpactStatSchema = createInsertSchema(impactStats).omit({ id: true });
export const insertPartnerSchema = createInsertSchema(partners).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertValueSchema = createInsertSchema(values).omit({ id: true });
export const insertSiteConfigSchema = createInsertSchema(siteConfig);

export const insertTrusteeSchema = createInsertSchema(trustees).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });

/* -------------------- TYPES -------------------- */

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;

export type ImpactStat = typeof impactStats.$inferSelect;
export type InsertImpactStat = z.infer<typeof insertImpactStatSchema>;

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Value = typeof values.$inferSelect;
export type InsertValue = z.infer<typeof insertValueSchema>;

export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;

export type Trustee = typeof trustees.$inferSelect;
export type InsertTrustee = z.infer<typeof insertTrusteeSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
