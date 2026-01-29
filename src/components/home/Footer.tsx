import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Telemetrio</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              The most comprehensive Telegram analytics platform for businesses and researchers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/catalog" className="hover:text-sidebar-foreground transition-colors">Channel Catalog</Link></li>
              <li><Link to="/ads" className="hover:text-sidebar-foreground transition-colors">Ad Intelligence</Link></li>
              <li><Link to="/spy" className="hover:text-sidebar-foreground transition-colors">Event Tracking</Link></li>
              <li><Link to="/rankings" className="hover:text-sidebar-foreground transition-colors">Rankings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/50">
          <p>© 2025 Telemetrio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
