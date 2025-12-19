
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    insertStorySchema,
    type InsertStory,
    type Story,
} from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { getStories, createStory, updateStory, deleteStory } from "@/lib/rtdb";
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
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminStories() {
    const { toast } = useToast();

    const { data: stories, isLoading: isStoriesLoading } = useQuery<Story[]>({
        queryKey: ["stories"],
        queryFn: getStories,
    });

    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<InsertStory>({
        resolver: zodResolver(insertStorySchema),
        defaultValues: { name: "", role: "", quote: "", image: "" },
    });

    const createMutation = useMutation({
        mutationFn: async (data: InsertStory) => createStory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stories"] });
            toast({ title: "Success", description: "Story added" });
            setIsDialogOpen(false);
            form.reset();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Story) => updateStory(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stories"] });
            toast({ title: "Success", description: "Story updated" });
            setIsDialogOpen(false);
            setEditingStory(null);
            form.reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => deleteStory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stories"] });
            toast({ title: "Success", description: "Story deleted" });
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => form.setValue("image", reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: InsertStory) => {
        if (editingStory) {
            updateMutation.mutate({ ...data, id: editingStory.id } as Story);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (s: Story) => {
        setEditingStory(s);
        form.reset({
            name: s.name,
            role: s.role,
            quote: s.quote,
            image: s.image,
        });
        setIsDialogOpen(true);
    };

    const handleNew = () => {
        setEditingStory(null);
        form.reset({ name: "", role: "", quote: "", image: "" });
        setIsDialogOpen(true);
    };

    if (isStoriesLoading) {
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
                <h1 className="text-2xl font-bold">Impact Stories</h1>
                <p className="text-muted-foreground">Manage success stories and testimonials.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Stories</CardTitle>
                        <CardDescription>Manage your impact stories.</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4" /> Add Story</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingStory ? "Edit Story" : "Add New Story"}</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="role" render={({ field }) => (
                                            <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="quote" render={({ field }) => (
                                        <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />

                                    <FormField control={form.control} name="image" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                                                    {field.value && <img src={field.value} alt="Preview" className="w-20 h-20 object-cover rounded-md mt-2" />}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                                        {editingStory ? "Update Story" : "Add Story"}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {stories?.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell><img src={s.image} alt={s.name} className="w-10 h-10 rounded-full object-cover" /></TableCell>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.role}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirm("Delete this story?") && deleteMutation.mutate(s.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
