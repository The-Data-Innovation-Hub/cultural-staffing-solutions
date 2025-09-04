import { useState } from "react";
import { Download, Award, Calendar, CheckCircle, Eye, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Certificate {
  id: string;
  title: string;
  courseName: string;
  category: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  status: 'active' | 'expired' | 'expiring_soon';
  credentialUrl?: string;
  pdfUrl?: string;
}

const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'HSC Induction Training',
    courseName: 'Northern Ireland Healthcare System Overview',
    category: 'Mandatory',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    certificateNumber: 'CSS-2024-001234',
    status: 'expiring_soon',
    credentialUrl: '#',
    pdfUrl: '#'
  },
  {
    id: '2',
    title: 'Infection Control Certification',
    courseName: 'Advanced Infection Prevention and Control',
    category: 'Clinical',
    issueDate: '2024-03-20',
    expiryDate: '2026-03-20',
    certificateNumber: 'CSS-2024-002345',
    status: 'active',
    credentialUrl: '#',
    pdfUrl: '#'
  },
  {
    id: '3',
    title: 'Manual Handling',
    courseName: 'Safe Patient Moving and Handling',
    category: 'Health & Safety',
    issueDate: '2024-02-10',
    expiryDate: '2026-02-10',
    certificateNumber: 'CSS-2024-001789',
    status: 'active',
    credentialUrl: '#',
    pdfUrl: '#'
  },
  {
    id: '4',
    title: 'Safeguarding Adults',
    courseName: 'Adult Safeguarding Level 2',
    category: 'Mandatory',
    issueDate: '2023-11-05',
    expiryDate: '2024-11-05',
    certificateNumber: 'CSS-2023-009876',
    status: 'expired',
    credentialUrl: '#',
    pdfUrl: '#'
  },
  {
    id: '5',
    title: 'Cultural Competency',
    courseName: 'Cultural Sensitivity in Healthcare',
    category: 'Professional Development',
    issueDate: '2024-04-01',
    certificateNumber: 'CSS-2024-003456',
    status: 'active',
    credentialUrl: '#',
    pdfUrl: '#'
  },
  {
    id: '6',
    title: 'NMC Standards Compliance',
    courseName: 'NMC Code of Professional Standards',
    category: 'Regulatory',
    issueDate: '2024-05-15',
    expiryDate: '2025-05-15',
    certificateNumber: 'CSS-2024-004567',
    status: 'active',
    credentialUrl: '#',
    pdfUrl: '#'
  }
];

const Certificates = () => {
  const [certificates] = useState<Certificate[]>(mockCertificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['all', 'Mandatory', 'Clinical', 'Health & Safety', 'Professional Development', 'Regulatory'];
  const statuses = ['all', 'active', 'expired', 'expiring_soon'];

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || cert.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCertificates = filteredCertificates.filter(c => c.status === 'active');
  const expiringCertificates = filteredCertificates.filter(c => c.status === 'expiring_soon');
  const expiredCertificates = filteredCertificates.filter(c => c.status === 'expired');

  const getStatusBadge = (status: Certificate['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-500 text-white">Expired</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-amber-500 text-white">Expiring Soon</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = (certificate: Certificate) => {
    // In a real app, this would download the PDF
    console.log('Downloading certificate:', certificate.certificateNumber);
  };

  const handlePreview = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowPreview(true);
  };

  const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{certificate.title}</CardTitle>
            <CardDescription>{certificate.courseName}</CardDescription>
          </div>
          {getStatusBadge(certificate.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Certificate Number:</span>
            <span className="font-mono font-medium">{certificate.certificateNumber}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <Badge variant="outline">{certificate.category}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Issued:</span>
            <span>{formatDate(certificate.issueDate)}</span>
          </div>
          
          {certificate.expiryDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <span className={certificate.status === 'expiring_soon' ? 'text-amber-600 font-medium' : ''}>
                {formatDate(certificate.expiryDate)}
              </span>
            </div>
          )}
          
          <div className="flex gap-2 pt-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handlePreview(certificate)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-gold text-css-black hover:bg-css-gold"
              onClick={() => handleDownload(certificate)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-montserrat font-bold text-foreground mb-2">
          My Certificates
        </h1>
        <p className="text-muted-foreground">
          View and download your training certificates and professional credentials
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-css-gold" />
              <span className="text-2xl font-bold">{certificates.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">{activeCertificates.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-bold">{expiringCertificates.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">{expiredCertificates.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : 
                     status === 'active' ? 'Active' :
                     status === 'expired' ? 'Expired' : 'Expiring Soon'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring ({expiringCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredCertificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.map(cert => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No certificates found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCertificates.map(cert => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active certificates</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          {expiringCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiringCertificates.map(cert => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No certificates expiring soon</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiredCertificates.map(cert => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No expired certificates</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Certificate Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              {selectedCertificate?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCertificate && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-css-gold/10 to-css-gold/5 border-css-gold/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Award className="h-16 w-16 text-css-gold mx-auto" />
                    <h2 className="text-2xl font-bold font-montserrat">Certificate of Completion</h2>
                    <p className="text-lg">This is to certify that</p>
                    <p className="text-xl font-bold">Employee Name</p>
                    <p className="text-lg">has successfully completed</p>
                    <p className="text-xl font-semibold">{selectedCertificate.courseName}</p>
                    <div className="flex justify-center gap-8 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{formatDate(selectedCertificate.issueDate)}</p>
                      </div>
                      {selectedCertificate.expiryDate && (
                        <div>
                          <p className="text-sm text-muted-foreground">Expiry Date</p>
                          <p className="font-medium">{formatDate(selectedCertificate.expiryDate)}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">Certificate Number</p>
                      <p className="font-mono font-medium">{selectedCertificate.certificateNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button 
                  className="bg-gradient-gold text-css-black hover:bg-css-gold"
                  onClick={() => handleDownload(selectedCertificate)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certificates;