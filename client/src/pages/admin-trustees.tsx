import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { getTrustees, createTrustee, updateTrustee, deleteTrustee } from "@/lib/rtdb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTrusteeSchema, Trustee, InsertTrustee } from "@shared/schema";
import { Plus, Pencil, Trash2, Loader2, Linkedin } from "lucide-react";

export default function AdminTrustees() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTrustee, setEditingTrustee] = useState<Trustee | null>(null);

    const { data: trustees, isLoading } = useQuery<Trustee[]>({
        queryKey: ["trustees"],
        queryFn: getTrustees,
    });

    const form = useForm<InsertTrustee>({
        resolver: zodResolver(insertTrusteeSchema),
        defaultValues: {
            name: "",
            role: "",
            category: "Board of Trustees", // Default
            bio: "",
            image: "",
            linkedin: "",
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: InsertTrustee) => {
            return createTrustee(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/trustees"] });
            toast({ title: "Success", description: "Trustee added successfully" });
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<InsertTrustee>;
        }) => {
            return updateTrustee(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/trustees"] });
            toast({ title: "Success", description: "Trustee updated successfully" });
            setIsDialogOpen(false);
            setEditingTrustee(null);
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteTrustee(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/trustees"] });
            toast({ title: "Success", description: "Trustee deleted successfully" });
        },
    });

    const onSubmit = (data: InsertTrustee) => {
        if (editingTrustee) {
            updateMutation.mutate({ id: editingTrustee.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (trustee: Trustee) => {
        setEditingTrustee(trustee);
        form.reset({
            name: trustee.name,
            role: trustee.role,
            category: trustee.category,
            bio: trustee.bio,
            image: trustee.image,
            linkedin: trustee.linkedin || "",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this trustee?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => form.setValue("image", reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const categories = ["Board of Trustees", "Advisory Board", "Executive Team"];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-heading">Manage Trustees</h1>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingTrustee(null);
                            form.reset({
                                name: "",
                                role: "",
                                category: "Board of Trustees",
                                bio: "",
                                image: "",
                                linkedin: "",
                            });
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Trustee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTrustee ? "Edit Trustee" : "Add New Trustee"}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Chairperson" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>
                                                                {cat}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    {field.value && (
                                                        <img
                                                            src={field.value}
                                                            alt="Preview"
                                                            className="w-20 h-20 object-cover rounded-md mt-2"
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn URL (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://linkedin.com/in/..."
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief biography..."
                                                    className="h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        createMutation.isPending || updateMutation.isPending
                                    }
                                >
                                    {createMutation.isPending || updateMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    {editingTrustee ? "Update Trustee" : "Create Trustee"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : trustees?.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-slate-500"
                                >
                                    No trustees found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            trustees?.map((trustee) => (
                                <TableRow key={trustee.id}>
                                    <TableCell>
                                        <img
                                            src={trustee.image}
                                            alt={trustee.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{trustee.name}</TableCell>
                                    <TableCell>{trustee.role}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                            {trustee.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(trustee)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(trustee.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
