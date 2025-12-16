import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Program } from "@shared/schema";
import { Link } from "wouter"; // 👈 added

// ✅ Swiper core styles (needed!)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Update to new Indian-style hero images
const heroImage1 = "/images/hero_indian_women_empowerment_v2.png";
const heroImage2 = "/images/hero_indian_community_health_v2.png";
const heroImage3 = "/images/hero_indian_youth_education_v2.png";

// map DB program titles → hero images
const programHeroImages: Record<string, string> = {
  "Women's Economic Empowerment": heroImage1,
  "Community Health Initiatives": heroImage2,
  "Youth Development & Education": heroImage3,
};

// fallback slides if API not loaded yet / empty
const fallbackSlides = [
  {
    title: "Empowering Communities",
    subtitle:
      "Building a future of gender equality and sustainable development across India",
    image: heroImage1,
    programPath: "/programs",
  },
  {
    title: "Community Health & Well-being",
    subtitle:
      "Creating opportunities and ensuring access to essential healthcare in every community",
    image: heroImage2,
    programPath: "/programs",
  },
  {
    title: "Youth Development",
    subtitle:
      "Investing in the next generation through education and skills training",
    image: heroImage3,
    programPath: "/programs",
  },
];

export default function HeroCarousel() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // 🔹 Load real programs from API (same data ProgramDetail uses)
  const { data: programs } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // build hero slides from programs if available
  const programSlides =
    programs && programs.length > 0
      ? programs.slice(0, 3).map((program) => ({
        title: program.title,
        subtitle: program.description,
        image: program.image || programHeroImages[program.title] || heroImage1,
        programPath: `/programs/${program.id}`,
      }))
      : null;

  const slidesToRender =
    programSlides && programSlides.length > 0 ? programSlides : fallbackSlides;

  // ✅ Safe prefers-reduced-motion handling (no SSR / TS issues)
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: any) => {
      const matches = event?.matches ?? mediaQuery.matches;
      setPrefersReducedMotion(matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else if (typeof mediaQuery.addListener === "function") {
      // older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation={false}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/50",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
        }}
        loop={true}
        autoplay={
          prefersReducedMotion
            ? false
            : { delay: 6000, disableOnInteraction: false }
        }
        speed={prefersReducedMotion ? 0 : 800}
        onSwiper={setSwiper}
        className="h-full"
      >
        {slidesToRender.map((slide, index) => (
          <SwiperSlide key={index} className="group">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />

              {/* Image Scale Animation */}
              <div className="w-full h-full overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out scale-110 group-[.swiper-slide-active]:scale-100"
                />
              </div>

              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-3xl transform transition-all duration-700">
                    {/* Title Animation */}
                    <h2
                      className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 opacity-0 translate-y-8 transition-all duration-700 delay-300 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 ease-out"
                    >
                      {slide.title}
                    </h2>

                    {/* Subtitle Animation */}
                    <p
                      className="font-sans text-lg md:text-xl text-white/90 mb-8 opacity-0 translate-y-8 transition-all duration-700 delay-500 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 ease-out"
                    >
                      {slide.subtitle}
                    </p>

                    {/* Buttons Animation */}
                    <div
                      className="flex flex-col sm:flex-row gap-4 opacity-0 translate-y-8 transition-all duration-700 delay-700 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 ease-out"
                    >
                      {/* 🔘 Our Programs – open /programs page */}
                      <Button
                        size="lg"
                        variant="default"
                        className="font-sans font-medium text-base"
                        asChild
                        data-testid="button-hero-primary"
                      >
                        <Link href="/programs">Our Programs</Link>
                      </Button>

                      {/* 🔘 Learn More – uses slide.programPath */}
                      <Button
                        size="lg"
                        variant="outline"
                        className="font-sans font-medium text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        asChild
                        data-testid="button-hero-secondary"
                      >
                        <Link href={slide.programPath}>Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiper?.slidePrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all"
        data-testid="button-hero-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => swiper?.slideNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all"
        data-testid="button-hero-next"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
