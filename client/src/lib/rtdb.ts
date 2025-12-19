import { db } from "../firebase";
import { ref, set, push, get, child, update, remove } from "firebase/database";
import type {
    InsertContactMessage,
    InsertNewsletterSubscription,
    InsertDonation,
    BlogPost,
    Program,
    Story,
    ImpactStat,
    Partner,
    Trustee,
    Event,
    Value,
    Project,
    Staff,
    ContactMessage,
    NewsletterSubscription,
    Donation
} from "@shared/schema";

// Generic helper to get list from RTDB
async function getList<T>(path: string): Promise<T[]> {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
    } else {
        return [];
    }
}

// Generic Create
async function createItem<T>(path: string, item: any): Promise<T> {
    const itemRef = push(ref(db, path));
    const newItem = { ...item, id: itemRef.key };
    await set(itemRef, newItem);
    return newItem;
}

// Generic Update
async function updateItem<T>(path: string, id: string, data: Partial<T>): Promise<void> {
    const itemRef = ref(db, `${path}/${id}`);
    await update(itemRef, data);
}

// Generic Delete
async function deleteItem(path: string, id: string): Promise<void> {
    const itemRef = ref(db, `${path}/${id}`);
    await remove(itemRef);
}

// Contact
export async function getContactMessages(): Promise<ContactMessage[]> {
    return getList<ContactMessage>('contact_messages');
}
export async function createContactMessage(message: InsertContactMessage) {
    return createItem<ContactMessage>('contact_messages', { ...message, createdAt: new Date().toISOString() });
}

export async function deleteContactMessage(id: string) {
    return deleteItem('contact_messages', id);
}

// Newsletter
export async function getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return getList<NewsletterSubscription>('newsletter_subscriptions');
}
export async function createNewsletterSubscription(subscription: InsertNewsletterSubscription) {
    // Check if email exists? RTDB doesn't invoke constraints. 
    // For now simplistic push.
    return createItem<NewsletterSubscription>('newsletter_subscriptions', { ...subscription, subscribedAt: new Date().toISOString() });
}

// Donations
export async function getDonations(): Promise<Donation[]> {
    return getList<Donation>('donations');
}
export async function createDonation(donation: InsertDonation) {
    return createItem<Donation>('donations', { ...donation, createdAt: new Date().toISOString() });
}

// Blog
export async function getBlogPosts(): Promise<BlogPost[]> {
    return getList<BlogPost>('blog_posts');
}
export async function createBlogPost(post: any) { // InsertBlogPost but with image separate
    return createItem<BlogPost>('blog_posts', post);
}
export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
    return updateItem<BlogPost>('blog_posts', id, post);
}
export async function deleteBlogPost(id: string) {
    return deleteItem('blog_posts', id);
}

// Programs
export async function getPrograms(): Promise<Program[]> {
    return getList<Program>('programs');
}
export async function createProgram(program: any) {
    return createItem<Program>('programs', program);
}
export async function updateProgram(id: string, program: Partial<Program>) {
    return updateItem<Program>('programs', id, program);
}
export async function deleteProgram(id: string) {
    return deleteItem('programs', id);
}

// Projects
export async function getProjects(): Promise<Project[]> {
    return getList<Project>('projects');
}
export async function createProject(project: any) {
    return createItem<Project>('projects', project);
}
export async function updateProject(id: string, project: Partial<Project>) {
    return updateItem<Project>('projects', id, project);
}
export async function deleteProject(id: string) {
    return deleteItem('projects', id);
}

// Stories
export async function getStories(): Promise<Story[]> {
    return getList<Story>('stories');
}
export async function createStory(story: any) {
    return createItem<Story>('stories', story);
}
export async function updateStory(id: string, story: Partial<Story>) {
    return updateItem<Story>('stories', id, story);
}
export async function deleteStory(id: string) {
    return deleteItem('stories', id);
}

// Team (Staff)
export async function getStaff(): Promise<Staff[]> {
    return getList<Staff>('staff');
}
export async function getTeam(): Promise<Staff[]> {
    return getList<Staff>('staff');
}
export async function createTeamMember(member: any) {
    return createItem<Staff>('staff', member);
}
export async function updateTeamMember(id: string, member: Partial<Staff>) {
    return updateItem<Staff>('staff', id, member);
}
export async function deleteTeamMember(id: string) {
    return deleteItem('staff', id);
}

// Events
export async function getEvents(): Promise<Event[]> {
    return getList<Event>('events');
}
export async function createEvent(event: any) {
    return createItem<Event>('events', event);
}
export async function updateEvent(id: string, event: Partial<Event>) {
    return updateItem<Event>('events', id, event);
}
export async function deleteEvent(id: string) {
    return deleteItem('events', id);
}

// Partners
export async function getPartners(): Promise<Partner[]> {
    return getList<Partner>('partners');
}
export async function createPartner(partner: any) {
    return createItem<Partner>('partners', partner);
}
export async function updatePartner(id: string, partner: Partial<Partner>) {
    return updateItem<Partner>('partners', id, partner);
}
export async function deletePartner(id: string) {
    return deleteItem('partners', id);
}

// Trustees
export async function getTrustees(): Promise<Trustee[]> {
    return getList<Trustee>('trustees');
}
export async function createTrustee(trustee: any) {
    return createItem<Trustee>('trustees', trustee);
}
export async function updateTrustee(id: string, trustee: Partial<Trustee>) {
    return updateItem<Trustee>('trustees', id, trustee);
}
export async function deleteTrustee(id: string) {
    return deleteItem('trustees', id);
}

// Impact Stats
export async function getImpactStats(): Promise<ImpactStat[]> {
    return getList<ImpactStat>('impact_stats');
}
export async function createImpactStat(stat: any) {
    return createItem<ImpactStat>('impact_stats', stat);
}
export async function updateImpactStat(id: string, stat: Partial<ImpactStat>) {
    return updateItem<ImpactStat>('impact_stats', id, stat);
}
export async function deleteImpactStat(id: string) {
    return deleteItem('impact_stats', id);
}


// Site Config
export async function getSiteConfig(): Promise<any> {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'site_config'));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}
export async function updateSiteConfig(config: any) {
    const dbRef = ref(db, 'site_config');
    await update(dbRef, config);
}


// Seed function to populate DB initially
export async function seedDatabase(data: any) {
    await set(ref(db), data);
}
