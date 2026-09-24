
import ReportDetails
  from "@/components/test-report-details";

export default async function Page({
  params,
}) {
  const { resultId } =
    await params;

  return (
    <ReportDetails
      resultId={resultId}
    />
  );
}