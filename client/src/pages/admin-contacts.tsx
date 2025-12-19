// client/src/pages/admin-contacts.tsx

import { useQuery, useMutation } from "@tanstack/react-query";
import { type ContactMessage, type NewsletterSubscription } from "@shared/schema";
import { getContactMessages, getNewsletterSubscriptions, deleteContactMessage } from "@/lib/rtdb";
import { queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Eye } from "lucide-react";

export default function AdminContacts() {
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["contact-messages"],
    queryFn: getContactMessages,
  });

  const { data: subscribers, isLoading: isSubscribersLoading } = useQuery<NewsletterSubscription[]>({
    queryKey: ["newsletter-subscriptions"],
    queryFn: getNewsletterSubscriptions,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteContactMessage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({ title: "Success", description: "Message deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
      </div>

      <Tabs defaultValue="messages">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
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
              ) : messages?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No contact messages found.
                  </TableCell>
                </TableRow>
              ) : (
                messages?.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{msg.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Message Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">From</p>
                                <p>{msg.name} ({msg.email})</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                <p>{msg.subject}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Date</p>
                                <p>{new Date(msg.createdAt).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Message</p>
                                <p className="whitespace-pre-wrap bg-slate-50 p-3 rounded-md text-sm">
                                  {msg.message}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this message?")) {
                              deleteMutation.mutate(msg.id);
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
        </TabsContent>

        <TabsContent value="subscribers" className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Subscribed</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSubscribersLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : subscribers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No newsletter subscribers found.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers?.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      {new Date(sub.subscribedAt || new Date()).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{sub.email}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
