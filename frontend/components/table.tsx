"use client";
import React, { useState, useEffect } from "react";
import {
  TrashIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAsync } from "@/hooks/use-async";

const servicesMap = {
  posts: () =>
    import("@/services/post.service").then((mod) => mod.postService),
  users: () =>
    import("@/services/user.service").then((mod) => mod.userService),
};

interface Item {
  [key: string]: string | number;
}

interface TableActions {
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface ServiceModule {
  create?: (item: Omit<Item, "id">) => Promise<any>
  remove?: (id: string) => Promise<any>
  update?: (item: Item) => Promise<any>
  getAll?: () => Promise<any[]>
}

interface TableActions {
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface TableProps {
  data: Item[];
  dataKind: "posts" | "users"; // extend if you have more
  actions: TableActions;
}

const Table: React.FC<TableProps> = ({ data, dataKind, actions }) => {
  const [tableData, setTableData] = useState<Item[]>(data);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [mode, setMode] = useState<"edit" | "create" | null>(null);

  const [service, setService] = useState<ServiceModule>(null);
  const { executeAuthFunction } = useAsync();

  useEffect(() => {
    servicesMap[dataKind]()
      .then((serviceModule) => {
        setService(serviceModule);
      })
      .catch((err: string) => {
        console.error("Failed to load service:", err);
      });
  }, [dataKind]);

  const columns = tableData.length ? Object.keys(tableData[0]) : [];

  const handleCreate = () => {
    setSelectedItem({});
    setMode("create");
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setMode("edit");
  };

  const handleDelete = async (id: string) => {
    if (!service?.remove) return;
    await executeAuthFunction({
      asyncOperation: () => service.remove(id),
    });
    setTableData((prev) => prev.filter((row) => String(row.id) !== id));
  };

  const handleClose = () => {
    setSelectedItem(null);
    setMode(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedItem || !service) return;

    if (mode === "edit" && service.update) {
      await executeAuthFunction({
        asyncOperation: () =>
          service.update(selectedItem),
      });
      setTableData((prev) =>
        prev.map((row) => (row.id === selectedItem.id ? selectedItem : row))
      );
    } else if (mode === "create" && service.create) {
      const newItem = await executeAuthFunction({
        asyncOperation: () => service.create(selectedItem),
      });
      setTableData((prev) => [...prev, newItem]);
    }
    handleClose();
  };

  return (
    <div className="overflow-x-auto w-[98%] relative">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th
                key={col}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {col}
              </th>
            ))}
            {(actions.update || actions.delete) && (
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.id}
              className="border border-gray-300 odd:bg-white even:bg-gray-100"
            >
              {columns.map((col) => (
                <td key={col} className="border border-gray-300 px-4 py-2">
                  {row[col]}
                </td>
              ))}
              {(actions.update || actions.delete) && (
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  {actions.update && (
                    <button
                      onClick={() => handleEdit(row)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  )}
                  {actions.delete && (
                    <button
                      onClick={() => handleDelete(String(row.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {actions.create && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" /> Create
          </button>
        </div>
      )}

      {mode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {mode === "edit" ? "Edit Item" : "Create Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedItem &&
                Object.keys(selectedItem).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium capitalize">
                      {key}
                    </label>
                    <input
                      type="text"
                      className="border p-2 rounded"
                      value={selectedItem[key] as string}
                      onChange={(e) =>
                        setSelectedItem((prev) => ({
                          ...prev!,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
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
