import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getWaitlistEntries,
  getWaitlistStats,
  updateWaitlistStatus,
  updateWaitlistNotes,
  exportWaitlistToCSV,
  getWaitlistAuditLog,
} from "@/services/waitlistService";
import {
  Users,
  Mail,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  History,
  Edit,
  LayoutGrid,
  List,
  Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  waitlisted: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  registered: "bg-green-100 text-green-700",
  removed: "bg-gray-100 text-gray-700",
};

export default function WaitlistManagement() {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [entriesResult, statsResult] = await Promise.all([
        getWaitlistEntries({
          status: statusFilter === "all" ? undefined : statusFilter,
          searchTerm: searchTerm || undefined,
        }),
        getWaitlistStats(),
      ]);

      if (entriesResult.success) {
        setEntries(entriesResult.data || []);
      }
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error("Error loading waitlist data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateWaitlistStatus(id, newStatus);
    if (result.success) {
      loadData();
      if (selectedEntry?.id === id) {
        setSelectedEntry(result.data);
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEntry) return;

    const result = await updateWaitlistNotes(selectedEntry.id, notes);
    if (result.success) {
      setIsNotesOpen(false);
      loadData();
      setSelectedEntry(result.data);
    }
  };

  const handleExport = async () => {
    const result = await exportWaitlistToCSV({
      status: statusFilter === "all" ? undefined : statusFilter,
    });

    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waitlist-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleViewDetails = async (entry: any) => {
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  const handleViewAudit = async (entry: any) => {
    const result = await getWaitlistAuditLog(entry.id);
    if (result.success) {
      setAuditLog(result.data || []);
      setIsAuditOpen(true);
    }
  };

  const handleEditEntry = (entry: any) => {
    setEditFormData({
      id: entry.id,
      firstName: entry.firstName || "",
      lastName: entry.lastName || "",
      email: entry.email,
      phone: entry.phone || "",
      profession: entry.profession || "",
      yearsOfExperience: entry.yearsOfExperience || "",
      status: entry.status,
    });
    setSelectedEntry(entry);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEntry) return;

    // Here you would call an update service function
    // For now, we'll just update the status which we already have
    const result = await updateWaitlistStatus(selectedEntry.id, editFormData.status);
    if (result.success) {
      setIsEditOpen(false);
      loadData();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground">
          Waitlist Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and track waitlist signups
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {stats?.total || 0}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Total Signups</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {stats?.confirmed || 0}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Email Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {stats?.contacted || 0}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Contacted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-montserrat font-bold text-foreground">
                    {stats?.registered || 0}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Registered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-montserrat flex items-center justify-between">
            <span>Waitlist Entries</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-gradient-gold text-css-black hover:bg-css-gold" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gradient-gold text-css-black hover:bg-css-gold" : ""}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                className="font-montserrat"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="bg-gradient-gold text-css-black hover:bg-css-gold">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          {/* List View */}
          {viewMode === "list" && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Profession</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Confirmed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No waitlist entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.firstName && entry.lastName
                          ? `${entry.firstName} ${entry.lastName}`
                          : "-"}
                      </TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell className="capitalize">
                        {entry.profession ? entry.profession.replace("_", " ") : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusColors[entry.status as keyof typeof statusColors]}
                          variant="secondary"
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(entry.signupDate)}</TableCell>
                      <TableCell>
                        {entry.confirmedEmail ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEntry(entry)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(entry)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAudit(entry)}
                          title="View History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="shadow-card border-0">
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : entries.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No waitlist entries found
                </div>
              ) : (
                entries.map((entry) => (
                  <Card key={entry.id} className="shadow-card border-0 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-montserrat font-bold text-lg">
                            {entry.firstName && entry.lastName
                              ? `${entry.firstName} ${entry.lastName}`
                              : "Not provided"}
                          </h3>
                          <p className="text-sm text-muted-foreground">{entry.email}</p>
                        </div>
                        <Badge
                          className={statusColors[entry.status as keyof typeof statusColors]}
                          variant="secondary"
                        >
                          {entry.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">
                            {entry.profession ? entry.profession.replace("_", " ") : "Not specified"}
                          </span>
                        </div>
                        {entry.phone && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{entry.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(entry.signupDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.confirmedEmail ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Email Confirmed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <span className="text-yellow-600">Pending Confirmation</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(entry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewAudit(entry)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Waitlist Entry Details</DialogTitle>
            <DialogDescription>
              View and manage waitlist entry information
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Name</Label>
                  <p className="text-sm">
                    {selectedEntry.firstName && selectedEntry.lastName
                      ? `${selectedEntry.firstName} ${selectedEntry.lastName}`
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="text-sm">{selectedEntry.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone</Label>
                  <p className="text-sm">{selectedEntry.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Profession</Label>
                  <p className="text-sm capitalize">
                    {selectedEntry.profession ? selectedEntry.profession.replace("_", " ") : "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Years of Experience</Label>
                  <p className="text-sm">{selectedEntry.yearsOfExperience || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Referral Source</Label>
                  <p className="text-sm capitalize">
                    {selectedEntry.referralSource ? selectedEntry.referralSource.replace("_", " ") : "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Interested Services</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedEntry.interestedServices && selectedEntry.interestedServices.length > 0 ? (
                    selectedEntry.interestedServices.map((service: string) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">None selected</p>
                  )}
                </div>
              </div>

              {selectedEntry.message && (
                <div>
                  <Label className="text-sm font-semibold">Message</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                    {selectedEntry.message}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-semibold">Status</Label>
                <Select
                  value={selectedEntry.status}
                  onValueChange={(value) => handleStatusChange(selectedEntry.id, value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waitlisted">Waitlisted</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold">Admin Notes</Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                  {selectedEntry.notes || "No notes added"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setNotes(selectedEntry.notes || "");
                    setIsNotesOpen(true);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Edit Notes
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-semibold">Signup Date</Label>
                  <p className="text-sm">{formatDate(selectedEntry.signupDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email Confirmed</Label>
                  <p className="text-sm">
                    {selectedEntry.confirmedEmail ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-montserrat">Edit Admin Notes</DialogTitle>
            <DialogDescription>
              Add or update notes for this waitlist entry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Enter notes about this applicant..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNotesOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes} className="bg-gradient-gold text-css-black hover:bg-css-gold">
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Log Dialog */}
      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Audit Log</DialogTitle>
            <DialogDescription>
              View all changes made to this waitlist entry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLog.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No audit log entries</p>
            ) : (
              auditLog.map((log) => (
                <div key={log.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm capitalize">
                      {log.action.replace("_", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  {log.previousValue && (
                    <p className="text-xs text-muted-foreground">
                      From: <span className="font-mono">{log.previousValue}</span>
                    </p>
                  )}
                  {log.newValue && (
                    <p className="text-xs text-muted-foreground">
                      To: <span className="font-mono">{log.newValue}</span>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Edit Waitlist Entry</DialogTitle>
            <DialogDescription>
              Update waitlist entry information
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">First Name</Label>
                  <Input
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="mt-1"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Last Name</Label>
                  <Input
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="mt-1"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <Input
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="mt-1"
                    type="email"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone</Label>
                  <Input
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="mt-1"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Profession</Label>
                  <Select
                    value={editFormData.profession}
                    onValueChange={(value) => setEditFormData({ ...editFormData, profession: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registered_nurse">Registered Nurse</SelectItem>
                      <SelectItem value="care_assistant">Care Assistant</SelectItem>
                      <SelectItem value="healthcare_assistant">Healthcare Assistant</SelectItem>
                      <SelectItem value="support_worker">Support Worker</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Years of Experience</Label>
                  <Input
                    value={editFormData.yearsOfExperience}
                    onChange={(e) => setEditFormData({ ...editFormData, yearsOfExperience: e.target.value })}
                    className="mt-1"
                    placeholder="Years of experience"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waitlisted">Waitlisted</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-gradient-gold text-css-black hover:bg-css-gold">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
