import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Terms of Use | SkinMinder",
  description: "Terms and conditions for using SkinMinder.",
};

export default function TermsPage() {
  return (
    <div className="p-8 lg:p-16 max-w-4xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight">Terms of Use</h1>
        <p className="text-content-muted font-medium text-lg">
          Last updated: March 2026
        </p>
      </header>

      <Separator />

      <section className="space-y-6 text-foreground/80 leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">1. Acceptance of Terms</h2>
          <p className="font-medium">
            By accessing and using SkinMinder, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">2. Nature of Service</h2>
          <p className="font-medium">
            SkinMinder is a cosmetic and wellness platform that provides AI-powered skin analysis and recommendations. It is <strong>not a medical device</strong>, does not provide medical diagnoses, and is not a substitute for professional dermatological care.
          </p>
          <p className="font-medium">
            The information provided by SkinMinder is for informational and wellness purposes only. Always consult a qualified healthcare professional for any medical concerns.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">3. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 pl-4 font-medium">
            <li>You must be at least 18 years old to use this service</li>
            <li>You agree to provide accurate information</li>
            <li>You are responsible for protecting your account credentials</li>
            <li>You agree to use the service in accordance with applicable laws</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">4. Disclaimer of Warranties</h2>
          <p className="font-medium">
            SkinMinder is provided "as is" without warranties of any kind. We do not guarantee that the service will be error-free, uninterrupted, or that any specific results will be achieved.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">5. Limitation of Liability</h2>
          <p className="font-medium">
            SkinMinder shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our liability is limited to the maximum extent permitted by law.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">6. Contact</h2>
          <p className="font-medium">
            For questions about these terms, contact us at legal@skinminder.com
          </p>
        </div>
      </section>
    </div>
  );
}