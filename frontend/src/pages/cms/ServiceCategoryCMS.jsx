import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";

export default function ServiceCategoryCMS() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    categoryName: "",
    slug: "",
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/service-listing-categories");
      setCategories(data.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setCurrentCategory(cat);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/service-listing-categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = currentCategory.id || currentCategory._id;
      if (id) {
        await axios.put(`/service-listing-categories/${id}`, currentCategory);
        toast.success("Category updated");
      } else {
        await axios.post("/service-listing-categories", currentCategory);
        toast.success("Category created");
      }
      setIsEditing(false);
      setCurrentCategory({ categoryName: "", slug: "", isActive: true, sortOrder: 0 });
      fetchCategories();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Categories</h1>
        <button 
          onClick={() => { setIsEditing(true); setCurrentCategory({ categoryName: "", slug: "", isActive: true, sortOrder: 0 }); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isEditing && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4">{(currentCategory.id || currentCategory._id) ? "Edit Category" : "Add New Category"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Name</label>
              <input 
                type="text" 
                value={currentCategory.categoryName} 
                onChange={(e) => setCurrentCategory({...currentCategory, categoryName: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Slug</label>
              <input 
                type="text" 
                value={currentCategory.slug} 
                onChange={(e) => setCurrentCategory({...currentCategory, slug: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Name</th>
              <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Slug</th>
              <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id || cat._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-800">{cat.categoryName || cat.name}</td>
                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(cat.id || cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
