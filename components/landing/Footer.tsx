export default function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium">Skinminder</p>
          <p className="mt-1 text-xs text-white/42">
            Premium skin guidance designed for clarity, consistency, and progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-white/52">
          <a href="/privacy" className="transition-all duration-300 ease-out hover:text-white hover:-translate-y-[1px]">
            Privacy
          </a>
          <a href="/terms" className="transition-all duration-300 ease-out hover:text-white hover:-translate-y-[1px]">
            Terms
          </a>
          <a href="/contact" className="transition-all duration-300 ease-out hover:text-white hover:-translate-y-[1px]">
            Contact
          </a>
          <a href="/support" className="transition-all duration-300 ease-out hover:text-white hover:-translate-y-[1px]">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
