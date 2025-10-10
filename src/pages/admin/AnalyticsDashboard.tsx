/**
 * Healthcare Workforce Analytics Dashboard
 *
 * Comprehensive analytics dashboard for monitoring:
 * - Performance metrics & KPIs
 * - Training effectiveness
 * - Skill gap analysis
 * - Sentiment analysis & employee wellbeing
 * - Retention prediction & risk management
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
  Brain,
  Heart,
  Zap,
  Shield,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Mock data generator for demonstration (replace with actual API calls)
const generateMockData = () => {
  return {
    overview: {
      totalStaff: 248,
      onboardingActive: 34,
      averageCompletion: 78,
      atRiskCount: 12,
    },
    trainingMetrics: [
      { month: 'Jan', completion: 65, engagement: 72, proficiency: 58 },
      { month: 'Feb', completion: 70, engagement: 75, proficiency: 64 },
      { month: 'Mar', completion: 75, engagement: 78, proficiency: 68 },
      { month: 'Apr', completion: 78, engagement: 82, proficiency: 72 },
      { month: 'May', completion: 82, engagement: 85, proficiency: 76 },
      { month: 'Jun', completion: 85, engagement: 88, proficiency: 80 },
    ],
    skillGaps: [
      { skill: 'Patient Safety', current: 75, target: 95, priority: 'high' },
      { skill: 'Documentation', current: 82, target: 95, priority: 'medium' },
      { skill: 'Emergency Response', current: 68, target: 90, priority: 'high' },
      { skill: 'Medication Admin', current: 88, target: 95, priority: 'low' },
      { skill: 'Cultural Competency', current: 72, target: 85, priority: 'medium' },
    ],
    sentimentData: {
      overall: 7.8,
      trend: 'up',
      categories: [
        { subject: 'Work Environment', score: 85 },
        { subject: 'Management', score: 78 },
        { subject: 'Work-Life Balance', score: 72 },
        { subject: 'Career Growth', score: 68 },
        { subject: 'Team Collaboration', score: 88 },
        { subject: 'Training Quality', score: 82 },
      ],
    },
    retentionRisk: [
      { name: 'Low Risk', value: 186, percentage: 75 },
      { name: 'Medium Risk', value: 50, percentage: 20 },
      { name: 'High Risk', value: 12, percentage: 5 },
    ],
    recentAlerts: [
      {
        id: 1,
        type: 'warning',
        message: '12 staff members showing early burnout indicators',
        timestamp: '2 hours ago',
      },
      {
        id: 2,
        type: 'info',
        message: 'Q2 training completion rate exceeded target by 8%',
        timestamp: '5 hours ago',
      },
      {
        id: 3,
        type: 'critical',
        message: '3 high-performers at risk of leaving within 90 days',
        timestamp: '1 day ago',
      },
    ],
  };
};

const AnalyticsDashboard: React.FC = () => {
  const [data] = useState(generateMockData());
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  useEffect(() => {
    document.title = 'Analytics Dashboard | Cultural Staffing Solutions';
  }, []);

  // Metric card component
  const MetricCard: React.FC<{
    title: string;
    value: number | string;
    change?: number;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    suffix?: string;
  }> = ({ title, value, change, icon: Icon, trend, suffix = '' }) => (
    <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6 hover:shadow-neumorphic-hover transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-css-grey-light shadow-neumorphic-inset flex items-center justify-center">
          <Icon className="w-6 h-6 text-css-gold" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-css-charcoal mb-1">
        {value}
        {suffix}
      </h3>
      <p className="text-sm text-css-grey-dark">{title}</p>
    </div>
  );

  // Alert item component
  const AlertItem: React.FC<{ alert: any }> = ({ alert }) => {
    const iconMap = {
      critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
      warning: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      info: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    };

    const { icon: Icon, color, bg } = iconMap[alert.type as keyof typeof iconMap];

    return (
      <div className={`${bg} rounded-lg p-4 flex items-start gap-3`}>
        <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-css-charcoal">{alert.message}</p>
          <p className="text-xs text-css-grey-dark mt-1">{alert.timestamp}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-css-grey-light p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-css-charcoal mb-2">
              Healthcare Workforce Analytics
            </h1>
            <p className="text-css-grey-dark">
              Performance monitoring, skill gap analysis & retention insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-css-grey-light rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 text-css-gold ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-semibold text-css-charcoal">
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </span>
            </button>
            <div className="px-4 py-2 bg-css-grey-light rounded-lg shadow-neumorphic">
              <span className="text-sm text-css-grey-dark">Last updated: </span>
              <span className="text-sm font-semibold text-css-charcoal">Just now</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-css-grey">
          {['overview', 'training', 'skills', 'sentiment', 'retention'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'text-css-gold border-b-2 border-css-gold'
                  : 'text-css-grey-dark hover:text-css-charcoal'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Staff"
                value={data.overview.totalStaff}
                icon={Users}
                change={5.2}
                trend="up"
              />
              <MetricCard
                title="Active Onboarding"
                value={data.overview.onboardingActive}
                icon={BookOpen}
                change={12.3}
                trend="up"
              />
              <MetricCard
                title="Avg Completion Rate"
                value={data.overview.averageCompletion}
                suffix="%"
                icon={Target}
                change={3.8}
                trend="up"
              />
              <MetricCard
                title="At-Risk Staff"
                value={data.overview.atRiskCount}
                icon={AlertCircle}
                change={8.5}
                trend="down"
              />
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Training Progress Chart */}
              <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
                <h3 className="text-lg font-bold text-css-charcoal mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-css-gold" />
                  Training Progress Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trainingMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#F9FAFB',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completion"
                      stroke="#FFC107"
                      strokeWidth={2}
                      dot={{ fill: '#FFC107', r: 4 }}
                      name="Completion Rate"
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Engagement"
                    />
                    <Line
                      type="monotone"
                      dataKey="proficiency"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4 }}
                      name="Proficiency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sentiment Radar Chart */}
              <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
                <h3 className="text-lg font-bold text-css-charcoal mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-css-gold" />
                  Employee Sentiment Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={data.sentimentData.categories}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Sentiment Score"
                      dataKey="score"
                      stroke="#FFC107"
                      fill="#FFC107"
                      fillOpacity={0.5}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center mt-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-css-charcoal">
                      {data.sentimentData.overall}
                    </div>
                    <div className="text-sm text-css-grey-dark">Overall Score</div>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      data.sentimentData.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {data.sentimentData.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
              <h3 className="text-lg font-bold text-css-charcoal mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-css-gold" />
                AI-Powered Alerts & Insights
              </h3>
              <div className="space-y-3">
                {data.recentAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard
                title="Average Completion Time"
                value="18.5"
                suffix=" days"
                icon={Clock}
                change={12}
                trend="down"
              />
              <MetricCard
                title="Training Hours/Employee"
                value="42"
                suffix=" hrs"
                icon={BookOpen}
                change={8}
                trend="up"
              />
              <MetricCard
                title="Training ROI"
                value="3.2"
                suffix="x"
                icon={TrendingUp}
                change={15}
                trend="up"
              />
            </div>

            <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
              <h3 className="text-lg font-bold text-css-charcoal mb-4">
                Training Effectiveness Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.trainingMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F9FAFB',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="completion"
                    fill="#FFC107"
                    name="Completion Rate"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="engagement"
                    fill="#10b981"
                    name="Engagement Score"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="proficiency"
                    fill="#f59e0b"
                    name="Time to Proficiency"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
              <h3 className="text-lg font-bold text-css-charcoal mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-css-gold" />
                Skill Gap Analysis
              </h3>
              <div className="space-y-6">
                {data.skillGaps.map((skill, index) => {
                  const gap = skill.target - skill.current;

                  return (
                    <div key={index} className="bg-white rounded-lg shadow-neumorphic-inset p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-css-charcoal">{skill.skill}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              skill.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : skill.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {skill.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-css-grey-dark">Current</div>
                            <div className="text-lg font-bold text-css-charcoal">{skill.current}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-css-grey-dark">Target</div>
                            <div className="text-lg font-bold text-css-gold">{skill.target}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-css-grey-dark">Gap</div>
                            <div className="text-lg font-bold text-red-600">{gap}%</div>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-4 bg-css-grey rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-gold transition-all duration-500"
                          style={{ width: `${skill.current}%` }}
                        />
                        <div
                          className="absolute top-0 h-full border-r-2 border-red-500 transition-all duration-500"
                          style={{ left: `${skill.target}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-css-grey-dark">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sentiment Tab */}
        {activeTab === 'sentiment' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
                <h3 className="text-lg font-bold text-css-charcoal mb-4">
                  Sentiment Score Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.sentimentData.categories} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" domain={[0, 100]} stroke="#6B7280" />
                    <YAxis dataKey="subject" type="category" width={150} stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#FFC107" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
                <h3 className="text-lg font-bold text-css-charcoal mb-4">Key Insights</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-css-charcoal mb-1">
                          Strong Team Collaboration
                        </h4>
                        <p className="text-sm text-css-grey-dark">
                          Team collaboration scores are 88%, indicating excellent peer relationships
                          and communication.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-css-charcoal mb-1">
                          Work-Life Balance Needs Attention
                        </h4>
                        <p className="text-sm text-css-grey-dark">
                          Sentiment analysis shows work-life balance at 72%. Consider flexible
                          scheduling options.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-css-charcoal mb-1">
                          Career Growth Opportunities
                        </h4>
                        <p className="text-sm text-css-grey-dark">
                          Career growth sentiment at 68%. Implement mentorship programs and clear
                          advancement paths.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Retention Tab */}
        {activeTab === 'retention' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {data.retentionRisk.map((risk, index) => (
                <div key={index} className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-css-charcoal">{risk.name}</h3>
                    <Shield
                      className={`w-6 h-6 ${
                        risk.name === 'Low Risk'
                          ? 'text-green-600'
                          : risk.name === 'Medium Risk'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div className="text-3xl font-bold text-css-charcoal mb-2">{risk.value}</div>
                  <div className="text-sm text-css-grey-dark">
                    Staff Members ({risk.percentage}%)
                  </div>
                  <div className="mt-4 h-2 bg-css-grey rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        risk.name === 'Low Risk'
                          ? 'bg-green-500'
                          : risk.name === 'Medium Risk'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${risk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-css-grey-light rounded-xl shadow-neumorphic p-6">
              <h3 className="text-lg font-bold text-css-charcoal mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-css-gold" />
                Predictive Retention Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-css-charcoal mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    High-Risk Indicators Detected
                  </h4>
                  <ul className="space-y-2 text-sm text-css-grey-dark">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>
                        3 high-performers showing decreased engagement (predicted 90-day exit risk:
                        78%)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>
                        9 staff members with overtime exceeding 20hrs/month for 3+ months
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Recent sentiment drop of 15% in Emergency Department team</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-css-charcoal mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    AI-Recommended Interventions
                  </h4>
                  <ul className="space-y-2 text-sm text-css-grey-dark">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Schedule 1:1 meetings with at-risk high-performers this week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Implement shift rotation policy to reduce overtime burden</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Deploy targeted wellness program for Emergency Department</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
