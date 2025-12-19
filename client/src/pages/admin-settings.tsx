
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteConfigSchema, type SiteConfig, type InsertSiteConfig } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { getSiteConfig, updateSiteConfig } from "@/lib/rtdb";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSettings() {
    const { toast } = useToast();

    const { data: config, isLoading } = useQuery<SiteConfig>({
        queryKey: ["site-config"],
        queryFn: getSiteConfig,
    });

    const form = useForm<InsertSiteConfig>({
        resolver: zodResolver(insertSiteConfigSchema),
        defaultValues: config || {
            email: "",
            phone: "",
            address: "",
            workingHours: "",
            contactHeroTitle: "",
            contactHeroSubtitle: "",
            contactFormTitle: "",
            contactFormSubtitle: "",
        },
        values: config, // React-hook-form will update when config loads
    });

    const updateMutation = useMutation({
        mutationFn: async (data: InsertSiteConfig) => {
            return await updateSiteConfig(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-config"] });
            toast({ title: "Success", description: "Settings updated successfully" });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: InsertSiteConfig) => {
        updateMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Site Settings</h1>
                <p className="text-muted-foreground">Manage global contact information and settings.</p>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            These details will be displayed on the 'Get in Touch' page and footer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="contact@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 12345 67890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Physical Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St, City, Country" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="workingHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Working Hours</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mon - Fri, 9am - 6pm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="mt-4"
                                >
                                    {updateMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Contact Page Content</CardTitle>
                        <CardDescription>
                            Customize the headings and text on the Get in Touch page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="contactHeroTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Get in Touch" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactHeroSubtitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Subtitle</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Have questions..." {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactFormTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Form Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Send us a message" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactFormSubtitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Form Subtitle</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Fill out the form..." {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="mt-4"
                                >
                                    {updateMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
