import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ServiceCategory from "./pages/ServiceCategory";
import SecondCategory from "./pages/SecondCategory";
import ServiceFAQ from "./pages/ServiceFAQ";
import ResultCategory from "./pages/ResultCategory";
import ResultInner from "./pages/ResultInner";
import VideoCategory from "./pages/VideoCategory";
import VideoInner from "./pages/VideoInner";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import UserList from "./pages/UserList";
import RoleList from "./pages/RoleList";
import PermissionMenu from "./pages/PermissionMenu";
import Menu from "./pages/Menu";
import Operation from "./pages/Operation";
import MenuOperation from "./pages/MenuOperation";
import Callback from "./pages/Callback";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import AppointmentList from "./pages/AppointmentList";
import Pages from "./pages/Pages";
import WebsiteSettings from "./pages/WebsiteSettings";
import TopBarCMS from "./pages/cms/TopBarCMS";
import HeaderCMS from "./pages/cms/HeaderCMS";
import FooterCMS from "./pages/cms/FooterCMS";
import ServiceHeroCMS from "./pages/cms/ServiceHeroCMS";
import ServiceCategoryCMS from "./pages/cms/ServiceCategoryCMS";
import ServiceListingCMS from "./pages/cms/ServiceListingCMS";
import HeroCMS from "./pages/cms/HeroCMS";
import PageCompositionEditor from "./pages/cms/PageCompositionEditor";
import AboutUsCMS from "./pages/cms/AboutUsCMS";
import ServicesCMS from "./pages/cms/ServicesCMS";
import MarqueeFeaturesCMS from "./pages/cms/MarqueeFeaturesCMS";
import WhyChooseUsCMS from "./pages/cms/WhyChooseUsCMS";
import ResultsSliderCMS from "./pages/cms/ResultsSliderCMS";
import GradeSliderCMS from "./pages/cms/GradeSliderCMS";
import WhyChooseDMCCMS from "./pages/cms/WhyChooseDMCCMS";
import SurgeonsCMS from "./pages/cms/SurgeonsCMS";
import ConsultationCMS from "./pages/cms/ConsultationCMS";
import ReviewsCMS from "./pages/cms/ReviewsCMS";
import TreatmentPlanCMS from "./pages/cms/TreatmentPlanCMS";
import FaqCMS from "./pages/cms/FaqCMS";
import BlogsHomeCMS from "./pages/cms/BlogsHomeCMS";
import PressMediaCMS from "./pages/cms/PressMediaCMS";
import VisualLiveBuilder from "./pages/cms/VisualLiveBuilder";
import DetailsBannerCMS from "./pages/cms/DetailsBannerCMS";
import ServiceIntroCMS from "./pages/cms/ServiceIntroCMS";
import ProcessSliderCMS from "./pages/cms/ProcessSliderCMS";
import BeforeAfterCMS from "./pages/cms/BeforeAfterCMS";
import FaqEnquiryCMS from "./pages/cms/FaqEnquiryCMS";
import IdealFrequencyCMS from "./pages/cms/IdealFrequencyCMS";
import ContactPageCMS from "./pages/cms/ContactPageCMS";
import BlogHeroCMS from "./pages/cms/BlogHeroCMS";
import ServiceDetailCMS from "./pages/cms/ServiceDetailCMS";
import Comments from "./pages/Comments";


