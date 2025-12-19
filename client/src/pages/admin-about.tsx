
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    insertStaffSchema,
    type InsertStaff,
    type Staff,
} from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { getStaff, createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/rtdb";
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

export default function AdminAbout() {
    const { toast } = useToast();

    // Reuse the Team Tab logic directly here as main content

    const { data: staff, isLoading: isStaffLoading } = useQuery<Staff[]>({
        queryKey: ["staff"],
        queryFn: getStaff,
    });

    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<InsertStaff>({
        resolver: zodResolver(insertStaffSchema),
        defaultValues: { name: "", role: "", bio: "", image: "", email: "", linkedin: "", instagram: "" },
    });

    const createMutation = useMutation({
        mutationFn: async (data: InsertStaff) => createTeamMember(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast({ title: "Success", description: "Staff added" });
            setIsDialogOpen(false);
            form.reset();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Staff) => updateTeamMember(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast({ title: "Success", description: "Staff updated" });
            setIsDialogOpen(false);
            setEditingStaff(null);
            form.reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => deleteTeamMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast({ title: "Success", description: "Staff deleted" });
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

    const onSubmit = (data: InsertStaff) => {
        const formattedData = {
            ...data,
            email: data.email || null,
            linkedin: data.linkedin || null,
            instagram: data.instagram || null
        };

        if (editingStaff) {
            updateMutation.mutate({ ...formattedData, id: editingStaff.id } as Staff);
        } else {
            createMutation.mutate(formattedData);
        }
    };

    const onInvalid = (errors: any) => {
        console.error("Form errors:", errors);
        const errorMessages = Object.values(errors)
            .map((e: any) => e.message)
            .join(", ");
        toast({
            title: "Validation Error",
            description: errorMessages || "Please check the form fields.",
            variant: "destructive",
        });
    };

    const handleEdit = (s: Staff) => {
        setEditingStaff(s);
        form.reset({
            name: s.name,
            role: s.role,
            bio: s.bio,
            image: s.image,
            email: s.email || "",
            linkedin: s.linkedin || "",
            instagram: s.instagram || ""
        });
        setIsDialogOpen(true);
    };

    const handleNew = () => {
        setEditingStaff(null);
        form.reset({ name: "", role: "", bio: "", image: "", email: "", linkedin: "", instagram: "" });
        setIsDialogOpen(true);
    };

    if (isStaffLoading) {
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
                <h1 className="text-2xl font-bold">Team Members</h1>
                <p className="text-muted-foreground">Manage your team profiles on the About page.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>Manage your team profiles.</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingStaff ? "Edit Member" : "Add New Member"}</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="role" render={({ field }) => (
                                            <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="bio" render={({ field }) => (
                                        <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />

                                    <div className="grid grid-cols-3 gap-4">
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="linkedin" render={({ field }) => (
                                            <FormItem><FormLabel>LinkedIn (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="instagram" render={({ field }) => (
                                            <FormItem><FormLabel>Instagram (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>

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
                                        {editingStaff ? "Update Member" : "Add Member"}
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
                            {staff?.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell><img src={s.image} alt={s.name} className="w-10 h-10 rounded-full object-cover" /></TableCell>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.role}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirm("Delete this member?") && deleteMutation.mutate(s.id)}><Trash2 className="h-4 w-4" /></Button>
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
