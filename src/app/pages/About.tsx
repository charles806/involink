import { motion } from "framer-motion";
import { Link } from "react-router";
import { Users, MapPin, Calendar, Globe } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";

export default function About() {
  const stats = [
    { label: "Active Users", value: "100+" },
    { label: "Invoices Created", value: "200" },
    { label: "Naira Processed", value: "₦100k+" },
    { label: "Countries", value: "1" },
  ];

  const team = [
    { name: "Nwizu Kosisochukwu Victor", role: "CEO & Co-founder", initial: "N" },
    { name: "Anene Charles", role: "CTO & Co-founder", initial: "A" },
    { name: "Sofiri Clarkson Isaiah", role: "Head of Engineering", initial: "S" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            About <span className="text-emerald-500">Involink</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering Nigerian entrepreneurs with modern invoicing tools built for the local ecosystem.
          </p>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 text-center"
              >
                <div className="text-4xl font-bold text-emerald-500 mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Our Story</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <p className="text-lg text-muted-foreground mb-6">
                Involink was born in 2024 from a simple observation: Nigerian entrepreneurs were struggling with outdated, complex invoicing tools that didn't understand their needs.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We set out to change that. Built by Nigerians, for Nigerians, Involink combines modern technology with deep understanding of the local business landscape—from Naira currency support to integration with Nigerian payment platforms.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we're proud to serve over 10,000 businesses across Nigeria, helping them get paid faster and grow their enterprises.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10"
            >
              <div className="grid grid-cols-2 gap-6 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Based in</div>
                    <div className="text-muted-foreground">Lagos, Nigeria</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Founded</div>
                    <div className="text-muted-foreground">2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Team</div>
                    <div className="text-muted-foreground">25+ Members</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Presence</div>
                    <div className="text-muted-foreground">5 Countries</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-900 dark:via-emerald-950/10 dark:to-gray-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Meet Our Team</h2>
            <p className="text-muted-foreground">The people behind Involink</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-white/10 text-center hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {member.initial}
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-t border-white/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 Involink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
