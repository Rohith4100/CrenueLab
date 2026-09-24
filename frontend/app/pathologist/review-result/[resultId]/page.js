
import ProtectedRoute from "@/components/protectedRoute"
import ReviewResult from "@/components/review-result";

export default async function Page({
  params,
}) {
  const { resultId } = await params;

  return (
    <ProtectedRoute role="Pathologist">
      <ReviewResult resultId={resultId} />
    </ProtectedRoute>
  );
}