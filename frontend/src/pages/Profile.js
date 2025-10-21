import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Extract userId from JWT token stored in localStorage
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token); // ✅ decode token
      userId = decoded.id; // must match backend token payload
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  useEffect(() => {
    if (!userId) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser({
          ...data,
          contact: data.contact || "",
          image: data.image || ""
        });
        setFormData({
          name: data.name || "",
          contact: data.contact || "",
          imageFile: null,
          previewImage: data.image || ""
        });
      })
      .catch(err => console.error("Fetch error:", err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const formDataUpload = new FormData();
    formDataUpload.append("name", formData.name);
    formDataUpload.append("contact", formData.contact || "");
    if (formData.password) formDataUpload.append("password", formData.password);
    if (formData.imageFile) formDataUpload.append("image", formData.imageFile);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
      method: "PUT",
      body: formDataUpload
    })
      .then(res => res.json())
      .then(updated => {
        setUser(updated);
        setFormData({
          ...formData,
          previewImage: updated.image,
          imageFile: null
        });
        setEditMode(false);
      })
      .catch(err => console.error("Update error:", err));
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm)
    })
      .then(res => res.json())
      .then(response => {
        alert(response.message);
        setShowPasswordModal(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(err => console.error("Password update error:", err));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-16">
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row gap-10">
          {/* Left Section - Profile Pic */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative">
              <img
                src={formData.previewImage || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
              {editMode && (
                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer text-xs">
                  ✎
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setFormData({
                        ...formData,
                        previewImage: URL.createObjectURL(file),
                        imageFile: file
                      });
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2 className="mt-4 text-xl font-semibold">{formData.name || user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-4">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Right Section - User Info */}
          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                value={user.email}
                disabled
                className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value="********"
                disabled
                className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
              />
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-blue-500 text-sm mt-1"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-bold">Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
