import { motion } from "framer-motion";
import {
  Megaphone,
  Search,
  TrendingUp,
  Eye,
  Shield,
  BarChart3,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Megaphone,
    title: "Telegram Ads",
    description: "Find competitors' ad creatives, view placement channels, and export for your campaigns.",
    link: "/ads",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Search,
    title: "Post Search",
    description: "Search channels by keywords, filter by country and category, use thematic collections.",
    link: "/catalog",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: TrendingUp,
    title: "Market Overview",
    description: "Analyze advertising market trends, track spending patterns, and identify opportunities.",
    link: "/rankings",
    color: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Eye,
    title: "Event Tracking",
    description: "Monitor keywords or channel events in real-time with instant notifications.",
    link: "/spy",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: Shield,
    title: "Scam Detection",
    description: "AI-powered detection of fraudulent channels. Protect your advertising budget.",
    link: "/catalog",
    color: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-500",
  },
  {
    icon: BarChart3,
    title: "Channel Analytics",
    description: "Deep analytics for any channel: growth, engagement, audience overlap, and more.",
    link: "/channel/sample",
    color: "from-primary/20 to-blue-500/20",
    iconColor: "text-primary",
  },
];

const features = [
  "Real-time data updates",
  "Export to CSV/Excel",
  "API access available",
  "24/7 monitoring",
];

export function ServiceCards() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Telegram Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for channel discovery, analytics, advertising intelligence, and competitor monitoring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={service.link}
                className="group block p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-primary/20 h-full"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
