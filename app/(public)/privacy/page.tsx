import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Privacy Policy | SkinMinder",
  description: "How SkinMinder handles your data, images, and personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="p-8 lg:p-16 max-w-4xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight">Privacy Policy</h1>
        <p className="text-content-muted font-medium text-lg">
          Last updated: March 2026
        </p>
      </header>

      <Separator />

      <section className="space-y-6 text-foreground/80 leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">1. Data We Collect</h2>
          <p className="font-medium">
            SkinMinder collects the following categories of information when you use our platform:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 font-medium">
            <li><strong>Account Information:</strong> Name, email address, and authentication credentials.</li>
            <li><strong>Skin Images:</strong> Photos you upload for AI analysis. These are encrypted in transit and at rest.</li>
            <li><strong>Profile Data:</strong> Age, skin type, and concerns you voluntarily provide to personalize your experience.</li>
            <li><strong>Scan Results:</strong> AI-generated metrics, scores, and recommendations stored to enable longitudinal tracking.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2 pl-4 font-medium">
            <li>To provide personalized skin analysis and wellness recommendations.</li>
            <li>To power longitudinal Skin Twin tracking across scan sessions.</li>
            <li>To generate AI-driven routine and nutrition suggestions.</li>
            <li>To improve our models and services in aggregate (never individual identification).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">3. Image Processing</h2>
          <p className="font-medium">
            Your skin images are processed by AI models (Claude by Anthropic) solely for the purpose of generating your skin analysis. Images are:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 font-medium">
            <li>Transmitted securely via encrypted channels (TLS 1.3).</li>
            <li>Not used to train third-party AI models.</li>
            <li>Stored in encrypted private object storage with access restricted to your account.</li>            <li>Deletable at any time from your Settings page.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">4. Data Sharing</h2>
          <p className="font-medium">
            We do not sell your personal data. We share data only with:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 font-medium">
            <li><strong>Supabase:</strong> Database hosting and authentication.</li>
            <li><strong>Private Object Storage:</strong> Secure image storage and encrypted delivery.</li>
            <li><strong>Anthropic:</strong> AI processing for skin analysis (images are not retained).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">5. Your Rights</h2>
          <p className="font-medium">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 font-medium">
            <li>Access and export all of your data at any time.</li>
            <li>Request deletion of your account and all associated data.</li>
            <li>Opt out of non-essential data processing.</li>
            <li>Withdraw consent for image analysis at any time.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">6. Contact</h2>
          <p className="font-medium">
            For privacy-related inquiries, contact us at <strong>privacy@skinminder.com</strong>.
          </p>
        </div>
      </section>

      <Separator />

      <footer className="text-sm text-content-muted font-medium">
        <p>© 2026 SkinMinder. All rights reserved.</p>
      </footer>
    </div>
  );
}
