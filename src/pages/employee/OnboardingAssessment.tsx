/**
 * Onboarding Assessment Flow
 *
 * Multi-step assessment for new employees covering:
 * - Role identification
 * - Cultural competency
 * - Skills gap analysis
 * - Learning preferences
 * - Sentiment analysis
 *
 * Uses adaptive learning path generation, cultural customization, and comprehensive analytics tracking
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Users,
  Target,
  Brain,
  Award,
  Globe,
  Stethoscope,
  UserCog,
  FileText,
  RotateCcw,
  Save,
  Heart,
  Smile,
  Meh,
  Frown,
  HeartCrack,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAssessmentPersistence, useAutoSaveAssessment } from '@/hooks/useAssessmentPersistence';
import { useAssessmentSubmission } from '@/hooks/useAssessmentData';
import { trackInteraction as trackAnalyticsInteraction } from '@/services/analyticsService';
import type {
  AssessmentStepId,
  AssessmentState,
  AssessmentProgress,
  UserRole,
  CountryOfOrigin,
  SkillLevel,
  LearningStyle,
  CulturalBackground,
  LearningPreferences,
} from '@/types/assessment';

// ============================================================================
// Analytics Types
// ============================================================================

interface AnalyticsData {
  sessionStart: string;
  timePerStep: Record<string, number>;
  interactions: Array<{
    timestamp: string;
    eventType: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, any>;
  }>;
  completionMetrics?: {
    totalTimeMinutes: number;
    averageTimePerStep: number;
    engagementScore: number;
    completionRate: number;
    skillProficiency: number;
  };
}

interface SentimentData {
  overallFeeling: number; // 1-5 scale
  confidence: number; // 1-5 scale
  openFeedback: string;
  topPriority: string;
}

// ============================================================================
// Component State & Configuration
// ============================================================================

const ASSESSMENT_STEPS: Array<{
  id: AssessmentStepId | 'sentiment';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  order: number;
}> = [
  {
    id: 'welcome',
    title: 'Welcome',
    subtitle: 'Get started with your personalized assessment',
    icon: <img src="/clinify-ai-logo.png" alt="Clinify AI" className="w-6 h-6 object-contain" />,
    order: 0,
  },
  {
    id: 'role',
    title: 'Your Role',
    subtitle: 'Tell us about your professional background',
    icon: <Stethoscope className="w-6 h-6" />,
    order: 1,
  },
  {
    id: 'cultural',
    title: 'Cultural Background',
    subtitle: 'Help us personalize your learning journey',
    icon: <Globe className="w-6 h-6" />,
    order: 2,
  },
  {
    id: 'skills',
    title: 'Skills Assessment',
    subtitle: 'Identify your strengths and growth areas',
    icon: <Target className="w-6 h-6" />,
    order: 3,
  },
  {
    id: 'learning-style',
    title: 'Learning Preferences',
    subtitle: 'Customize your learning experience',
    icon: <Brain className="w-6 h-6" />,
    order: 4,
  },
  {
    id: 'sentiment',
    title: 'Your Feelings',
    subtitle: 'Help us understand your expectations',
    icon: <Heart className="w-6 h-6" />,
    order: 5,
  },
  {
    id: 'results',
    title: 'Your Learning Path',
    subtitle: 'Review your personalized recommendations',
    icon: <Award className="w-6 h-6" />,
    order: 6,
  },
];

const OnboardingAssessment: React.FC = () => {
  // ========================================================================
  // Hooks
  // ========================================================================

  const navigate = useNavigate();

  // ========================================================================
  // State Management
  // ========================================================================

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    progress: {
      currentStep: 'welcome',
      completedSteps: [],
      totalSteps: ASSESSMENT_STEPS.length,
      percentComplete: 0,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    answers: new Map(),
  });

  // Step-specific state
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [culturalBackground, setCulturalBackground] = useState<Partial<CulturalBackground>>({});
  const [skillRatings, setSkillRatings] = useState<Map<string, SkillLevel>>(new Map());
  const [learningPreferences, setLearningPreferences] = useState<Partial<LearningPreferences>>({});
  const [sentimentData, setSentimentData] = useState<SentimentData>({
    overallFeeling: 3,
    confidence: 3,
    openFeedback: '',
    topPriority: '',
  });

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    sessionStart: new Date().toISOString(),
    timePerStep: {},
    interactions: [],
  });
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

  // Persistence hooks
  const { loadAssessmentState, clearAssessmentState, hasSavedAssessment, getLastSavedTime } = useAssessmentPersistence();
  const [hasLoadedSaved, setHasLoadedSaved] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // API submission hook
  const { submit: submitToAPI, submitting } = useAssessmentSubmission();

  const currentStep = ASSESSMENT_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === ASSESSMENT_STEPS.length - 1;

  // Auto-save assessment progress
  useAutoSaveAssessment(
    assessmentState,
    selectedRole || undefined,
    culturalBackground,
    skillRatings,
    learningPreferences,
    !isLastStep // Disable auto-save on results page
  );

  // ========================================================================
  // Document Title
  // ========================================================================

  useEffect(() => {
    document.title = 'Onboarding Assessment | Cultural Staffing Solutions';
  }, []);

  // ========================================================================
  // Load Saved Assessment on Mount
  // ========================================================================

  useEffect(() => {
    if (hasLoadedSaved) return;

    if (hasSavedAssessment()) {
      const lastSaved = getLastSavedTime();
      const timeSinceSave = lastSaved ? Date.now() - lastSaved.getTime() : 0;
      const hoursSinceSave = timeSinceSave / (1000 * 60 * 60);

      // Only show resume prompt if saved within last 7 days
      if (hoursSinceSave < 24 * 7) {
        setShowResumePrompt(true);
      } else {
        // Clear old save
        clearAssessmentState();
      }
    }

    setHasLoadedSaved(true);
  }, [hasLoadedSaved, hasSavedAssessment, getLastSavedTime, clearAssessmentState]);

  // ========================================================================
  // Resume Assessment Handler
  // ========================================================================

  const handleResumeAssessment = () => {
    const loaded = loadAssessmentState();

    if (loaded.state) {
      setAssessmentState(loaded.state);

      if (loaded.roleSelection) setSelectedRole(loaded.roleSelection);
      if (loaded.culturalBackground) setCulturalBackground(loaded.culturalBackground);
      if (loaded.skillRatings) setSkillRatings(loaded.skillRatings);
      if (loaded.learningPreferences) setLearningPreferences(loaded.learningPreferences);

      // Find step index from state
      const stepIndex = ASSESSMENT_STEPS.findIndex(s => s.id === loaded.state!.progress.currentStep);
      if (stepIndex >= 0) {
        setCurrentStepIndex(stepIndex);
      }

      setShowResumePrompt(false);
      toast.success('Assessment resumed from where you left off!');
    }
  };

  const handleStartFresh = () => {
    clearAssessmentState();
    setShowResumePrompt(false);
    toast.info('Starting a fresh assessment');
  };

  // ========================================================================
  // Analytics Tracking Helpers
  // ========================================================================

  const trackInteraction = (eventType: string, entityType: string, entityId?: string, metadata?: Record<string, any>) => {
    const interaction = {
      timestamp: new Date().toISOString(),
      eventType,
      entityType,
      entityId,
      metadata,
    };

    setAnalyticsData((prev) => ({
      ...prev,
      interactions: [...prev.interactions, interaction],
    }));

    // Also send to backend analytics service (fire and forget)
    trackAnalyticsInteraction({
      eventType,
      entityType,
      entityId,
      metadata,
    }).catch((err) => console.warn('Analytics tracking failed:', err));
  };

  const calculateCompletionMetrics = (): AnalyticsData['completionMetrics'] => {
    const totalTimeMinutes = (Date.now() - new Date(analyticsData.sessionStart).getTime()) / (1000 * 60);
    const stepCount = Object.keys(analyticsData.timePerStep).length;
    const averageTimePerStep = stepCount > 0 ? totalTimeMinutes / stepCount : 0;

    // Calculate engagement score based on interactions
    const interactionCount = analyticsData.interactions.length;
    const engagementScore = Math.min(100, Math.round((interactionCount / (stepCount || 1)) * 10));

    // Calculate completion rate
    const completionRate = Math.round((stepCount / ASSESSMENT_STEPS.length) * 100);

    // Calculate skill proficiency (average of skill ratings)
    const skillValues = Array.from(skillRatings.values());
    const skillProficiency = skillValues.length > 0
      ? Math.round((skillValues.reduce((a, b) => a + b, 0) / skillValues.length) * 20) // Convert 1-5 to 0-100
      : 0;

    return {
      totalTimeMinutes: Math.round(totalTimeMinutes * 100) / 100,
      averageTimePerStep: Math.round(averageTimePerStep * 100) / 100,
      engagementScore,
      completionRate,
      skillProficiency,
    };
  };

  // ========================================================================
  // Progress Tracking
  // ========================================================================

  useEffect(() => {
    const percentComplete = Math.round((currentStepIndex / ASSESSMENT_STEPS.length) * 100);
    setAssessmentState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentStep: currentStep.id as AssessmentStepId,
        percentComplete,
        lastUpdatedAt: new Date().toISOString(),
      },
    }));
  }, [currentStepIndex, currentStep.id]);

  // ========================================================================
  // Time Tracking per Step
  // ========================================================================

  useEffect(() => {
    // Record time spent on previous step when moving to next step
    setStepStartTime(Date.now());
    trackInteraction('step_view', 'assessment_step', currentStep.id, {
      stepIndex: currentStepIndex,
      stepTitle: currentStep.title,
    });
  }, [currentStepIndex]);

  useEffect(() => {
    return () => {
      // Record time when leaving step
      const timeSpent = (Date.now() - stepStartTime) / 1000; // seconds
      if (timeSpent > 1) { // Only record if spent meaningful time
        setAnalyticsData((prev) => ({
          ...prev,
          timePerStep: {
            ...prev.timePerStep,
            [currentStep.id]: timeSpent,
          },
        }));
      }
    };
  }, [currentStep.id, stepStartTime]);

  // ========================================================================
  // Navigation Handlers
  // ========================================================================

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields before continuing');
      return;
    }

    if (isLastStep) {
      handleSubmit();
      return;
    }

    // Mark step as completed
    setAssessmentState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        completedSteps: [...prev.progress.completedSteps, currentStep.id],
      },
    }));

    setCurrentStepIndex((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (isFirstStep) return;
    setCurrentStepIndex((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========================================================================
  // Validation
  // ========================================================================

  const validateCurrentStep = (): boolean => {
    switch (currentStep.id) {
      case 'welcome':
        return true;
      case 'role':
        return selectedRole !== null;
      case 'cultural':
        return !!(
          culturalBackground.countryOfOrigin &&
          culturalBackground.primaryLanguage &&
          culturalBackground.englishProficiency
        );
      case 'skills':
        return skillRatings.size >= 3; // At least 3 skills rated
      case 'learning-style':
        return !!(
          learningPreferences.primaryStyle &&
          learningPreferences.timeCommitment &&
          learningPreferences.notificationFrequency
        );
      case 'sentiment':
        return !!(sentimentData.topPriority); // At least top priority selected
      case 'results':
        return true;
      default:
        return false;
    }
  };

  // ========================================================================
  // Form Submission
  // ========================================================================

  const handleSubmit = async () => {
    if (submitting) return;

    try {
      toast.success('Assessment completed! Generating your personalized learning path...');

      // Calculate final completion metrics
      const completionMetrics = calculateCompletionMetrics();
      const finalAnalytics = {
        ...analyticsData,
        completionMetrics,
      };

      const finalState: AssessmentState = {
        ...assessmentState,
        role: selectedRole || undefined,
        culturalBackground: culturalBackground as CulturalBackground,
        learningPreferences: learningPreferences as LearningPreferences,
        progress: {
          ...assessmentState.progress,
          completedAt: new Date().toISOString(),
          percentComplete: 100,
        },
      };

      // Submit to backend API
      try {
        const response = await submitToAPI({
          role: selectedRole!,
          culturalBackground: culturalBackground as CulturalBackground,
          skillRatings: Object.fromEntries(skillRatings),
          learningPreferences: learningPreferences as LearningPreferences,
          sentimentData,
          analyticsData: finalAnalytics,
          assessmentState: finalState,
        });

        console.log('Assessment submitted successfully:', response);
        console.log('Analytics data:', finalAnalytics);

        // Clear saved assessment state after successful submission
        clearAssessmentState();

        // Redirect to learning path dashboard
        setTimeout(() => {
          toast.info('Redirecting to your personalized dashboard...');
          navigate('/employee/learning-path');
        }, 1500);
      } catch (apiError) {
        // If API fails, still save locally and redirect (graceful degradation)
        console.warn('API submission failed, using local storage:', apiError);
        console.log('Assessment completed (offline):', finalState);
        console.log('Analytics data (offline):', finalAnalytics);

        toast.info('Assessment saved locally. Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/employee/learning-path');
        }, 1500);
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      toast.error('Failed to save assessment. Please try again.');
    }
  };

  // ========================================================================
  // Step Renderers
  // ========================================================================

  const renderWelcomeStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-gradient-gold bg-opacity-10">
            <img src="/clinify-ai-logo.png" alt="Clinify AI" className="w-16 h-16 object-contain" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-css-charcoal">Welcome to Your Learning Journey</h2>
        <p className="text-lg text-css-grey-dark max-w-2xl mx-auto">
          This 15-minute assessment will help us create a personalized learning path tailored to
          your role, cultural background, and learning preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <NeumorphicCard className="text-center space-y-3">
          <Globe className="w-10 h-10 text-css-gold mx-auto" />
          <h3 className="font-semibold text-css-charcoal">Culturally Adaptive</h3>
          <p className="text-sm text-css-grey-dark">
            Content customized to your cultural background and experience
          </p>
        </NeumorphicCard>

        <NeumorphicCard className="text-center space-y-3">
          <Target className="w-10 h-10 text-css-gold mx-auto" />
          <h3 className="font-semibold text-css-charcoal">Skills-Based</h3>
          <p className="text-sm text-css-grey-dark">
            Focused on closing your specific knowledge gaps
          </p>
        </NeumorphicCard>

        <NeumorphicCard className="text-center space-y-3">
          <Brain className="w-10 h-10 text-css-gold mx-auto" />
          <h3 className="font-semibold text-css-charcoal">Your Learning Style</h3>
          <p className="text-sm text-css-grey-dark">
            Delivered in the format that works best for you
          </p>
        </NeumorphicCard>
      </div>

      <div className="bg-css-gold bg-opacity-10 border-l-4 border-css-gold p-4 rounded">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-css-gold flex-shrink-0 mt-0.5" />
          <div className="text-sm text-css-charcoal">
            <p className="font-semibold mb-1">Your privacy matters</p>
            <p className="text-css-grey-dark">
              Your assessment responses are confidential and used only to personalize your learning
              experience. You can retake this assessment anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoleStep = () => {
    const roles: Array<{ value: UserRole; label: string; icon: React.ReactNode; description: string }> = [
      {
        value: 'nurse',
        label: 'Registered Nurse',
        icon: <Stethoscope className="w-8 h-8" />,
        description: 'Clinical nursing roles in various specialties',
      },
      {
        value: 'physician',
        label: 'Physician',
        icon: <FileText className="w-8 h-8" />,
        description: 'Medical doctors and specialists',
      },
      {
        value: 'allied-health',
        label: 'Allied Health Professional',
        icon: <Users className="w-8 h-8" />,
        description: 'Therapists, technicians, and support staff',
      },
      {
        value: 'administrative',
        label: 'Administrative',
        icon: <UserCog className="w-8 h-8" />,
        description: 'Healthcare administration and management',
      },
      {
        value: 'other',
        label: 'Other Healthcare Role',
        icon: <BookOpen className="w-8 h-8" />,
        description: 'Other healthcare-related positions',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-css-charcoal">What is your primary role?</h2>
          <p className="text-css-grey-dark">
            This helps us customize the content and compliance requirements for your position
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                setSelectedRole(role.value);
                trackInteraction('role_select', 'user_role', role.value, { label: role.label });
              }}
              className={`
                p-6 rounded-xl text-left transition-all duration-200
                ${
                  selectedRole === role.value
                    ? 'bg-gradient-gold text-white shadow-neumorphic-pressed'
                    : 'bg-css-grey-light text-css-charcoal shadow-neumorphic hover:shadow-neumorphic-hover'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`
                  p-3 rounded-lg
                  ${selectedRole === role.value ? 'bg-white bg-opacity-20' : 'bg-css-gold bg-opacity-10'}
                `}
                >
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{role.label}</h3>
                  <p
                    className={`text-sm ${selectedRole === role.value ? 'text-white text-opacity-90' : 'text-css-grey-dark'}`}
                  >
                    {role.description}
                  </p>
                </div>
                {selectedRole === role.value && (
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCulturalStep = () => {
    const countries: Array<{ value: CountryOfOrigin; label: string }> = [
      { value: 'philippines', label: 'Philippines' },
      { value: 'india', label: 'India' },
      { value: 'nigeria', label: 'Nigeria' },
      { value: 'pakistan', label: 'Pakistan' },
      { value: 'other', label: 'Other' },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-css-charcoal">Tell us about your background</h2>
          <p className="text-css-grey-dark">
            We'll customize content to be culturally relevant and supportive
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Country of Origin */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Country of Origin *
            </label>
            <select
              value={culturalBackground.countryOfOrigin || ''}
              onChange={(e) =>
                setCulturalBackground((prev) => ({
                  ...prev,
                  countryOfOrigin: e.target.value as CountryOfOrigin,
                }))
              }
              className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-css-gold text-css-charcoal"
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </NeumorphicCard>

          {/* Primary Language */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Primary Language *
            </label>
            <input
              type="text"
              value={culturalBackground.primaryLanguage || ''}
              onChange={(e) =>
                setCulturalBackground((prev) => ({ ...prev, primaryLanguage: e.target.value }))
              }
              placeholder="e.g., Tagalog, Hindi, Igbo"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-css-gold text-css-charcoal"
            />
          </NeumorphicCard>

          {/* English Proficiency */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-css-charcoal">
                English Proficiency Level *
              </label>
              <span className="text-lg font-bold text-css-gold min-w-[2rem] text-center">
                {culturalBackground.englishProficiency || 3}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={culturalBackground.englishProficiency || 3}
                onChange={(e) =>
                  setCulturalBackground((prev) => ({
                    ...prev,
                    englishProficiency: parseInt(e.target.value) as SkillLevel,
                  }))
                }
                className="w-full h-2 bg-css-grey-light rounded-lg appearance-none cursor-pointer slider-gold"
                style={{
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((culturalBackground.englishProficiency || 3) - 1) / 4 * 100}%, #E5E7EB ${((culturalBackground.englishProficiency || 3) - 1) / 4 * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-css-grey-dark mt-2">
                <span>Basic</span>
                <span>Intermediate</span>
                <span>Native/Fluent</span>
              </div>
            </div>
          </NeumorphicCard>

          {/* Years in Target Country */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Years Working Internationally (Optional)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={culturalBackground.yearsInTargetCountry || ''}
              onChange={(e) =>
                setCulturalBackground((prev) => ({
                  ...prev,
                  yearsInTargetCountry: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-css-gold text-css-charcoal"
            />
          </NeumorphicCard>
        </div>
      </div>
    );
  };

  const renderSkillsStep = () => {
    const skillCategories = [
      { id: 'clinical', name: 'Clinical Skills', skills: ['Patient Assessment', 'Medication Administration', 'Wound Care'] },
      { id: 'technical', name: 'Technical Skills', skills: ['EHR Systems', 'Medical Equipment', 'Documentation'] },
      { id: 'communication', name: 'Communication', skills: ['Patient Communication', 'Team Collaboration', 'Cultural Sensitivity'] },
      { id: 'compliance', name: 'Compliance', skills: ['GDPR & Data Protection', 'Infection Control', 'Safety Protocols'] },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-css-charcoal">Rate your current skill levels</h2>
          <p className="text-css-grey-dark">
            Be honest - this helps us identify where you need the most support
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {skillCategories.map((category) => (
            <NeumorphicCard key={category.id} className="p-6 space-y-4">
              <h3 className="font-semibold text-lg text-css-charcoal flex items-center space-x-2">
                <Target className="w-5 h-5 text-css-gold" />
                <span>{category.name}</span>
              </h3>

              <div className="space-y-6">
                {category.skills.map((skill) => {
                  const currentRating = skillRatings.get(skill) || 3;
                  return (
                    <div key={skill} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-css-charcoal">{skill}</label>
                        <span className="text-lg font-bold text-css-gold min-w-[2rem] text-center">
                          {currentRating}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={currentRating}
                          onChange={(e) =>
                            setSkillRatings((prev) => {
                              const newMap = new Map(prev);
                              newMap.set(skill, parseInt(e.target.value) as SkillLevel);
                              return newMap;
                            })
                          }
                          className="w-full h-2 bg-css-grey-light rounded-lg appearance-none cursor-pointer slider-gold"
                          style={{
                            background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((currentRating - 1) / 4) * 100}%, #E5E7EB ${((currentRating - 1) / 4) * 100}%, #E5E7EB 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-css-grey-dark mt-2">
                          <span>Beginner</span>
                          <span>Intermediate</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </NeumorphicCard>
          ))}
          <p className="text-xs text-css-grey-dark text-center">
            1 = Beginner • 3 = Intermediate • 5 = Expert
          </p>
        </div>
      </div>
    );
  };

  const renderLearningStyleStep = () => {
    const learningStyles: Array<{ value: LearningStyle; label: string; description: string; icon: React.ReactNode }> =
      [
        {
          value: 'visual',
          label: 'Visual Learner',
          description: 'I learn best with diagrams, videos, and images',
          icon: <BookOpen className="w-6 h-6" />,
        },
        {
          value: 'auditory',
          label: 'Auditory Learner',
          description: 'I prefer listening to lectures and discussions',
          icon: <Users className="w-6 h-6" />,
        },
        {
          value: 'reading-writing',
          label: 'Reading/Writing',
          description: 'I learn through reading articles and taking notes',
          icon: <FileText className="w-6 h-6" />,
        },
        {
          value: 'kinesthetic',
          label: 'Hands-On Learner',
          description: 'I learn by doing and practicing',
          icon: <Target className="w-6 h-6" />,
        },
      ];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-css-charcoal">How do you learn best?</h2>
          <p className="text-css-grey-dark">
            We'll deliver content in formats that match your preferences
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Learning Style */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Primary Learning Style *
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {learningStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() =>
                    setLearningPreferences((prev) => ({ ...prev, primaryStyle: style.value }))
                  }
                  className={`
                    p-4 rounded-xl text-left transition-all
                    ${
                      learningPreferences.primaryStyle === style.value
                        ? 'bg-gradient-gold text-white shadow-neumorphic-pressed'
                        : 'bg-css-grey-light text-css-charcoal shadow-neumorphic hover:shadow-neumorphic-hover'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${learningPreferences.primaryStyle === style.value ? 'bg-white bg-opacity-20' : 'bg-css-gold bg-opacity-10'}`}
                    >
                      {style.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{style.label}</h4>
                      <p
                        className={`text-sm ${learningPreferences.primaryStyle === style.value ? 'text-white text-opacity-90' : 'text-css-grey-dark'}`}
                      >
                        {style.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Commitment */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Time Commitment per Week *
            </label>
            <select
              value={learningPreferences.timeCommitment || ''}
              onChange={(e) =>
                setLearningPreferences((prev) => ({
                  ...prev,
                  timeCommitment: e.target.value as 'light' | 'moderate' | 'intensive',
                }))
              }
              className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-css-gold text-css-charcoal"
            >
              <option value="">Select time commitment</option>
              <option value="light">Light (1-2 hours/week)</option>
              <option value="moderate">Moderate (3-5 hours/week)</option>
              <option value="intensive">Intensive (6+ hours/week)</option>
            </select>
          </NeumorphicCard>

          {/* Notification Frequency */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Reminder Frequency *
            </label>
            <select
              value={learningPreferences.notificationFrequency || ''}
              onChange={(e) =>
                setLearningPreferences((prev) => ({
                  ...prev,
                  notificationFrequency: e.target.value as 'daily' | 'weekly' | 'biweekly' | 'monthly',
                }))
              }
              className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-css-gold text-css-charcoal"
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </NeumorphicCard>
        </div>
      </div>
    );
  };

  const renderSentimentStep = () => {
    const sentimentEmojis = [
      { value: 1, icon: HeartCrack, label: 'Very Anxious', color: 'text-red-500' },
      { value: 2, icon: Frown, label: 'Concerned', color: 'text-orange-500' },
      { value: 3, icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
      { value: 4, icon: Smile, label: 'Optimistic', color: 'text-green-500' },
      { value: 5, icon: Heart, label: 'Very Excited', color: 'text-css-gold' },
    ];

    const priorities = [
      'Building clinical confidence',
      'Understanding cultural differences',
      'Learning healthcare systems',
      'Improving communication skills',
      'Meeting compliance requirements',
      'Getting certified quickly',
    ];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-css-charcoal">How are you feeling?</h2>
          <p className="text-css-grey-dark">
            Your honest feedback helps us provide better support
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Overall Feeling */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              How do you feel about starting this new role? *
            </label>
            <div className="grid grid-cols-5 gap-3">
              {sentimentEmojis.map((emoji) => {
                const Icon = emoji.icon;
                const isSelected = sentimentData.overallFeeling === emoji.value;
                return (
                  <button
                    key={emoji.value}
                    onClick={() => {
                      setSentimentData((prev) => ({ ...prev, overallFeeling: emoji.value }));
                      trackInteraction('sentiment_select', 'overall_feeling', String(emoji.value), {
                        label: emoji.label,
                      });
                    }}
                    className={`
                      p-4 rounded-xl flex flex-col items-center space-y-2 transition-all
                      ${
                        isSelected
                          ? 'bg-gradient-gold text-white shadow-neumorphic-pressed'
                          : 'bg-white shadow-neumorphic hover:shadow-neumorphic-hover'
                      }
                    `}
                  >
                    <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : emoji.color}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-css-grey-dark'}`}>
                      {emoji.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </NeumorphicCard>

          {/* Confidence Level */}
          <NeumorphicCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-css-charcoal">
                How confident do you feel about succeeding?
              </label>
              <span className="text-lg font-bold text-css-gold min-w-[2rem] text-center">
                {sentimentData.confidence}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={sentimentData.confidence}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setSentimentData((prev) => ({ ...prev, confidence: value }));
                  trackInteraction('sentiment_adjust', 'confidence_level', String(value));
                }}
                className="w-full h-2 bg-css-grey-light rounded-lg appearance-none cursor-pointer slider-gold"
                style={{
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((sentimentData.confidence - 1) / 4) * 100}%, #E5E7EB ${((sentimentData.confidence - 1) / 4) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-css-grey-dark mt-2">
                <span>Not at all</span>
                <span>Somewhat</span>
                <span>Very confident</span>
              </div>
            </div>
          </NeumorphicCard>

          {/* Top Priority */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              What's your top priority right now? *
            </label>
            <div className="space-y-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => {
                    setSentimentData((prev) => ({ ...prev, topPriority: priority }));
                    trackInteraction('priority_select', 'top_priority', priority);
                  }}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all
                    ${
                      sentimentData.topPriority === priority
                        ? 'bg-gradient-gold text-white shadow-neumorphic-pressed'
                        : 'bg-white shadow-neumorphic hover:shadow-neumorphic-hover text-css-charcoal'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{priority}</span>
                    {sentimentData.topPriority === priority && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </NeumorphicCard>

          {/* Open Feedback */}
          <NeumorphicCard className="p-6 space-y-4">
            <label className="block text-sm font-semibold text-css-charcoal">
              Any concerns or questions? (Optional)
            </label>
            <textarea
              value={sentimentData.openFeedback}
              onChange={(e) => {
                setSentimentData((prev) => ({ ...prev, openFeedback: e.target.value }));
                if (e.target.value.length % 50 === 0) { // Track every 50 chars
                  trackInteraction('feedback_input', 'open_feedback', undefined, {
                    length: e.target.value.length,
                  });
                }
              }}
              placeholder="Share anything that's on your mind..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-css-gold text-css-charcoal resize-none"
            />
          </NeumorphicCard>
        </div>
      </div>
    );
  };

  const renderResultsStep = () => {
    const metrics = calculateCompletionMetrics();

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-gradient-gold bg-opacity-10">
              <Award className="w-16 h-16 text-css-gold" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-css-charcoal">Congratulations! 🎉</h2>
          <p className="text-lg text-css-grey-dark max-w-2xl mx-auto">
            Your personalized learning path is ready. We've analyzed your responses and created a
            customized 90-day journey designed just for you.
          </p>
        </div>

        {/* Analytics Insights */}
        <div className="bg-css-gold bg-opacity-10 border-l-4 border-css-gold p-4 rounded">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-css-gold flex-shrink-0 mt-0.5" />
            <div className="text-sm text-css-charcoal">
              <p className="font-semibold mb-2">Assessment Insights</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-css-grey-dark">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-css-gold" />
                  <span>{metrics.totalTimeMinutes.toFixed(1)} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-css-gold" />
                  <span>{metrics.engagementScore}% engaged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-css-gold" />
                  <span>{metrics.skillProficiency}% proficiency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-css-gold" />
                  <span>{metrics.completionRate}% complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <NeumorphicCard className="p-6 text-center space-y-3">
            <div className="text-4xl font-bold text-css-gold">12</div>
            <p className="text-sm font-semibold text-css-charcoal">Recommended Courses</p>
            <p className="text-xs text-css-grey-dark">Tailored to your skill gaps</p>
          </NeumorphicCard>

          <NeumorphicCard className="p-6 text-center space-y-3">
            <div className="text-4xl font-bold text-css-gold">90</div>
            <p className="text-sm font-semibold text-css-charcoal">Day Learning Plan</p>
            <p className="text-xs text-css-grey-dark">Structured milestones</p>
          </NeumorphicCard>

          <NeumorphicCard className="p-6 text-center space-y-3">
            <div className="text-4xl font-bold text-css-gold">5</div>
            <p className="text-sm font-semibold text-css-charcoal">Priority Areas</p>
            <p className="text-xs text-css-grey-dark">Focus on what matters</p>
          </NeumorphicCard>
        </div>

      <NeumorphicCard className="p-6">
        <h3 className="font-semibold text-lg text-css-charcoal mb-4">Your Top Priority Areas</h3>
        <div className="space-y-3">
          {[
            'Cultural Competency in Healthcare Settings',
            'US Healthcare Documentation Standards',
            'Patient Communication Best Practices',
            'GDPR & Data Protection',
            'Electronic Health Records (EHR) Proficiency',
          ].map((area, index) => (
            <div key={area} className="flex items-center space-x-3 p-3 bg-css-grey-light rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <span className="text-css-charcoal">{area}</span>
            </div>
          ))}
        </div>
      </NeumorphicCard>

      <div className="bg-css-gold bg-opacity-10 border-l-4 border-css-gold p-4 rounded">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-css-gold flex-shrink-0 mt-0.5" />
          <div className="text-sm text-css-charcoal">
            <p className="font-semibold mb-1">What happens next?</p>
            <ul className="text-css-grey-dark space-y-1 list-disc list-inside">
              <li>Access your personalized dashboard with all recommended courses</li>
              <li>Receive regular check-ins and reminders based on your preferences</li>
              <li>Track your progress with 30, 60, and 90-day milestones</li>
              <li>Retake this assessment anytime to update your learning path</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 'welcome':
        return renderWelcomeStep();
      case 'role':
        return renderRoleStep();
      case 'cultural':
        return renderCulturalStep();
      case 'skills':
        return renderSkillsStep();
      case 'learning-style':
        return renderLearningStyleStep();
      case 'sentiment':
        return renderSentimentStep();
      case 'results':
        return renderResultsStep();
      default:
        return null;
    }
  };

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="min-h-screen bg-css-grey-light py-8 px-4">
      {/* Resume Assessment Prompt */}
      {showResumePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <NeumorphicCard className="max-w-md w-full p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-gold bg-opacity-10">
                  <RotateCcw className="w-12 h-12 text-css-gold" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-css-charcoal">Resume Your Assessment?</h2>
              <p className="text-css-grey-dark">
                We found a saved assessment in progress. Would you like to continue where you left
                off or start fresh?
              </p>
              {getLastSavedTime() && (
                <p className="text-sm text-css-grey">
                  Last saved: {getLastSavedTime()!.toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleResumeAssessment}
                className="w-full px-6 py-3 rounded-lg font-semibold bg-gradient-gold text-white shadow-neumorphic hover:shadow-neumorphic-hover transition-all flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Resume Assessment</span>
              </button>
              <button
                onClick={handleStartFresh}
                className="w-full px-6 py-3 rounded-lg font-semibold bg-white text-css-charcoal shadow-neumorphic hover:shadow-neumorphic-hover transition-all"
              >
                Start Fresh
              </button>
            </div>
          </NeumorphicCard>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Progress Header */}
        <NeumorphicCard className="p-6">
          <div className="space-y-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {ASSESSMENT_STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all
                        ${
                          index <= currentStepIndex
                            ? 'bg-gradient-gold text-white shadow-neumorphic-pressed'
                            : 'bg-white text-css-grey shadow-neumorphic'
                        }
                      `}
                    >
                      {index < currentStepIndex ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden md:block ${index <= currentStepIndex ? 'text-css-charcoal' : 'text-css-grey'}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < ASSESSMENT_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        index < currentStepIndex ? 'bg-gradient-gold' : 'bg-css-grey-light'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-css-charcoal font-medium">{currentStep.title}</span>
                <span className="text-css-grey-dark">
                  {assessmentState.progress.percentComplete}% Complete
                </span>
              </div>
              <div className="h-2 bg-white rounded-full shadow-neumorphic-inset overflow-hidden">
                <div
                  className="h-full bg-gradient-gold transition-all duration-500 ease-out"
                  style={{ width: `${assessmentState.progress.percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Main Content */}
        <NeumorphicCard className="p-8">
          {renderCurrentStep()}
        </NeumorphicCard>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className={`
              px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all
              ${
                isFirstStep
                  ? 'bg-css-grey-light text-css-grey cursor-not-allowed'
                  : 'bg-white text-css-charcoal shadow-neumorphic hover:shadow-neumorphic-hover'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!validateCurrentStep()}
            className={`
              px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all
              ${
                validateCurrentStep()
                  ? 'bg-gradient-gold text-white shadow-neumorphic hover:shadow-neumorphic-hover'
                  : 'bg-css-grey-light text-css-grey cursor-not-allowed'
              }
            `}
          >
            <span>{isLastStep ? 'View Dashboard' : 'Continue'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Reusable Components
// ============================================================================

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ children, className = '' }) => (
  <div className={`bg-css-grey-light rounded-xl shadow-neumorphic ${className}`}>
    {children}
  </div>
);

export default OnboardingAssessment;
