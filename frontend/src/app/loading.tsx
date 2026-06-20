export default function Loading() {
  return (
    <div className="w-full grow flex flex-col items-center justify-center p-8">
      <span className="loading loading-spinner"></span>
      <div className="text-gray-600">Loading data, please wait... 
      </div>
    </div>
  );
}
