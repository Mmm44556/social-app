interface NoDataProps {
  title?: string;
  description?: string;
}

export default function NoData({
  title = "No data yet",
  description = "When you Create a data, it will show up here.",
}: NoDataProps) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
}
