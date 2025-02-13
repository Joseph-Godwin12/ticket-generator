import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineCloudDownload } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas';

export default function AttendeeDetails() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    about: '',
    avatarUrl: '',
    ticketType: '',
  });
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  

  // IndexedDB Helper Functions
  const openDatabase = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  const saveFormData = async (dbName, storeName, data) => {
    const db = await openDatabase(dbName, storeName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id: 1, data });

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  const loadFormData = async (dbName, storeName) => {
    const db = await openDatabase(dbName, storeName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(1);

      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  // Load form data on initial render
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedData = await loadFormData('AttendeeDB', 'formData');
        if (storedData) {
          setFormData(storedData);
        }
      } catch (error) {
        console.error('Failed to load form data:', error);
      }
    };
    loadInitialData();
  }, []);

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.about.trim()) {
      newErrors.about = 'Please provide some details about the project';
    } else if (formData.about.length > 300) {
      newErrors.about = 'About section must be less than 300 characters';
    }
    if (!formData.avatarUrl) newErrors.avatarUrl = 'Profile photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToTicketPage = () => {
    navigate('/ticket', { state: formData });  // No need to set localStorage here again; it's already done in handleSubmit.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await saveFormData('AttendeeDB', 'formData', formData);
        alert('Form submitted and saved successfully!');
        goToTicketPage();
        localStorage.setItem('ticketData', JSON.stringify(formData));
      } catch (error) {
        console.error('Failed to save form data:', error);
        alert('An error occurred while saving the form. Please try again.');
      }
    } else {
      alert('Please fill in all the required fields.');
    }
  };
    
  const generateTicket = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'my_ticket.png';
      link.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatarUrl: 'Please upload a valid image file' }));
      return;
    }
    setIsUploading(true);
    try {
      const imageBlob = new Blob([file], { type: file.type });
      const imageUrl = URL.createObjectURL(imageBlob);
      setFormData((prev) => ({ ...prev, avatarUrl: imageUrl }));
      setErrors((prev) => ({ ...prev, avatarUrl: '' }));
    } catch (error) {
      console.error('Image upload failed:', error);
      setErrors((prev) => ({ ...prev, avatarUrl: 'Failed to upload image. Please try again.' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-teal-950 flex items-center justify-center py-12 px-6">
      <div className="max-w-xl w-full bg-teal-950 p-8 border-2 border-teal-900 rounded-md shadow-lg">
      <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Attendee Details</h2>
        <span className="text-sm text-gray-300">Step 2/3</span>
      </div>
      <div className="mt-2 w-full bg-teal-900 h-1 rounded-full overflow-hidden">
        <div className="bg-teal-400 h-full" style={{ width: '66%' }}></div>
      </div>
    </div>
        <div className="border-2 border-teal-900 py-7 px-10 rounded-md bg-teal-900">
          <form onSubmit={handleSubmit}>
            <h2 className="text-white rounded mb-2">Upload Profile Photo</h2>
            <div
                  className={`border-2 rounded-lg bg-teal-950 p-10 sm:p-16 md:p-20 mb-6 ${
                    isDragging ? 'border-teal-500 bg-teal-900' : 'border-teal-800'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                >
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Uploaded"
                      className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-md mx-auto"
                    />
                  ) : (
                    <div className="text-center text-white bg-teal-800 py-6 px-4 sm:py-10 sm:px-6">
                      <label htmlFor="avatarUpload" className="flex flex-col items-center cursor-pointer">
                        <HiOutlineCloudDownload size={32} className="text-white mb-3" />
                        <p className="text-sm sm:text-base">Drag & drop or click to upload</p>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="avatarUpload"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                  {errors.avatarUrl && <p className="text-red-500 text-sm mt-2">{errors.avatarUrl}</p>}
                </div>

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-300 mb-1">
                Enter your name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border-2 border-teal-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-1">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border-2 border-teal-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="about" className="block text-gray-300 mb-1">
                About the Project
              </label>
              <textarea
                id="about"
                name="about"
                rows="4"
                value={formData.about}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border-2 border-teal-800 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.about && <p className="text-red-500 text-sm mt-2">{errors.about}</p>}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:space-x-5 space-y-4 md:space-y-0">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full md:w-1/2 px-6 py-3 border-2 border-teal-600 text-gray-300 rounded hover:border-teal-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    onClick={goToTicketPage}
                    className="w-full md:w-1/2 px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-500"
                  >
                    Get my free ticket
                  </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
