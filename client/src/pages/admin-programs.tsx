
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramSchema, type InsertProgram, type Program } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { getPrograms, createProgram, updateProgram, deleteProgram } from "@/lib/rtdb";
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

export default function AdminPrograms() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: getPrograms,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      // @ts-ignore
      return await createProgram(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast({ title: "Success", description: "Program created successfully" });
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
    mutationFn: async (program: Program) => {
      // @ts-ignore
      return await updateProgram(program.id, program);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast({ title: "Success", description: "Program updated successfully" });
      setIsDialogOpen(false);
      setEditingProgram(null);
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
    mutationFn: async (id: number | string) => {
      await deleteProgram(String(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast({ title: "Success", description: "Program deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertProgram>({
    resolver: zodResolver(insertProgramSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image: "",
      duration: "",
      beneficiaries: "",
      partners: "",
      outcomes: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: InsertProgram) => {
    if (editingProgram) {
      const updatedProgram: Program = {
        ...editingProgram,
        ...data,
      };
      updateMutation.mutate(updatedProgram);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    form.reset({
      title: program.title,
      description: program.description,
      category: program.category,
      image: program.image,
      duration: program.duration || "",
      beneficiaries: program.beneficiaries || "",
      partners: program.partners || "",
      outcomes: program.outcomes || "",
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProgram(null);
    form.reset({
      title: "",
      description: "",
      category: "",
      image: "",
      duration: "",
      beneficiaries: "",
      partners: "",
      outcomes: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? "Edit Program" : "Add New Program"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Program title" {...field} />
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
                        <FormControl>
                          <Input placeholder="e.g. Education, Health" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview / Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Program details..."
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 6 Months" value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="beneficiaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiaries</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 500 Women" value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partners"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partners</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Local Gov" value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outcomes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Outcomes</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Increased income" value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
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
                              className="w-full h-48 object-cover rounded-md mt-2"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProgram ? "Update Program" : "Create Program"}
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
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : programs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No programs found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              programs?.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.title}</TableCell>
                  <TableCell>{program.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(program)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this program?")) {
                            deleteMutation.mutate(program.id);
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
