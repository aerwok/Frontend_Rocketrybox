import { useState } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Ticket Table Component
 * 
 * This component handles:
 * - Displaying tickets in a table format
 * - Loading and error states
 * - Ticket status updates
 * - Sorting and filtering (to be implemented)
 * 
 * @returns {JSX.Element} Rendered component
 */
const TicketTable = () => {
    const { tickets, isLoading, error, updateTicketStatus } = useTickets();
    const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);

    /**
     * Handle ticket status update
     * @param {string} ticketId - ID of the ticket to update
     * @param {Ticket['status']} newStatus - New status for the ticket
     */
    const handleStatusChange = async (ticketId: string, newStatus: Ticket['status']) => {
        try {
            setUpdatingTicketId(ticketId);
            await updateTicketStatus(ticketId, newStatus);
            toast.success("Ticket status updated successfully");
        } catch (error) {
            toast.error("Failed to update ticket status");
        } finally {
            setUpdatingTicketId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading tickets...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No tickets found</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Assigned To</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell>{ticket.id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{ticket.category}</TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={ticket.status}
                                    onValueChange={(value: Ticket['status']) => 
                                        handleStatusChange(ticket.id, value)
                                    }
                                    disabled={updatingTicketId === ticket.id}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                    ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'}`}
                                >
                                    {ticket.priority}
                                </span>
                            </TableCell>
                            <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell>{ticket.assignedTo || 'Unassigned'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TicketTable; 