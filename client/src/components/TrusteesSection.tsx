import { useQuery } from "@tanstack/react-query";
import { Trustee } from "@shared/schema";
import { Loader2, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export default function TrusteesSection() {
    const { data: trustees, isLoading } = useQuery<Trustee[]>({
        queryKey: ["/api/trustees"],
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Group by category
    const groupedTrustees = trustees?.reduce((acc, trustee) => {
        const category = trustee.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(trustee);
        return acc;
    }, {} as Record<string, Trustee[]>) || {};

    return (
        <section id="trustees" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                {Object.entries(groupedTrustees).map(([category, items], catIndex) => (
                    <div key={category} className="mb-16 last:mb-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
                                {category}
                            </h2>
                            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map((trustee, index) => (
                                <motion.div
                                    key={trustee.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={trustee.image}
                                            alt={trustee.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-heading font-semibold text-xl text-slate-900">
                                                    {trustee.name}
                                                </h3>
                                                <p className="text-secondary font-medium text-sm">
                                                    {trustee.role}
                                                </p>
                                            </div>
                                            {trustee.linkedin && (
                                                <a
                                                    href={trustee.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-slate-400 hover:text-[#0077b5] transition-colors"
                                                >
                                                    <Linkedin className="h-5 w-5" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                                            {trustee.bio}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
