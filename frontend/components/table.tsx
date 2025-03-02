'use client'
import React, { useState } from "react";
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAsync } from "@/hooks/use-async";

interface Item {
  [key: string]: string | number;
}

interface Actions {
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (item: Item) => Promise<void>;
  onCreate?: (item: Item) => Promise<void>;
}

interface TableProps {
  data: Item[];
  actions?: Actions;
}

const Table: React.FC<TableProps> = ({ data, actions }) => {
  const [selectedItem, setSelectedItem] = useState<Item>(null);
  const [mode, setMode] = useState<"edit" | "create" | null>(null);
  const { executeAuthFunction } = useAsync()
  const columns = data.length ? Object.keys(data[0]) : [];

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setMode("edit");
  };

  const handleCreate = () => {
    setSelectedItem({});
    setMode("create");
  };

  const handleClose = () => {
    setSelectedItem(null);
    setMode(null);
  };

  const handleDelete = async (id: string) => {
    await executeAuthFunction({
      asyncOperation: () => actions.onDelete(id)
    })
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedItem) return;

    if (mode === "edit" && actions?.onEdit) {
      await executeAuthFunction({
        asyncOperation: () => actions.onEdit(selectedItem)
      })
    } else if (mode === "create" && actions?.onCreate) {
      await executeAuthFunction({
        asyncOperation: () => actions.onCreate(selectedItem)
      })
    }
    handleClose();
  };

  return (
    <div className="overflow-x-auto w-full relative">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th key={col} className="border border-gray-300 px-4 py-2 text-left">{col}</th>
            ))}
            {actions && <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border border-gray-300 odd:bg-white even:bg-gray-100">
              {columns.map((col) => (
                <td key={col} className="border border-gray-300 px-4 py-2">{row[col]}</td>
              ))}
              {actions && (
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  {actions.onEdit && (
                    <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  )}
                  {actions.onDelete && (
                    <button onClick={() => handleDelete(String(row.id))} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {actions?.onCreate && (
        <div className="mt-4 flex justify-end">
          <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
            <PlusIcon className="w-5 h-5" /> Create
          </button>
        </div>
      )}

      {/* Modal */}
      {mode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">{mode === "edit" ? "Edit Item" : "Create Item"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(selectedItem).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium capitalize">{key}</label>
                  <input
                    type="text"
                    className="border p-2 rounded"
                    value={selectedItem[key] as string}
                    onChange={(e) => setSelectedItem((prev) => ({ ...prev!, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {mode === "edit" ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
