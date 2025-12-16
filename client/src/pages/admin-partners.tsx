
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Partner, InsertPartner } from "@shared/schema";
import AdminLayout from "@/components/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminPartners() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const [category, setCategory] = useState("Funding");
    const [website, setWebsite] = useState("");

    const { data: partners, isLoading } = useQuery<Partner[]>({
        queryKey: ["/api/partners"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: InsertPartner) => {
            const res = await apiRequest("POST", "/api/partners", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
            toast({ title: "Success", description: "Partner created." });
            setIsDialogOpen(false);
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
        mutationFn: async (partner: Partner) => {
            const res = await apiRequest("PATCH", `/api/partners/${partner.id}`, partner);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
            toast({ title: "Success", description: "Partner updated." });
            setIsDialogOpen(false);
            setEditingPartner(null);
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
            await apiRequest("DELETE", `/api/partners/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
            toast({ title: "Deleted", description: "Partner removed." });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const resetForm = () => {
        setName("");
        setLogo("");
        setCategory("Funding");
        setWebsite("");
    };

    const openCreate = () => {
        setEditingPartner(null);
        resetForm();
        setIsDialogOpen(true);
    };

    const openEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setName(partner.name);
        setLogo(partner.logo);
        setCategory(partner.category);
        setWebsite(partner.website || "");
        setIsDialogOpen(true);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: InsertPartner = {
            name,
            logo,
            category,
            website: website || undefined,
        };

        if (editingPartner) {
            updateMutation.mutate({
                ...editingPartner,
                ...data,
            });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Partners</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Add Partner
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingPartner ? "Edit Partner" : "Add New Partner"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Funding, Implementation"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="logo">Logo</Label>
                                <div className="space-y-2">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                    {logo && (
                                        <img src={logo} alt="Preview" className="h-16 object-contain rounded-md mt-2 border p-1" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="website">Website URL (Optional)</Label>
                                <Input
                                    id="website"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {(createMutation.isPending || updateMutation.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editingPartner ? "Update Partner" : "Create Partner"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : partners?.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No partners found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            partners?.map((partner) => (
                                <TableRow key={partner.id}>
                                    <TableCell>
                                        <img src={partner.logo} alt={partner.name} className="h-8 w-auto object-contain" />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {partner.name}
                                    </TableCell>
                                    <TableCell>
                                        {partner.category}
                                    </TableCell>
                                    <TableCell>
                                        {partner.website ? (
                                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                Visit
                                            </a>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(partner)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to delete this partner?"
                                                        )
                                                    ) {
                                                        deleteMutation.mutate(partner.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
