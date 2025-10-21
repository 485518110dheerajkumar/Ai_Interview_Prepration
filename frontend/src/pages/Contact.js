import React, { useState } from "react";
import Footer from "../components/Footer";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setSuccess("✅ Your response has been submitted!");
                setForm({ name: "", email: "", message: "" });
            } else {
                setSuccess("❌ Failed to submit. Try again later.");
            }
        } catch (err) {
            console.error(err);
            setSuccess("❌ Server error. Try again.");
        }
    };
    return (
        <div className="bg-gray-50 min-h-screen">
            <nav class="bg-white shadow-md">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">


                        <div class="flex items-center">
                            <span class="text-2xl font-bold text-blue-600">Prepbot</span>
                        </div>


                        <div class="hidden md:flex space-x-6 items-center">
                            <a href="/" class="text-gray-700 hover:text-blue-600">Home</a>
                            <a href="/about" class="text-gray-700 hover:text-blue-600">About</a>
                            <a href="/features" class="text-gray-700 hover:text-blue-600">Features</a>
                            <a href="/contact" class="text-gray-700 hover:text-blue-600">Contact</a>
                        </div>


                        <div class="flex items-center space-x-4">
                            <a href="/login" class="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600">Login</a>
                            <a href="/signup" class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                                Sign Up
                            </a>
                        </div>

                    </div>
                </div>
            </nav>
            <section className="bg-blue-900 text-white px-6 py-16 md:px-20 lg:px-32 text-center">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    Have questions or want to collaborate? We'd love to hear from you!
                </p>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-gray-100">
                <div className="shadow-md rounded-xl flex-col max-w-4xl mx-auto text-center bg-gray-50 min-h-screen flex items-center justify-center">
                   <h2 className="text-4xl font-bold text-center">Contact Us</h2>
                    <form
                        onSubmit={handleSubmit}
                        className=" p-8 rounded-xl w-full space-y-4"
                    >
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write your message..."
                            rows="4"
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Submit
                        </button>
                        {success && <p className="text-center mt-2">{success}</p>}
                    </form>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="px-6 py-16 md:px-20 lg:px-32 bg-white">
                <div className="grid md:grid-cols-3 gap-10 text-center">
                    <div>
                        <img src="/images/email.png" alt="Email" className="w-12 mx-auto mb-2" />
                        <p className="font-semibold text-gray-800">Email</p>
                        <p className="text-gray-600">dheerajkumar2022@vitbhopal.ac.in</p>
                    </div>
                    <div>
                        <img src="/images/phone.png" alt="Phone" className="w-12 mx-auto mb-2" />
                        <p className="font-semibold text-gray-800">Phone</p>
                        <p className="text-gray-600">+91 8171768393</p>
                    </div>
                    <div>
                        <img src="/images/location.png" alt="Location" className="w-12 mx-auto mb-2" />
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-gray-600">Agra, India</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
