import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventsPage() {
    const { data: events, isLoading } = useQuery<Event[]>({
        queryKey: ["/api/events"],
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </main>
                <Footer />
            </div>
        );
    }

    const now = new Date();

    // Sort events: Upcoming (Ascending date), Past (Descending date)
    const upcomingEvents = events
        ?.filter((e) => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

    // "Current" events could be defined as today's events if needed, but usually incorporated in upcoming or separate.
    // For simplicity, upcoming includes today.

    const pastEvents = events
        ?.filter((e) => new Date(e.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />

            <main className="flex-1 pt-24">
                {/* Hero Section */}
                <section className="relative py-20 bg-primary/5">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6">
                                Events & Workshops
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Join us in our upcoming events to learn, connect, and contribute to our cause.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Upcoming Events */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-8 w-1 bg-primary rounded-full" />
                            <h2 className="font-heading font-bold text-3xl text-slate-900">
                                Upcoming Events
                            </h2>
                        </div>

                        {upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {upcomingEvents.map((event, index) => (
                                    <EventCard key={event.id} event={event} index={index} isUpcoming />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-lg">No upcoming events scheduled at the moment. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Past Events */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-8 w-1 bg-slate-400 rounded-full" />
                            <h2 className="font-heading font-bold text-3xl text-slate-600">
                                Past Events
                            </h2>
                        </div>

                        {pastEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pastEvents.map((event, index) => (
                                    <EventCard key={event.id} event={event} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500">No past events found.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function EventCard({ event, index, isUpcoming = false }: { event: Event; index: number; isUpcoming?: boolean }) {
    const eventDate = new Date(event.date);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <Card className={`overflow-hidden h-full flex flex-col ${isUpcoming ? 'shadow-lg border-primary/20' : 'shadow hover:shadow-md'}`}>
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {isUpcoming && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-white hover:bg-primary/90 text-sm py-1 px-3">
                                Upcoming
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="text-center px-4 py-2 bg-slate-100 rounded-lg min-w-[80px]">
                            <span className="block text-sm font-bold text-slate-500 uppercase tracking-wider">
                                {format(eventDate, "MMM")}
                            </span>
                            <span className="block text-3xl font-bold text-slate-900 leading-none mt-1">
                                {format(eventDate, "d")}
                            </span>
                        </div>
                        <h3 className="flex-1 font-heading font-bold text-xl leading-tight text-slate-900">
                            {event.title}
                        </h3>
                    </div>

                    <div className="space-y-3 mb-6 text-slate-600">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{format(eventDate, "EEEE, MMMM do, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{format(eventDate, "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-6 line-clamp-3">
                        {event.description}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
