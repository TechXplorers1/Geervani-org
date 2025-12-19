import { useQuery } from "@tanstack/react-query";
import { getPrograms, getBlogPosts, getStaff, getProjects, getContactMessages, getDonations } from "@/lib/rtdb";
import type { Program, Project, BlogPost, Staff } from "@shared/schema";
import { ContactMessage, Donation } from "@shared/schema";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: programs, isLoading: isProgramsLoading, error: programsError } =
    useQuery<Program[]>({
      queryKey: ["programs"],
      queryFn: getPrograms,
    });

  const { data: blogPosts, isLoading: isBlogLoading, error: blogError } =
    useQuery<BlogPost[]>({
      queryKey: ["blog-posts"],
      queryFn: getBlogPosts,
    });

  const { data: staff, isLoading: isStaffLoading, error: staffError } =
    useQuery<Staff[]>({
      queryKey: ["staff"],
      queryFn: getStaff,
    });

  const { data: projects, isLoading: isProjectsLoading, error: projectsError } =
    useQuery<Project[]>({
      queryKey: ["projects"],
      queryFn: getProjects,
    });

  const { data: messages, isLoading: isMessagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["contact-messages"],
    queryFn: getContactMessages,
  });

  const { data: donations, isLoading: isDonationsLoading } = useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: getDonations,
  });

  const totalPrograms = programs?.length ?? 0;
  const totalBlogPosts = blogPosts?.length ?? 0;
  const totalStaff = staff?.length ?? 0;
  const totalProjects = projects?.length ?? 0;
  const totalMessages = messages?.length ?? 0;
  const totalDonations = donations?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;

  return (
    <AdminLayout>
      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Donations"
          value={isDonationsLoading ? undefined : `₹${totalDonations.toLocaleString()}`}
          description={`${donations?.length ?? 0} contributions`}
        />
        <StatCard
          label="Messages"
          value={isMessagesLoading ? undefined : totalMessages.toString()}
          description="Contact form submissions"
        />
        <StatCard
          label="Programs"
          value={isProgramsLoading ? undefined : totalPrograms.toString()}
          description="Active community programs"
        />
        <StatCard
          label="Projects"
          value={isProjectsLoading ? undefined : totalProjects.toString()}
          description="Ongoing & completed projects"
        />
        <StatCard
          label="Blog Posts"
          value={isBlogLoading ? undefined : totalBlogPosts.toString()}
          description="Stories & insights published"
        />
        <StatCard
          label="Team Members"
          value={isStaffLoading ? undefined : totalStaff.toString()}
          description="Active staff members"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Recent Programs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              Recent Programs
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/admin/programs">
                <span className="flex items-center">
                  View all
                  <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isProgramsLoading ? (
              <SkeletonList />
            ) : programsError ? (
              <p className="text-sm text-destructive">
                Failed to load programs.
              </p>
            ) : programs && programs.length > 0 ? (
              <ul className="space-y-3">
                {programs.slice(0, 5).map((program) => (
                  <li
                    key={program.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{program.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {program.category}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No programs found yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              Recent Blog Posts
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/admin/blog">
                <span className="flex items-center">
                  View all
                  <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isBlogLoading ? (
              <SkeletonList />
            ) : blogError ? (
              <p className="text-sm text-destructive">Failed to load blog.</p>
            ) : blogPosts && blogPosts.length > 0 ? (
              <ul className="space-y-3">
                {blogPosts.slice(0, 5).map((post) => (
                  <li
                    key={post.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium line-clamp-1">{post.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No blog posts yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Staff */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              Recent Staff
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/admin/staff">
                <span className="flex items-center">
                  View all
                  <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isStaffLoading ? (
              <SkeletonList />
            ) : staffError ? (
              <p className="text-sm text-destructive">
                Failed to load staff data.
              </p>
            ) : staff && staff.length > 0 ? (
              <ul className="space-y-3">
                {staff.slice(0, 5).map((member) => (
                  <li key={member.id} className="text-sm">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No staff members yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              Recent Projects
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/admin/projects">
                <span className="flex items-center">
                  View all
                  <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isProjectsLoading ? (
              <SkeletonList />
            ) : projectsError ? (
              <p className="text-sm text-destructive">
                Failed to load projects.
              </p>
            ) : projects && projects.length > 0 ? (
              <ul className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id} className="text-sm">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {project.category}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No projects created yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value?: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {value === undefined ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-heading font-bold">{value}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
