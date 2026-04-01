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
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-3.5 px-5 font-bold text-xs text-gray-400 uppercase tracking-wider">
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool}
                className="text-center py-3.5 px-5 font-bold text-gray-900"
              >
                {tool}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={feature.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              <td className="py-3.5 px-5 text-gray-700 font-medium">{feature.name}</td>
              {tools.map((tool) => {
                const val = feature.values[tool];
                return (
                  <td key={tool} className="text-center py-3.5 px-5">
                    {typeof val === "boolean" ? (
                      val ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center bg-gray-900 text-white rounded-full text-xs font-bold">&#10003;</span>
                      ) : (
                        <span className="inline-flex w-6 h-6 items-center justify-center bg-gray-100 text-gray-400 rounded-full text-xs">&#10007;</span>
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