import RedirectList from "./pages/RedirectList";
import SitemapManager from "./pages/SitemapManager";
import RobotsEditor from "./pages/RobotsEditor";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="cms/about-us"
          element={
            <ProtectedRoute permission="cms">
              <AboutUsCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/services"
          element={
            <ProtectedRoute permission="cms">
              <ServicesCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/marquee-features"
          element={
            <ProtectedRoute permission="cms">
              <MarqueeFeaturesCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/why-choose-us"
          element={
            <ProtectedRoute permission="cms">
              <WhyChooseUsCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/before-after-results"
          element={
            <ProtectedRoute permission="cms">
              <ResultsSliderCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/hair-transplant-grades"
          element={
            <ProtectedRoute permission="cms">
              <GradeSliderCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/why-choose-dmc"
          element={
            <ProtectedRoute permission="cms">
              <WhyChooseDMCCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/surgeons"
          element={
            <ProtectedRoute permission="cms">
              <SurgeonsCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/consultation"
          element={
            <ProtectedRoute permission="cms">
              <ConsultationCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/reviews"
          element={
            <ProtectedRoute permission="cms">
              <ReviewsCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/treatment-plan"
          element={
            <ProtectedRoute permission="cms">
              <TreatmentPlanCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/faq"
          element={
            <ProtectedRoute permission="cms">
              <FaqCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/blogs-home"
          element={
            <ProtectedRoute permission="cms">
              <BlogsHomeCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/press-media"
          element={
            <ProtectedRoute permission="cms">
              <PressMediaCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/footer"
          element={
            <ProtectedRoute permission="cms">
              <FooterCMS />
            </ProtectedRoute>
          }
        />
        <Route path="services" element={<Navigate to="/services/categories" replace />} />
        <Route path="results" element={<Navigate to="/results/categories" replace />} />
        <Route path="videos" element={<Navigate to="/videos/categories" replace />} />
        <Route path="users" element={<Navigate to="/users/list" replace />} />
        <Route path="menu" element={<Navigate to="/users/menus" replace />} />
        <Route path="contacts" element={<Navigate to="/leads/contact" replace />} />
        <Route path="appointment" element={<Navigate to="/leads/appointment" replace />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute permission="dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="seo/redirects"
          element={
            <ProtectedRoute permission="seo">
              <RedirectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="seo/sitemap"
          element={
            <ProtectedRoute permission="seo">
              <SitemapManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="seo/robots"
          element={
            <ProtectedRoute permission="seo">
              <RobotsEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/categories"
          element={
            <ProtectedRoute permission="services">
              <ServiceCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/second-categories"
          element={
            <ProtectedRoute permission="services">
              <SecondCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/faqs"
          element={
            <ProtectedRoute permission="services">
              <ServiceFAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="results/categories"
          element={
            <ProtectedRoute permission="result">
              <ResultCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="results/list"
          element={
            <ProtectedRoute permission="result">
              <ResultInner />
            </ProtectedRoute>
          }
        />
        <Route
          path="videos/categories"
          element={
            <ProtectedRoute permission="video">
              <VideoCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="videos/list"
          element={
            <ProtectedRoute permission="video">
              <VideoInner />
            </ProtectedRoute>
          }
        />
        <Route
          path="blogs"
          element={
            <ProtectedRoute permission="blog">
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="comments"
          element={
            <ProtectedRoute permission="blog">
              <Comments />
            </ProtectedRoute>
          }
        />
        <Route
          path="pages"
          element={
            <ProtectedRoute permission="cms">
              <Pages />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/topbar"
          element={
            <ProtectedRoute permission="cms">
              <TopBarCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/header"
          element={
            <ProtectedRoute permission="cms">
              <HeaderCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/footer"
          element={
            <ProtectedRoute permission="cms">
              <FooterCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/service-hero"
          element={
            <ProtectedRoute permission="cms">
              <ServiceHeroCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/service-categories"
          element={
            <ProtectedRoute permission="cms">
              <ServiceCategoryCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/service-listing"
          element={
            <ProtectedRoute permission="cms">
              <ServiceListingCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/details-banner"
          element={
            <ProtectedRoute permission="cms">
              <DetailsBannerCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/service-intro"
          element={
            <ProtectedRoute permission="cms">
              <ServiceIntroCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/process-slider"
          element={
            <ProtectedRoute permission="cms">
              <ProcessSliderCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/before-after"
          element={
            <ProtectedRoute permission="cms">
              <BeforeAfterCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/faq-enquiry"
          element={
            <ProtectedRoute permission="cms">
              <FaqEnquiryCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/ideal-frequency"
          element={
            <ProtectedRoute permission="cms">
              <IdealFrequencyCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/contact-page"
          element={
            <ProtectedRoute permission="cms">
              <ContactPageCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/blog-page"
          element={
            <ProtectedRoute permission="cms">
              <BlogHeroCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/service-details"
          element={
            <ProtectedRoute permission="cms">
              <ServiceDetailCMS />
            </ProtectedRoute>
          }
        />

        <Route
          path="cms/hero"
          element={
            <ProtectedRoute permission="cms">
              <HeroCMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/page-builder/:slug"
          element={
            <ProtectedRoute permission="cms">
              <PageCompositionEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms/visual-builder/:slug"
          element={
            <ProtectedRoute permission="cms">
              <VisualLiveBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="gallery"
          element={
            <ProtectedRoute permission="gallery">
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="testimonials"
          element={
            <ProtectedRoute permission="testimonial">
              <Testimonials />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/list"
          element={
            <ProtectedRoute permission="users">
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/roles"
          element={
            <ProtectedRoute permission="users">
              <RoleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/permissions"
          element={
            <ProtectedRoute permission="users">
              <PermissionMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/menus"
          element={
            <ProtectedRoute permission="users">
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/operations"
          element={
            <ProtectedRoute permission="users">
              <Operation />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/menu-operations"
          element={
            <ProtectedRoute permission="users">
              <MenuOperation />
            </ProtectedRoute>
          }
        />
        <Route
          path="leads/callback"
          element={
            <ProtectedRoute permission="users">
              <Callback />
            </ProtectedRoute>
          }
        />
        <Route
          path="leads/contact"
          element={
            <ProtectedRoute permission="users">
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings/website"
          element={
            <ProtectedRoute permission="cms">
              <WebsiteSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="leads/appointment"
          element={
            <ProtectedRoute permission="users">
              <AppointmentList />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
