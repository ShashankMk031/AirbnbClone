export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>AirCover</li>
              <li>Anti-discrimination</li>
              <li>Disability support</li>
              <li>Cancellation options</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hosting</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Airbnb your home</li>
              <li>AirCover for Hosts</li>
              <li>Hosting resources</li>
              <li>Community forum</li>
              <li>Hosting responsibly</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Airbnb</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Newsroom</li>
              <li>New features</li>
              <li>Careers</li>
              <li>Investors</li>
              <li>Gift cards</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tech Stack</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Next.js 15 (TS)</li>
              <li>Tailwind CSS</li>
              <li>FastAPI</li>
              <li>SQLAlchemy 2.0</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 Airbnb Clone, Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
