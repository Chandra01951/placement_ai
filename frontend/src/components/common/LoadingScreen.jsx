export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-surface-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4 animate-pulse">P</div>
        <p className="text-gray-400 text-sm">Loading PlacementAI...</p>
      </div>
    </div>
  );
}
