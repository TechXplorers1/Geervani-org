import { useQuery } from "@tanstack/react-query";
import { type Donation } from "@shared/schema";
import { getDonations } from "@/lib/rtdb";
import AdminLayout from "@/components/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDonations() {
    const { data: donations, isLoading } = useQuery<Donation[]>({
        queryKey: ["donations"],
        queryFn: getDonations,
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Donations & Payments</h1>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Donor</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : donations?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No donations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            donations?.map((donation) => (
                                <TableRow key={donation.id}>
                                    <TableCell>
                                        {donation.createdAt
                                            ? new Date(donation.createdAt).toLocaleDateString()
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {donation.donorName || "Anonymous"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {donation.donorEmail}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {donation.program}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        ₹{donation.amount.toLocaleString()}
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
