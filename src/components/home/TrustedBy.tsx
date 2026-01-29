import { motion } from "framer-motion";

const companies = [
  "Bloomberg",
  "BBC News",
  "Microsoft",
  "TechCrunch",
  "Forbes",
  "Reuters",
];

export function TrustedBy() {
  return (
    <section className="py-12 bg-muted/50 border-y border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium text-muted-foreground mb-6">
            TRUSTED BY LEADING COMPANIES AND RESEARCHERS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {companies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-xl lg:text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
