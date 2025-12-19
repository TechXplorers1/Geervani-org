import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getImpactStats } from "@/lib/rtdb";
import type { ImpactStat } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function StatsSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { data: stats, isLoading } = useQuery<ImpactStat[]>({
    queryKey: ["impact-stats"],
    queryFn: getImpactStats,
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 bg-primary text-primary-foreground min-h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </section>
    );
  }

  // Fallback or empty state
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(stats.length, 4)} gap-8 md:gap-12`}>
          {stats.map((stat, index) => {
            // @ts-ignore
            const Icon = Icons[stat.icon] || Icons.HelpCircle;
            return (
              <motion.div
                key={stat.id}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-foreground/10 p-4 rounded-lg">
                    <Icon className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                </div>
                <div className="font-heading font-bold text-4xl md:text-5xl mb-2" data-testid={`stat-value-${index}`}>
                  {inView && (
                    <>
                      <CountUp
                        start={0}
                        end={stat.value}
                        duration={2.5}
                        separator=","
                        useEasing={true}
                      />
                      {stat.suffix}
                    </>
                  )}
                </div>
                <p className="font-sans text-sm md:text-base text-primary-foreground/80">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
