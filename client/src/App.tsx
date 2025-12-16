// client/src/App.tsx

import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import ScrollToTopButton from "@/components/ScrollToTopButton";

// Public pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Projects from "@/pages/projects";
import ProgramsPage from "@/pages/programs";
import ProgramDetail from "@/pages/program-detail";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import EventsPage from "@/pages/events";
import NotFound from "@/pages/not-found";

// Payment / receipt page
import PaymentSuccess from "@/pages/payment-success";

// Admin pages
import AdminDashboard from "@/pages/admin-dashboard";
import AdminPrograms from "@/pages/admin-programs";
import AdminBlog from "@/pages/admin-blog";
import AdminLogin from "@/pages/admin-login";
import AdminAbout from "@/pages/admin-about";
import AdminProjects from "@/pages/admin-projects";
import AdminSettings from "@/pages/admin-settings";
import AdminContacts from "@/pages/admin-contacts";
import AdminPayments from "@/pages/admin-payments";
import AdminStories from "@/pages/admin-stories";
import AdminTrustees from "@/pages/admin-trustees";
import AdminEvents from "@/pages/admin-events";

// Auth
import { AuthProvider } from "@/lib/auth";
import { RequireAuth } from "@/components/RequireAuth";

// Scroll to top on route change
function ScrollToTopOnRouteChange() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTopOnRouteChange />

      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/events" component={EventsPage} />
        <Route path="/blog" component={Blog} />
        <Route path="/contact" component={Contact} />

        {/* Programs list & detail */}
        <Route path="/programs" component={ProgramsPage} />
        <Route path="/programs/:id">
          {(params) => <ProgramDetail id={params.id} />}
        </Route>

        {/* Payment success / invoice page */}
        <Route path="/payment-success" component={PaymentSuccess} />

        {/* Admin Login (Public) */}
        <Route path="/admin/login" component={AdminLogin} />

        {/* Protected Admin Routes */}
        <Route path="/admin">
          {() => (
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/messages">
          {() => (
            <RequireAuth>
              <AdminContacts />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/payments">
          {() => (
            <RequireAuth>
              <AdminPayments />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/programs">
          {() => (
            <RequireAuth>
              <AdminPrograms />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/blog">
          {() => (
            <RequireAuth>
              <AdminBlog />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/about">
          {() => (
            <RequireAuth>
              <AdminAbout />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/projects">
          {() => (
            <RequireAuth>
              <AdminProjects />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/settings">
          {() => (
            <RequireAuth>
              <AdminSettings />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/stories">
          {() => (
            <RequireAuth>
              <AdminStories />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/trustees">
          {() => (
            <RequireAuth>
              <AdminTrustees />
            </RequireAuth>
          )}
        </Route>

        <Route path="/admin/events">
          {() => (
            <RequireAuth>
              <AdminEvents />
            </RequireAuth>
          )}
        </Route>

        {/* 404 Page */}
        <Route component={NotFound} />
      </Switch>

      <ScrollToTopButton />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
