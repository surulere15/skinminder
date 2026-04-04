import { WidgetInterface } from "@/features/widget/components/widget-interface";

export default function WidgetPage({ 
  searchParams 
}: { 
  searchParams: { brandId?: string } 
}) {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <WidgetInterface brandId={searchParams.brandId} />
    </div>
  );
}
