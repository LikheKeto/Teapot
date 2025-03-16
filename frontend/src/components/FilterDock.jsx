import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Spinner, Select, TextInput, Label } from "flowbite-react";

export default function FilterDock({ filters, setFilters, onApplyFilters }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    onApplyFilters();
  };

  const clearFilters = () => {
    const defaultFilters = {
      searchTerm: "",
      sortBy: "created_at",
      sortOrder: "DESC",
      categoryId: "",
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg shadow-md bg-green-50">
      <div className="flex flex-col">
        <Label className="text-xs" htmlFor="searchTerm">
          Search
        </Label>
        <TextInput
          id="searchTerm"
          type="text"
          name="searchTerm"
          placeholder="Search notes..."
          value={filters.searchTerm}
          onChange={handleChange}
          className="w-full sm:w-auto"
        />
      </div>

      <div className="flex flex-col">
        <Label className="text-xs" htmlFor="sortBy">
          Sort By
        </Label>
        <Select
          id="sortBy"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
        >
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
          <option value="title">Title</option>
        </Select>
      </div>

      <div className="flex flex-col">
        <Label className="text-xs" htmlFor="sortOrder">
          Sort Order
        </Label>
        <Select
          id="sortOrder"
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleChange}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </Select>
      </div>

      <div className="flex flex-col">
        <Label className="text-xs" htmlFor="categoryId">
          Category
        </Label>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <Select
            id="categoryId"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      <button
        onClick={applyFilters}
        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
      >
        Apply Filters
      </button>

      <button
        onClick={clearFilters}
        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Clear Filters
      </button>
    </div>
  );
}
