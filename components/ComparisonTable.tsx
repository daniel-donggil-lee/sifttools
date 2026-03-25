interface Feature {
  name: string;
  values: Record<string, string | boolean>;
}

export default function ComparisonTable({
  tools,
  features,
}: {
  tools: string[];
  features: Feature[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool}
                className="text-center py-3 px-4 font-semibold text-gray-900"
              >
                {tool}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.name} className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-700">{feature.name}</td>
              {tools.map((tool) => {
                const val = feature.values[tool];
                return (
                  <td key={tool} className="text-center py-3 px-4">
                    {typeof val === "boolean" ? (
                      val ? (
                        <span className="text-emerald-600">&#10003;</span>
                      ) : (
                        <span className="text-gray-300">&#10007;</span>
                      )
                    ) : (
                      <span className="text-gray-700">{val}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
