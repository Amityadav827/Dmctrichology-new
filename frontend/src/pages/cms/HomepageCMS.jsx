import React, { useState, lazy, Suspense } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Activity,
  Star,
  Scissors,
  CalendarCheck,
  Layers,
  FileText,
  List,
  HelpCircle,
  Globe,
  PlayCircle,
  Users,
  FlaskConical,
  Home,
  Type,
} from "lucide-react";

// Lazy-load each section's CMS form to keep initial bundle small
const HeroCMS = lazy(() => import("./HeroCMS"));
const HomepageAboutUsCMS = lazy(() => import("./HomepageAboutUsCMS"));
const MarqueeFeaturesCMS = lazy(() => import("./MarqueeFeaturesCMS"));
const WhyChooseUsCMS = lazy(() => import("./WhyChooseUsCMS"));
const SurgeonsCMS = lazy(() => import("./SurgeonsCMS"));
const ConsultationCMS = lazy(() => import("./ConsultationCMS"));
const GradeSliderCMS = lazy(() => import("./GradeSliderCMS"));
const TreatmentPlanCMS = lazy(() => import("./TreatmentPlanCMS"));
const WhyChooseDMCCMS = lazy(() => import("./WhyChooseDMCCMS"));
const ResultsSliderCMS = lazy(() => import("./ResultsSliderCMS"));
const ReviewsCMS = lazy(() => import("./ReviewsCMS"));
const FaqCMS = lazy(() => import("./FaqCMS"));
const PressMediaCMS = lazy(() => import("./PressMediaCMS"));
const VirtualTourCMS = lazy(() => import("./VirtualTourCMS"));
const InfluencerCMS = lazy(() => import("./InfluencerCMS"));
const BlogsHomeCMS = lazy(() => import("./BlogsHomeCMS"));

const TABS = [
  { id: "hero", label: "Hero Banner", icon: ImageIcon, Component: HeroCMS },
  { id: "welcome", label: "Welcome Section", icon: Type, Component: HomepageAboutUsCMS },
  { id: "marquee", label: "Marquee", icon: Activity, Component: MarqueeFeaturesCMS },
  { id: "why-choose-us", label: "Why Choose Us", icon: Star, Component: WhyChooseUsCMS },
  { id: "surgeons", label: "Surgeons", icon: Scissors, Component: SurgeonsCMS },
  { id: "consultation", label: "Consultation", icon: CalendarCheck, Component: ConsultationCMS },
  { id: "grades", label: "Grade Slider", icon: Layers, Component: GradeSliderCMS },
  { id: "treatment", label: "Treatment Plan", icon: FileText, Component: TreatmentPlanCMS },
  { id: "why-dmc", label: "Why DMC", icon: Star, Component: WhyChooseDMCCMS },
  { id: "results", label: "Results Slider", icon: List, Component: ResultsSliderCMS },
  { id: "reviews", label: "Reviews", icon: Star, Component: ReviewsCMS },
  { id: "faq", label: "FAQ", icon: HelpCircle, Component: FaqCMS },
  { id: "press", label: "Press & Media", icon: Globe, Component: PressMediaCMS },
  { id: "tour", label: "Virtual Tour", icon: PlayCircle, Component: VirtualTourCMS },
  { id: "influencers", label: "Influencers", icon: Users, Component: InfluencerCMS },
  { id: "blogs", label: "Blog Section", icon: FileText, Component: BlogsHomeCMS },
];

export default function HomepageCMS() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("section") || "hero";
  });

  const handleTabChange = (id) => {
    setActiveTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    window.history.replaceState({}, "", url);
  };

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Home className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Homepage Editor</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">All sections in one place</p>
          </div>
        </div>

        {/* Tab navigation — horizontal scroll on mobile */}
        <div className="max-w-[1600px] mx-auto border-t border-slate-100 bg-white">
          <div className="flex items-center overflow-x-auto scrollbar-hide px-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-[11px] font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content — renders the existing CMS component for the active section */}
      <div className="pt-2">
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          }
        >
          {ActiveComponent && <ActiveComponent />}
        </Suspense>
      </div>
    </div>
  );
}
