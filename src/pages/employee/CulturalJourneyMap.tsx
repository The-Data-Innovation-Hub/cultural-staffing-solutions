import { useState, useEffect } from "react";
import { 
  Award, 
  Lock, 
  CheckCircle, 
  Star, 
  Lightbulb, 
  BookOpen,
  Trophy,
  Sparkles,
  ChevronRight,
  Heart,
  MessageCircle,
  HandHeart,
  Sun,
  Users,
  PartyPopper,
  Zap,
  Medal,
  PenLine,
  Send,
  ChevronDown,
  Compass,
  Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Types
interface CulturalModule {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  stampImage: string;
  proTip?: string;
  culturalInsight?: string;
  microReflection: string; // Mindfulness prompt shown after module completion
}

interface CulturalMilestone {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  modules: CulturalModule[];
  unlocked: boolean;
  badgeEarned?: boolean;
  reflectionQuestion: string;
}

// Mock data for cultural milestones - aligned with UI specifications
const initialMilestones: CulturalMilestone[] = [
  {
    id: "cultural-awareness",
    title: "Cultural Awareness",
    description: "Develop awareness of diverse cultural backgrounds in healthcare",
    icon: Sun,
    color: "text-amber-600",
    bgGradient: "from-amber-400 to-yellow-500",
    unlocked: true,
    badgeEarned: false,
    reflectionQuestion: "What new cultural perspective did I gain today?",
    modules: [
      {
        id: "aware-1",
        title: "Understanding Cultural Diversity",
        description: "Recognizing the spectrum of cultures in UK healthcare",
        completed: true,
        stampImage: "☀️",
        proTip: "Every interaction is an opportunity to learn. Approach each patient with curiosity, not assumptions.",
        culturalInsight: "The UK has over 250+ languages spoken. Cultural diversity is the norm, not the exception.",
        microReflection: "What cultural backgrounds are represented among your current patients?"
      },
      {
        id: "aware-2",
        title: "Cultural Self-Awareness",
        description: "Understanding your own cultural lens",
        completed: true,
        stampImage: "🪞",
        proTip: "Your cultural background shapes your assumptions about 'normal' healthcare. Question these defaults.",
        culturalInsight: "We all see the world through a cultural lens. Awareness of your own culture is the first step to understanding others.",
        microReflection: "How does your own cultural background influence your healthcare approach?"
      },
      {
        id: "aware-3",
        title: "Recognizing Bias",
        description: "Identifying and addressing unconscious biases",
        completed: false,
        stampImage: "🔍",
        proTip: "Take implicit bias tests regularly. Awareness is the first step to change.",
        culturalInsight: "Everyone has unconscious biases. The goal isn't to eliminate them but to prevent them from affecting care.",
        microReflection: "What bias or assumption about a culture did you become aware of today?"
      },
      {
        id: "aware-4",
        title: "Cultural Safety Foundations",
        description: "Creating safe spaces for all cultures",
        completed: false,
        stampImage: "🛡️",
        proTip: "Cultural safety is about how patients feel, not just what you do. Ask them if they feel respected.",
        culturalInsight: "A culturally safe environment allows patients to be themselves without fear of judgement.",
        microReflection: "How do you ensure patients feel culturally safe in your care?"
      }
    ]
  },
  {
    id: "communication",
    title: "Communication",
    description: "Master cross-cultural communication in healthcare settings",
    icon: MessageCircle,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-cyan-500",
    unlocked: true,
    badgeEarned: false,
    reflectionQuestion: "What did I learn about cross-cultural communication today?",
    modules: [
      {
        id: "comm-1",
        title: "Active Listening Across Cultures",
        description: "Learn to listen with cultural awareness",
        completed: true,
        stampImage: "💬",
        proTip: "When patients pause, it may indicate respect rather than confusion. Give them time to formulate responses.",
        culturalInsight: "In many cultures, direct eye contact can be seen as disrespectful. Pay attention to patients' comfort levels.",
        microReflection: "What did you notice today about how listening styles differ across cultures?"
      },
      {
        id: "comm-2",
        title: "Non-Verbal Communication",
        description: "Understanding body language in different cultures",
        completed: true,
        stampImage: "👐",
        proTip: "A thumbs up or OK sign can be offensive in some cultures. When in doubt, use words.",
        culturalInsight: "Personal space varies greatly between cultures. Mediterranean and Latin American cultures often prefer closer proximity.",
        microReflection: "How might your own body language be perceived differently by patients from other cultures?"
      },
      {
        id: "comm-3",
        title: "Medical Terminology Translation",
        description: "Explaining medical terms in plain language",
        completed: false,
        stampImage: "📋",
        proTip: "Use teach-back method: Ask patients to explain what they understood in their own words.",
        culturalInsight: "Some cultures have no direct translation for certain medical concepts. Use analogies and visual aids.",
        microReflection: "What did you notice about how language barriers can affect patient understanding and trust?"
      },
      {
        id: "comm-4",
        title: "Sensitive Conversations",
        description: "Discussing difficult topics with cultural sensitivity",
        completed: false,
        stampImage: "🗣️",
        proTip: "In some cultures, discussing death or serious illness directly with the patient is inappropriate. Ask about family involvement preferences.",
        culturalInsight: "Mental health stigma varies by culture. Frame discussions around 'stress' or 'worry' instead of clinical terms when appropriate.",
        microReflection: "How do cultural beliefs shape what topics feel 'sensitive' in healthcare conversations?"
      }
    ]
  },
  {
    id: "humility",
    title: "Cultural Humility",
    description: "Practice lifelong learning and self-reflection",
    icon: Heart,
    color: "text-rose-600",
    bgGradient: "from-rose-500 to-pink-500",
    unlocked: true,
    badgeEarned: false,
    reflectionQuestion: "What did I learn about cultural humility today that challenges my assumptions?",
    modules: [
      {
        id: "hum-1",
        title: "Embracing 'Not Knowing'",
        description: "The power of humble curiosity",
        completed: true,
        stampImage: "❤️",
        proTip: "Start with 'Help me understand...' rather than making assumptions about cultural practices.",
        culturalInsight: "Cultural humility means accepting you can never fully understand another's experience, but you can always try.",
        microReflection: "When was the last time you said 'I don't know about your culture, please tell me'?"
      },
      {
        id: "hum-2",
        title: "Learning from Patients",
        description: "Approaching each patient as a teacher",
        completed: false,
        stampImage: "📚",
        proTip: "Every patient is an expert in their own life and culture. Your role is to listen and learn.",
        culturalInsight: "Patients are experts in their own cultural experience. Your role is to learn and adapt.",
        microReflection: "What is one thing a patient could teach you that you couldn't learn from a textbook?"
      },
      {
        id: "hum-3",
        title: "Apologizing & Recovering",
        description: "Handling cultural mistakes gracefully",
        completed: false,
        stampImage: "🙏",
        proTip: "A sincere, specific apology followed by changed behaviour is always better than defensive explanations.",
        culturalInsight: "Cultural mistakes are inevitable. How you recover defines the relationship going forward.",
        microReflection: "How do you typically respond when you make a cultural mistake? What would help you respond better?"
      }
    ]
  },
  {
    id: "patient-family",
    title: "Patient & Family Engagement",
    description: "Partner with patients and families from all backgrounds",
    icon: Users,
    color: "text-emerald-600",
    bgGradient: "from-emerald-500 to-teal-500",
    unlocked: false,
    badgeEarned: false,
    reflectionQuestion: "How can I better engage patients and families from diverse backgrounds?",
    modules: [
      {
        id: "pf-1",
        title: "Family Dynamics in Care",
        description: "Understanding family roles in different cultures",
        completed: false,
        stampImage: "🤝",
        proTip: "In collectivist cultures, medical decisions often involve extended family. Include them in discussions when appropriate.",
        culturalInsight: "The eldest family member may be the decision-maker, regardless of who the patient is.",
        microReflection: "What did you notice about how family involvement differs from your own cultural expectations?"
      },
      {
        id: "pf-2",
        title: "Religious & Spiritual Beliefs",
        description: "Respecting diverse religious practices in healthcare",
        completed: false,
        stampImage: "✨",
        proTip: "Always ask about dietary restrictions before meals. Many religions have specific food requirements.",
        culturalInsight: "Some patients may refuse certain treatments due to religious beliefs. Understanding their perspective helps find alternatives.",
        microReflection: "What assumptions might you unknowingly make about patients' spiritual needs?"
      },
      {
        id: "pf-3",
        title: "Shared Decision Making",
        description: "Partnering with patients in their care journey",
        completed: false,
        stampImage: "🎯",
        proTip: "Some cultures expect healthcare providers to make decisions. Others expect full patient autonomy. Always ask preference.",
        culturalInsight: "True partnership means understanding how each patient and family wants to be involved in decisions.",
        microReflection: "How do you ensure patients feel empowered to participate in their own care?"
      },
      {
        id: "pf-4",
        title: "Traditional Medicine Integration",
        description: "Integrating traditional healing with modern care",
        completed: false,
        stampImage: "🌿",
        proTip: "Don't dismiss traditional remedies. Instead, ask about all treatments to check for interactions.",
        culturalInsight: "Many cultures use traditional healers alongside Western medicine. Collaboration, not competition, improves outcomes.",
        microReflection: "How can you create space for patients to share their traditional health practices without judgement?"
      }
    ]
  }
];

const CulturalJourneyMap = () => {
  const [milestones, setMilestones] = useState<CulturalMilestone[]>(initialMilestones);
  const [selectedMilestone, setSelectedMilestone] = useState<CulturalMilestone | null>(null);
  const [selectedModule, setSelectedModule] = useState<CulturalModule | null>(null);
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  
  // New UX Flow States
  const [showStampCelebration, setShowStampCelebration] = useState(false);
  const [celebratingModule, setCelebratingModule] = useState<CulturalModule | null>(null);
  const [microReflectionText, setMicroReflectionText] = useState(""); // Mindfulness micro-reflection
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [reflectingMilestone, setReflectingMilestone] = useState<CulturalMilestone | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [showMilestoneBadge, setShowMilestoneBadge] = useState(false);
  const [earnedBadgeMilestone, setEarnedBadgeMilestone] = useState<CulturalMilestone | null>(null);
  const [showFullMapCelebration, setShowFullMapCelebration] = useState(false);

  // Calculate overall progress
  const totalModules = milestones.reduce((acc, m) => acc + m.modules.length, 0);
  const completedModules = milestones.reduce(
    (acc, m) => acc + m.modules.filter(mod => mod.completed).length, 
    0
  );
  const overallProgress = Math.round((completedModules / totalModules) * 100);
  const stampsCollected = completedModules;
  const totalStamps = totalModules;
  const certificateEarned = overallProgress === 100;
  const badgesEarned = milestones.filter(m => m.badgeEarned).length;

  // Calculate milestone progress
  const getMilestoneProgress = (milestone: CulturalMilestone) => {
    const completed = milestone.modules.filter(m => m.completed).length;
    return Math.round((completed / milestone.modules.length) * 100);
  };

  // Check and unlock next milestone
  useEffect(() => {
    setMilestones(prev => {
      const updated = [...prev];
      for (let i = 1; i < updated.length; i++) {
        const prevMilestone = updated[i - 1];
        const prevProgress = getMilestoneProgress(prevMilestone);
        if (prevProgress >= 75 && !updated[i].unlocked) {
          updated[i] = { ...updated[i], unlocked: true };
        }
      }
      return updated;
    });
  }, [milestones.map(m => m.modules.filter(mod => mod.completed).length).join(',')]);

  // Complete module with celebration flow
  const completeModule = (milestoneId: string, moduleId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    const module = milestone?.modules.find(mod => mod.id === moduleId);
    
    if (!module || module.completed) return;
    
    // Update module completion
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedModules = m.modules.map(mod => {
          if (mod.id === moduleId) {
            return { ...mod, completed: true };
          }
          return mod;
        });
        return { ...m, modules: updatedModules };
      }
      return m;
    }));

    // Stage 1: Show stamp celebration (instant reward, dopamine boost)
    setCelebratingModule(module);
    setShowStampCelebration(true);
  };

  // Handle stamp celebration complete
  const handleStampCelebrationComplete = () => {
    setShowStampCelebration(false);
    
    // Find the milestone and check if it's now complete
    const milestone = milestones.find(m => 
      m.modules.some(mod => mod.id === celebratingModule?.id)
    );
    
    if (milestone) {
      const updatedMilestone = {
        ...milestone,
        modules: milestone.modules.map(mod => 
          mod.id === celebratingModule?.id ? { ...mod, completed: true } : mod
        )
      };
      
      const isComplete = updatedMilestone.modules.every(mod => mod.completed);
      
      if (isComplete && !milestone.badgeEarned) {
        // Stage 2: Show reflection prompt (after completing topic series)
        setReflectingMilestone(milestone);
        setShowReflectionPrompt(true);
      } else {
        // Show insight dialog
        setSelectedModule(celebratingModule);
        setShowInsightDialog(true);
      }
    }
    
    setCelebratingModule(null);
  };

  // Handle reflection submission
  const handleReflectionSubmit = () => {
    setShowReflectionPrompt(false);
    setReflectionText("");
    
    // Update milestone badge earned
    if (reflectingMilestone) {
      setMilestones(prev => prev.map(m => {
        if (m.id === reflectingMilestone.id) {
          return { ...m, badgeEarned: true };
        }
        return m;
      }));
      
      // Stage 3: Show milestone badge (visible progress, achievement)
      setEarnedBadgeMilestone(reflectingMilestone);
      setShowMilestoneBadge(true);
    }
    
    setReflectingMilestone(null);
  };

  // Handle milestone badge celebration complete
  const handleBadgeCelebrationComplete = () => {
    setShowMilestoneBadge(false);
    
    // Check if all milestones are complete
    const allComplete = milestones.every(m => 
      m.modules.every(mod => mod.completed)
    );
    
    if (allComplete) {
      // Stage 4: Show full map completion celebration
      setShowFullMapCelebration(true);
    }
    
    setEarnedBadgeMilestone(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with branding language */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
            <Route className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-foreground">
              Cultural Journey Map
            </h1>
            <p className="text-muted-foreground italic">
              "Earn stamps, progress on your journey, become culturally intelligent."
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview - Flat Iconography Map Style */}
      <Card className="mb-8 overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Circular Progress Map Visual (Flat Iconography) */}
            <div className="relative flex items-center justify-center">
              {/* Outer circular progress ring */}
              <svg className="w-56 h-56 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-amber-100"
                />
                {/* Progress circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 6.28} 628`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content - Flat iconography */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl flex flex-col items-center justify-center border-4 border-amber-400">
                  <Compass className="h-12 w-12 text-amber-400 mb-1" />
                  <p className="text-amber-400 text-3xl font-bold">{overallProgress}%</p>
                  <p className="text-amber-400/70 text-xs font-medium">COMPLETE</p>
                </div>
              </div>
              
              {/* Stamp indicators around the circle */}
              <div className="absolute inset-0">
                {milestones.map((milestone, index) => {
                  const angle = (index / milestones.length) * 360 - 90;
                  const radius = 115;
                  const x = 112 + radius * Math.cos((angle * Math.PI) / 180);
                  const y = 112 + radius * Math.sin((angle * Math.PI) / 180);
                  const Icon = milestone.icon;
                  const isComplete = getMilestoneProgress(milestone) === 100;
                  
                  return (
                    <div
                      key={milestone.id}
                      className={cn(
                        "absolute w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md",
                        isComplete 
                          ? "bg-gradient-to-br from-amber-400 to-amber-500" 
                          : milestone.badgeEarned 
                            ? "bg-gradient-to-br from-purple-400 to-purple-500"
                            : "bg-white border-2 border-amber-200"
                      )}
                      style={{
                        left: `${x - 16}px`,
                        top: `${y - 16}px`,
                      }}
                      title={milestone.title}
                    >
                      <Icon className={cn(
                        "h-4 w-4",
                        isComplete || milestone.badgeEarned ? "text-white" : milestone.color
                      )} />
                    </div>
                  );
                })}
              </div>
              
              {certificateEarned && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-2 shadow-lg animate-pulse">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Progress Stats */}
            <div className="flex-1 space-y-4">
              {/* Branding tagline */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                <p className="text-lg font-semibold text-center">
                  🎯 Earn stamps, progress on your journey, become culturally intelligent
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">Stamps</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{stampsCollected}/{totalStamps}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Medal className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Badges</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{badgesEarned}/{milestones.length}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Insights</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{stampsCollected}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">Certificate</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800">
                    {certificateEarned ? "✓ Earned" : `${overallProgress}%`}
                  </p>
                </div>
              </div>

              {certificateEarned ? (
                <Button 
                  onClick={() => setShowCertificateDialog(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  View Cultural Intelligence Certificate
                </Button>
              ) : (
                <div className="bg-white/50 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm text-slate-600 text-center">
                    <Sparkles className="inline h-4 w-4 text-amber-500 mr-1" />
                    Complete all milestones to earn your <strong>Cultural Intelligence Certificate</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Milestones Legend - Themed Stamps */}
      <Card className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold">Your Journey Milestones</h3>
          </div>
          
          {/* Themed Stamp Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3">
              <span className="text-2xl">☀️</span>
              <div>
                <p className="font-medium text-amber-400 text-sm">Cultural Awareness</p>
                <p className="text-slate-400 text-xs">Understanding diversity</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-blue-400 text-sm">Communication</p>
                <p className="text-slate-400 text-xs">Cross-cultural dialogue</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-medium text-rose-400 text-sm">Cultural Humility</p>
                <p className="text-slate-400 text-xs">Lifelong learning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3">
              <span className="text-2xl">🤝</span>
              <div>
                <p className="font-medium text-emerald-400 text-sm">Patient & Family</p>
                <p className="text-slate-400 text-xs">Inclusive engagement</p>
              </div>
            </div>
          </div>
          
          {/* Journey Flow */}
          <div className="border-t border-slate-700 pt-4">
            <p className="text-xs text-slate-400 mb-3">YOUR JOURNEY FLOW</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2 bg-amber-500/20 rounded-full px-3 py-1">
                <span>📖</span>
                <span className="text-amber-400">Complete Module</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600" />
              <div className="flex items-center gap-2 bg-purple-500/20 rounded-full px-3 py-1">
                <span>🎯</span>
                <span className="text-purple-400">Earn Stamp</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600" />
              <div className="flex items-center gap-2 bg-emerald-500/20 rounded-full px-3 py-1">
                <span>🏅</span>
                <span className="text-emerald-400">Complete Track</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600" />
              <div className="flex items-center gap-2 bg-rose-500/20 rounded-full px-3 py-1">
                <span>🎓</span>
                <span className="text-rose-400">Get Certified</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {milestones.map((milestone) => {
          const progress = getMilestoneProgress(milestone);
          const Icon = milestone.icon;
          const isComplete = progress === 100;
          
          return (
            <Card 
              key={milestone.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl",
                milestone.unlocked 
                  ? "border-2 hover:border-amber-400" 
                  : "opacity-60 border-2 border-dashed border-slate-300"
              )}
              onClick={() => milestone.unlocked && setSelectedMilestone(milestone)}
            >
              {/* Progress bar at top */}
              <div className={cn(
                "h-1.5 bg-gradient-to-r",
                milestone.bgGradient
              )} style={{ width: `${progress}%` }} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className={cn(
                      "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                      milestone.bgGradient
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {/* Badge indicator */}
                    {milestone.badgeEarned && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                        <Medal className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  {!milestone.unlocked ? (
                    <Lock className="h-5 w-5 text-slate-400" />
                  ) : isComplete ? (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Complete
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {progress}%
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3">{milestone.title}</CardTitle>
                <CardDescription className="text-sm">
                  {milestone.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Stamp Collection Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {milestone.modules.map((module) => (
                    <div 
                      key={module.id}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                        module.completed
                          ? "bg-gradient-to-br from-amber-100 to-amber-200 shadow-md border-2 border-amber-400"
                          : "bg-slate-100 border-2 border-dashed border-slate-300 grayscale opacity-50"
                      )}
                      title={module.title}
                    >
                      {module.stampImage}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {milestone.modules.filter(m => m.completed).length}/{milestone.modules.length} stamps
                  </span>
                  {milestone.unlocked && (
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                      View Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Locked Overlay */}
              {!milestone.unlocked && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 shadow-lg text-center">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">
                      Complete previous milestones to unlock
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* DIALOGS FOR UX FLOW */}
      {/* ============================================ */}

      {/* Stage 1: Stamp Celebration Dialog with Micro-Reflection */}
      <Dialog open={showStampCelebration} onOpenChange={setShowStampCelebration}>
        <DialogContent className="max-w-lg">
          <div className="py-4">
            {/* Celebration Animation */}
            <div className="relative mb-4 text-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 bg-amber-400/20 rounded-full animate-ping" />
              </div>
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-xl animate-bounce">
                {celebratingModule?.stampImage}
              </div>
              <PartyPopper className="absolute top-0 right-1/4 h-6 w-6 text-amber-500 animate-pulse" />
              <Sparkles className="absolute bottom-0 left-1/4 h-6 w-6 text-purple-500 animate-pulse" />
            </div>
            
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Stamp Collected! 🎉
              </h2>
              <p className="text-base font-medium text-amber-600">
                {celebratingModule?.title}
              </p>
            </div>
            
            <div className="flex justify-center gap-2 mb-5">
              <div className="text-center px-3 py-1.5 bg-amber-50 rounded-lg">
                <p className="text-xl font-bold text-amber-600">+1</p>
                <p className="text-xs text-slate-500">Stamp</p>
              </div>
              <div className="text-center px-3 py-1.5 bg-purple-50 rounded-lg">
                <p className="text-xl font-bold text-purple-600">+1</p>
                <p className="text-xs text-slate-500">Insight</p>
              </div>
              <div className="text-center px-3 py-1.5 bg-blue-50 rounded-lg">
                <p className="text-xl font-bold text-blue-600">+1</p>
                <p className="text-xs text-slate-500">Pro Tip</p>
              </div>
            </div>

            {/* Micro-Reflection for Mindfulness & Awareness */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 mb-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100">
                    <Heart className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Moment of Reflection</p>
                    <p className="text-xs text-emerald-600">Pause and notice what resonated with you</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 italic mb-3 leading-relaxed">
                  "{celebratingModule?.microReflection}"
                </p>
                <Textarea
                  value={microReflectionText}
                  onChange={(e) => setMicroReflectionText(e.target.value)}
                  placeholder="Take a moment to reflect... (optional but encouraged)"
                  className="min-h-[80px] resize-none text-sm bg-white/70 border-emerald-200 focus:border-emerald-400"
                />
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Reflection builds emotional intelligence, not just knowledge recall
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setMicroReflectionText("");
                  handleStampCelebrationComplete();
                }}
                className="flex-1"
              >
                Skip
              </Button>
              <Button 
                onClick={() => {
                  // Save reflection (could be sent to backend)
                  console.log("Micro-reflection saved:", microReflectionText);
                  setMicroReflectionText("");
                  handleStampCelebrationComplete();
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage 2: Reflection Prompt Dialog */}
      <Dialog open={showReflectionPrompt} onOpenChange={setShowReflectionPrompt}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                reflectingMilestone?.bgGradient
              )}>
                <PenLine className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Track Complete! 🎊</DialogTitle>
                <DialogDescription>
                  You've completed: {reflectingMilestone?.title}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 mb-4">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-purple-700 mb-2">
                  <Lightbulb className="inline h-4 w-4 mr-1" />
                  Reflection Prompt
                </p>
                <p className="text-lg text-slate-700 italic">
                  "{reflectingMilestone?.reflectionQuestion}"
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Your Reflection (encourages deeper learning)
              </label>
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Take a moment to reflect on what you've learned..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReflectionPrompt(false);
                handleReflectionSubmit();
              }}
            >
              Skip for now
            </Button>
            <Button
              onClick={handleReflectionSubmit}
              disabled={!reflectionText.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Reflection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stage 3: Milestone Badge Dialog */}
      <Dialog open={showMilestoneBadge} onOpenChange={setShowMilestoneBadge}>
        <DialogContent className="max-w-md text-center">
          <div className="py-6">
            {/* Badge Animation */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-purple-400/20 rounded-full animate-ping" />
              </div>
              <div className="relative mx-auto">
                <div className={cn(
                  "w-28 h-28 mx-auto rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center animate-bounce",
                  earnedBadgeMilestone?.bgGradient
                )}>
                  <Medal className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                  <Star className="h-5 w-5 text-white fill-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Milestone Badge Earned! 🏆
            </h2>
            <p className="text-lg font-medium text-purple-600 mb-2">
              {earnedBadgeMilestone?.title} Master
            </p>
            <p className="text-slate-500 mb-6">
              You've demonstrated excellence in {earnedBadgeMilestone?.title?.toLowerCase()}. 
              This badge is now displayed on your profile!
            </p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-800">
                    {earnedBadgeMilestone?.modules.length}
                  </p>
                  <p className="text-xs text-slate-500">Modules Completed</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {badgesEarned + 1}/{milestones.length}
                  </p>
                  <p className="text-xs text-slate-500">Badges Earned</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleBadgeCelebrationComplete}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Continue Journey
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage 4: Full Map Completion / Certificate Dialog */}
      <Dialog open={showFullMapCelebration || showCertificateDialog} onOpenChange={(open) => {
        setShowFullMapCelebration(open);
        setShowCertificateDialog(open);
      }}>
        <DialogContent className="max-w-2xl">
          <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-lg p-8 border-4 border-double border-amber-400">
            <div className="text-center space-y-4">
              {/* Trophy Animation */}
              <div className="relative inline-block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-amber-400/30 rounded-full animate-ping" />
                </div>
                <div className="relative p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-amber-600 font-semibold tracking-widest text-sm">
                  CULTURAL STAFFING SOLUTIONS
                </p>
                <h2 className="text-3xl font-bold text-slate-800 font-montserrat">
                  Cultural Intelligence Certificate
                </h2>
                <p className="text-slate-500">CPD Accredited</p>
              </div>

              <div className="py-6 space-y-2">
                <p className="text-lg text-slate-600">This is to certify that</p>
                <p className="text-2xl font-bold text-slate-800">Healthcare Professional</p>
                <p className="text-lg text-slate-600">has successfully completed the</p>
                <p className="text-xl font-semibold text-amber-600">Cultural Journey Map Programme</p>
              </div>

              <div className="flex justify-center gap-6 py-4">
                <div className="text-center">
                  <p className="text-sm text-slate-500">Stamps Collected</p>
                  <p className="text-2xl font-bold text-slate-800">{totalStamps}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500">Badges Earned</p>
                  <p className="text-2xl font-bold text-purple-600">{milestones.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500">Date Achieved</p>
                  <p className="text-lg font-bold text-slate-800">
                    {new Date().toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 py-4">
                {milestones.map(m => (
                  <div 
                    key={m.id}
                    className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium flex items-center gap-1"
                  >
                    <Medal className="h-3 w-3" />
                    {m.title}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-amber-200">
                <p className="text-xs text-slate-400">
                  Certificate ID: CIC-{Date.now().toString(36).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => {
              setShowFullMapCelebration(false);
              setShowCertificateDialog(false);
            }}>
              Close
            </Button>
            <Button className="flex-1 bg-gradient-gold text-css-black hover:bg-css-gold">
              Download Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Milestone Detail Dialog */}
      <Dialog open={!!selectedMilestone && !showStampCelebration} onOpenChange={() => setSelectedMilestone(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedMilestone && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={cn(
                      "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                      selectedMilestone.bgGradient
                    )}>
                      <selectedMilestone.icon className="h-6 w-6 text-white" />
                    </div>
                    {selectedMilestone.badgeEarned && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                        <Medal className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedMilestone.title}</DialogTitle>
                    <DialogDescription>{selectedMilestone.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {selectedMilestone.modules.map((module) => (
                  <Card 
                    key={module.id}
                    className={cn(
                      "transition-all",
                      module.completed 
                        ? "border-amber-300 bg-amber-50/50" 
                        : "hover:border-slate-300"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0",
                          module.completed
                            ? "bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 shadow-md"
                            : "bg-slate-100 border-2 border-dashed border-slate-300"
                        )}>
                          {module.completed ? module.stampImage : "❓"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{module.title}</h4>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                            </div>
                            {module.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                            ) : (
                              <Lock className="h-5 w-5 text-slate-300 shrink-0" />
                            )}
                          </div>
                          
                          {module.completed && (
                            <div className="flex gap-2 mt-3">
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-purple-50 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100"
                                onClick={() => {
                                  setSelectedModule(module);
                                  setShowInsightDialog(true);
                                }}
                              >
                                <Lightbulb className="h-3 w-3 mr-1" />
                                View Insight
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                                onClick={() => {
                                  setSelectedModule(module);
                                  setShowInsightDialog(true);
                                }}
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                View Pro Tip
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Complete Button */}
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {module.completed ? "Completed ✓" : "Click to complete module"}
                        </span>
                        {!module.completed && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              completeModule(selectedMilestone.id, module.id);
                            }}
                          >
                            <Sparkles className="mr-1 h-4 w-4" />
                            Complete Module
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Insight & Pro Tip Dialog */}
      <Dialog open={showInsightDialog} onOpenChange={setShowInsightDialog}>
        <DialogContent className="max-w-lg">
          {selectedModule && selectedModule.completed && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-md">
                    {selectedModule.stampImage}
                  </div>
                  <div>
                    <DialogTitle>{selectedModule.title}</DialogTitle>
                    <DialogDescription>Stamp Collected!</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Cultural Insight */}
                {selectedModule.culturalInsight && (
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
                        <Lightbulb className="h-4 w-4" />
                        Cultural Insight
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700">{selectedModule.culturalInsight}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Pro Tip */}
                {selectedModule.proTip && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                        <BookOpen className="h-4 w-4" />
                        Pro Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700">{selectedModule.proTip}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Button 
                onClick={() => setShowInsightDialog(false)}
                className="w-full mt-4"
              >
                Continue Journey
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CulturalJourneyMap;
