import { useState } from 'react';
import { useTickets, useTicketStats } from '@/hooks/useSupport';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types/support';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/utils';

/**
 * Support Page Component
 * Displays a list of support tickets with filtering and search capabilities
 */
export default function SupportPage() {
    const { tickets, loading, error, filters, updateFilters } = useTickets();
    const { stats, loading: statsLoading } = useTicketStats();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchQuery });
    };

    const handleStatusChange = (status: TicketStatus | '') => {
        updateFilters({ status: status || undefined });
    };

    const handlePriorityChange = (priority: TicketPriority | '') => {
        updateFilters({ priority: priority || undefined });
    };

    const handleCategoryChange = (category: TicketCategory | '') => {
        updateFilters({ category: category || undefined });
    };

    const getStatusBadgeColor = (status: TicketStatus) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading || statsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Support Tickets</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
                    <p className="text-2xl font-bold">{stats?.total || 0}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
                    <p className="text-2xl font-bold">{stats?.open || 0}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                    <p className="text-2xl font-bold">{stats?.in_progress || 0}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                    <p className="text-2xl font-bold">{stats?.resolved || 0}</p>
                </Card>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        value={filters.status || ''}
                        onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                        className="w-full md:w-40"
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </Select>
                    <Select
                        value={filters.priority || ''}
                        onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                        className="w-full md:w-40"
                    >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </Select>
                    <Select
                        value={filters.category || ''}
                        onChange={(e) => handleCategoryChange(e.target.value as TicketCategory)}
                        className="w-full md:w-40"
                    >
                        <option value="">All Categories</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="shipping">Shipping</option>
                        <option value="account">Account</option>
                        <option value="other">Other</option>
                    </Select>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ticket ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{ticket.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge className={getStatusBadgeColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.priority}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(ticket.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Button
                                        variant="link"
                                        onClick={() => window.location.href = `/seller/dashboard/support/${ticket.id}`}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => updateFilters({ page: (filters.page || 1) - 1 })}
                    disabled={!filters.page || filters.page <= 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-500">
                    Page {filters.page || 1}
                </span>
                <Button
                    variant="outline"
                    onClick={() => updateFilters({ page: (filters.page || 1) + 1 })}
                >
                    Next
                </Button>
            </div>
        </div>
    );
} 