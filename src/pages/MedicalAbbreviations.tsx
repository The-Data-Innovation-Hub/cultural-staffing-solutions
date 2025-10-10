import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  AlertTriangle,
  Info,
  Shield,
  Globe,
  Stethoscope,
  BookOpen,
  Filter,
  X
} from "lucide-react";
import {
  medicalAbbreviations,
  regions,
  specialties,
  searchAbbreviations,
  type MedicalAbbreviation,
  type AbbreviationMeaning
} from "@/data/medicalAbbreviations";

export default function MedicalAbbreviations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All Specialties");
  const [selectedDangerLevel, setSelectedDangerLevel] = useState<string>("");
  const [selectedAbbreviation, setSelectedAbbreviation] = useState<MedicalAbbreviation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Search and filter
  const filteredAbbreviations = useMemo(() => {
    return searchAbbreviations(
      searchQuery,
      selectedRegion,
      selectedSpecialty !== 'All Specialties' ? selectedSpecialty : undefined,
      selectedDangerLevel || undefined
    );
  }, [searchQuery, selectedRegion, selectedSpecialty, selectedDangerLevel]);

  // Get danger level badge styling
  const getDangerBadge = (level?: string) => {
    switch (level) {
      case 'dangerous':
        return {
          className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "Dangerous"
        };
      case 'caution':
        return {
          className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "Caution"
        };
      default:
        return {
          className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
          icon: <Shield className="h-3 w-3" />,
          label: "Safe"
        };
    }
  };

  // Get region badge color
  const getRegionBadge = (region: string) => {
    const colors: Record<string, string> = {
      'NI': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      'UK': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
      'US': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
      'AU': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
      'Global': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
    };
    return colors[region] || colors['Global'];
  };

  const handleViewDetails = (abbr: MedicalAbbreviation) => {
    setSelectedAbbreviation(abbr);
    setIsDetailOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("Global");
    setSelectedSpecialty("All Specialties");
    setSelectedDangerLevel("");
  };

  const hasActiveFilters = searchQuery || selectedRegion !== "Global" ||
    selectedSpecialty !== "All Specialties" || selectedDangerLevel;

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground mb-2">
          Medical Abbreviations Dictionary
        </h1>
        <p className="text-muted-foreground">
          Search and understand medical abbreviations with regional context
        </p>
      </div>

      {/* Warning Card for Dangerous Abbreviations */}
      <Card className="shadow-card border-0 bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-montserrat font-bold text-sm text-red-900 dark:text-red-100 mb-1">
                Important Safety Notice
              </h3>
              <p className="text-xs text-red-800 dark:text-red-200">
                81% of medical abbreviations are ambiguous with an average of 16 different meanings each.
                Some abbreviations are on the Joint Commission "Do Not Use" list. Always verify context and
                consider regional differences when interpreting medical abbreviations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-montserrat flex items-center gap-2">
            <Search className="h-5 w-5 text-css-gold" />
            Search & Filters
          </CardTitle>
          <CardDescription>
            Filter by region, specialty, or safety level to find relevant abbreviations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search abbreviations (e.g., CA, BID, ED)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card shadow-card border-0"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-css-gold" />
                Region
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="bg-card shadow-card border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region === 'NI' ? 'Northern Ireland' : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-css-gold" />
                Specialty
              </label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="bg-card shadow-card border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-css-gold" />
                Safety Level
              </label>
              <Select value={selectedDangerLevel} onValueChange={setSelectedDangerLevel}>
                <SelectTrigger className="bg-card shadow-card border-0">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="safe">Safe</SelectItem>
                  <SelectItem value="caution">Caution</SelectItem>
                  <SelectItem value="dangerous">Dangerous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAbbreviations.length} of {medicalAbbreviations.length} abbreviations
            </p>
            {selectedRegion === 'NI' && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                <Globe className="h-3 w-3 mr-1" />
                Northern Ireland HSC Focus
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAbbreviations.length === 0 ? (
          <Card className="shadow-card border-0 col-span-full">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-montserrat font-bold text-lg text-foreground mb-2">
                No Abbreviations Found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAbbreviations.map((abbr) => {
            const maxDangerLevel = abbr.meanings.reduce((max, m) => {
              if (m.dangerLevel === 'dangerous') return 'dangerous';
              if (m.dangerLevel === 'caution' && max !== 'dangerous') return 'caution';
              return max;
            }, 'safe' as string);

            const dangerBadge = getDangerBadge(maxDangerLevel);

            return (
              <Card
                key={abbr.abbreviation}
                className="shadow-card border-0 hover:shadow-gold transition-all duration-200 cursor-pointer"
                onClick={() => handleViewDetails(abbr)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-montserrat font-bold text-2xl text-foreground">
                        {abbr.abbreviation}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {abbr.meanings.length} meaning{abbr.meanings.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className={dangerBadge.className}>
                            {dangerBadge.icon}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{dangerBadge.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Common Usage */}
                  {abbr.commonUsage && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground font-medium">
                        {abbr.commonUsage}
                      </p>
                    </div>
                  )}

                  {/* Regions */}
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(abbr.meanings.map(m => m.region))).map(region => (
                      <Badge key={region} className={getRegionBadge(region)} variant="secondary">
                        {region === 'NI' ? 'Northern Ireland' : region}
                      </Badge>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <Button
                    className="w-full bg-gradient-gold text-css-black hover:bg-css-gold"
                    onClick={() => handleViewDetails(abbr)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    View All Meanings
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat text-3xl">
              {selectedAbbreviation?.abbreviation}
            </DialogTitle>
            <DialogDescription>
              {selectedAbbreviation?.meanings.length} different meaning
              {selectedAbbreviation && selectedAbbreviation.meanings.length > 1 ? 's' : ''} across regions and specialties
            </DialogDescription>
          </DialogHeader>

          {selectedAbbreviation && (
            <div className="space-y-4 mt-4">
              {/* Common Usage Highlight */}
              {selectedAbbreviation.commonUsage && (
                <Card className="shadow-card border-0 bg-gradient-gold">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-css-black mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-montserrat font-bold text-sm text-css-black mb-1">
                          Most Common Usage
                        </h4>
                        <p className="text-sm text-css-black">
                          {selectedAbbreviation.commonUsage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Meanings */}
              <div className="space-y-3">
                <h4 className="font-montserrat font-bold text-sm text-foreground">
                  All Possible Meanings:
                </h4>
                {selectedAbbreviation.meanings.map((meaning, index) => {
                  const dangerBadge = getDangerBadge(meaning.dangerLevel);

                  return (
                    <Card
                      key={index}
                      className={`shadow-card border-0 ${
                        meaning.dangerLevel === 'dangerous'
                          ? 'border-l-4 border-l-red-500'
                          : meaning.dangerLevel === 'caution'
                          ? 'border-l-4 border-l-yellow-500'
                          : ''
                      }`}
                    >
                      <CardContent className="p-4 space-y-3">
                        {/* Definition */}
                        <div className="flex items-start justify-between gap-3">
                          <h5 className="font-montserrat font-bold text-foreground flex-1">
                            {meaning.definition}
                          </h5>
                          <Badge className={dangerBadge.className}>
                            {dangerBadge.icon}
                            <span className="ml-1">{dangerBadge.label}</span>
                          </Badge>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getRegionBadge(meaning.region)} variant="secondary">
                            <Globe className="h-3 w-3 mr-1" />
                            {meaning.region === 'NI' ? 'Northern Ireland' : meaning.region}
                          </Badge>
                          {meaning.specialty && (
                            <Badge variant="outline">
                              <Stethoscope className="h-3 w-3 mr-1" />
                              {meaning.specialty}
                            </Badge>
                          )}
                        </div>

                        {/* Context */}
                        {meaning.context && (
                          <div className="p-2 bg-muted rounded text-sm text-muted-foreground">
                            <strong>Context:</strong> {meaning.context}
                          </div>
                        )}

                        {/* Example */}
                        {meaning.example && (
                          <div className="p-2 bg-muted rounded text-sm">
                            <strong className="text-foreground">Example:</strong>{' '}
                            <span className="text-muted-foreground italic">"{meaning.example}"</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
