
import React, { useEffect, useState } from "react";

const EditableMondayTable = () => {
  const [items, setItems] = useState([]);
  const [changes, setChanges] = useState({});
  const statusOptions = ["Working on it", "Done", "Stuck"];

  useEffect(() => {
    fetch("/.netlify/functions/get-items")
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  const handleChange = (itemId, columnId, value) => {
    setChanges((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [columnId]: value
      }
    }));
  };

  const handleSave = async (itemId) => {
    const updates = changes[itemId];
    if (!updates) return;

    for (const [columnId, value] of Object.entries(updates)) {
      const payload = {
        itemId,
        columnId,
        value: columnId === "status" ? JSON.stringify({ label: value }) : JSON.stringify(value)
      };

      await fetch("/.netlify/functions/update-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    setChanges((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Editable Monday Table</h2>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Text</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const statusCol = item.column_values.find((col) => col.id === "status");
            const textCol = item.column_values.find((col) => col.id === "text");

            return (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">
                  <input
                    className="border px-2 py-1 w-full"
                    defaultValue={textCol?.text || ""}
                    onChange={(e) => handleChange(item.id, "text", e.target.value)}
                  />
                </td>
                <td className="p-2 border">
                  <select
                    className="border px-2 py-1 w-full"
                    defaultValue={statusCol?.label || ""}
                    onChange={(e) => handleChange(item.id, "status", e.target.value)}
                  >
                    <option value="">Select</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleSave(item.id)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditableMondayTable;
