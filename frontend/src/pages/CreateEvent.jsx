import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, User, Phone, Loader2, ChevronRight, Navigation, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import { useToast } from '../context/ToastContext';
import Cropper from 'react-easy-crop';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mapMode, setMapMode] = useState('standard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const venueMarker = useRef(null);
  const currentMarker = useRef(null);
  const tileLayer = useRef(null);

  // Cropper States
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [pendingImageBlob, setPendingImageBlob] = useState(null);
  const [pendingImagePreview, setPendingImagePreview] = useState('');

  const [formData, setFormData] = useState({
    type: 'Wedding',
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    host_name: '',
    contact_number: '',
    password: '',
    expiry_date: '',
    image_url: '',
    theme: 'classic'
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (window.L && mapRef.current && !leafletMap.current) {
      leafletMap.current = window.L.map(mapRef.current, { attributionControl: false }).setView([13.0827, 80.2707], 13);
      tileLayer.current = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap.current);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const latlng = [latitude, longitude];
          leafletMap.current.setView(latlng, 14);
          const blueIcon = new window.L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          currentMarker.current = window.L.marker(latlng, { icon: blueIcon }).addTo(leafletMap.current).bindPopup("<b>You are here</b>").openPopup();
        });
      }

      leafletMap.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        const redIcon = new window.L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        if (venueMarker.current) {
          venueMarker.current.setLatLng(e.latlng);
        } else {
          venueMarker.current = window.L.marker(e.latlng, { icon: redIcon }).addTo(leafletMap.current).bindPopup("<b>Venue Location</b>").openPopup();
        }
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setFormData(prev => ({ ...prev, venue: `${data.display_name} | @${lat},${lng}` }));
          showToast('Venue Pinned! 🔴');
        } catch (err) {
          console.error(err);
        }
      });
    }
  }, []);

  const toggleMapMode = () => {
    if (!leafletMap.current || !tileLayer.current) return;
    leafletMap.current.removeLayer(tileLayer.current);
    if (mapMode === 'standard') {
      tileLayer.current = window.L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}').addTo(leafletMap.current);
      setMapMode('satellite');
      showToast('Satellite View 🛰️');
    } else {
      tileLayer.current = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap.current);
      setMapMode('standard');
      showToast('Standard View 🌍');
    }
  };

  const handleMyLocation = () => {
    if (currentMarker.current && leafletMap.current) {
      leafletMap.current.setView(currentMarker.current.getLatLng(), 16);
      showToast('Zoomed to your location 🔵');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageToCrop(reader.result);
    };
  };

  const createCropCanvas = (imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        // Heavy compression to save bandwidth
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.6);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleSaveCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      const blob = await createCropCanvas(imageToCrop, croppedAreaPixels);
      setPendingImageBlob(blob);
      setPendingImagePreview(URL.createObjectURL(blob));
      setImageToCrop(null); // Close cropper modal
    } catch (e) {
      showToast('Crop failed', 'error');
    }
  };

  const uploadToCloudinary = async (blob) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('Please add VITE_CLOUDINARY keys to your .env file');
    }

    const data = new FormData();
    data.append('file', blob, 'hero_image.jpg');
    data.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    });
    
    const result = await res.json();
    if (result.secure_url) return result.secure_url;
    throw new Error('Upload failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please login');

      let finalImageUrl = formData.image_url;

      if (pendingImageBlob) {
        showToast('Uploading Hero Image... ☁️');
        finalImageUrl = await uploadToCloudinary(pendingImageBlob);
      }

      showToast('Saving Event Details... 💾');
      const { error } = await supabase.from('events').insert([{ 
        ...formData, 
        image_url: finalImageUrl, 
        user_id: user.uid 
      }]);
      if (error) throw error;
      showToast('Invitation Created! ✨');
      navigate(`/dashboard/my-invites`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' };
  const labelStyle = { fontWeight: 700, fontSize: '0.875rem' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 900, fontFamily: 'Outfit' }}>Create Invitation</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Enter the details for your celebration.</p>
      </div>

      <div style={{ background: 'white', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Event Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ ...inputStyle, paddingLeft: '1rem', fontWeight: 600 }}
              >
                <option value="Wedding">💍 Wedding</option>
                <option value="Birthday">🎂 Birthday</option>
                <option value="Anniversary">💖 Anniversary</option>
                <option value="House Warming">🏠 House Warming</option>
                <option value="Party">🎉 Party</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Design Theme</label>
              <select 
                value={formData.theme}
                onChange={(e) => setFormData({...formData, theme: e.target.value})}
                style={{ ...inputStyle, paddingLeft: '1rem', fontWeight: 600 }}
              >
                <option value="classic">✨ Classic Elegance (Light)</option>
                <option value="midnight">🌙 Midnight Luxury (Dark)</option>
                <option value="floral">🌸 Blooming Floral (Pink/Gold)</option>
                <option value="minimal">🧊 Minimalist Glass (Modern)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Event Title</label>
            <div style={{ position: 'relative' }}>
              
              <input type="text" required placeholder="e.g. Roshinth's Birthday" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={inputStyle} />
            </div>
          </div>

          {/* IMAGE UPLOAD & CROP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Custom Hero Image (Optional)</label>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '2px dashed #cbd5e1', textAlign: 'center', position: 'relative' }}>
              {pendingImagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={pendingImagePreview} alt="Preview" style={{ height: '300px', width: 'auto', objectFit: 'contain', borderRadius: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                  <button type="button" onClick={() => { setPendingImagePreview(''); setPendingImageBlob(null); }} style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>×</button>
                </div>
              ) : (
                <>
                  <input type="file" accept="image/*" onChange={handleImageSelect} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem' }}>📸</div>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Click or drag an image to crop</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="date" required value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Time</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="time" required value={formData.event_time} onChange={(e) => setFormData({...formData, event_time: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={labelStyle}>Venue Location</label>
              <button type="button" onClick={handleMyLocation} style={{ color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem' }}>📍 Find Me</button>
            </div>
            
            <div ref={mapRef} style={{ height: '250px', width: '100%', borderRadius: '1.5rem', border: '2px solid #f1f5f9', overflow: 'hidden', zIndex: 1 }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
               <button type="button" onClick={toggleMapMode} style={{ padding: '0.5rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={14} /> {mapMode === 'standard' ? 'Satellite' : 'Standard'}</button>
            </div>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="text" required placeholder="Pin the map" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} style={{ ...inputStyle, background: '#f8fafc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Host Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" required placeholder="Host Name" value={formData.host_name} onChange={(e) => setFormData({...formData, host_name: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Contact</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" required placeholder="Contact Number" value={formData.contact_number} onChange={(e) => setFormData({...formData, contact_number: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
            <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Access Password <span style={{ color: '#64748b', fontWeight: 500 }}>(Optional)</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔒</span>
                <input type="text" placeholder="Leave blank for public access" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ ...inputStyle, background: 'white' }} />
              </div>
            </div>
            <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Link Expiry Date <span style={{ color: '#64748b', fontWeight: 500 }}>(Optional)</span></label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="date" value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} style={{ ...inputStyle, background: 'white' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Event Description</label>
            <textarea placeholder="Description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, paddingLeft: '1rem', minHeight: '100px', resize: 'none' }} />
          </div>

          <button disabled={loading} type="submit" style={{ width: '100%', padding: '1.25rem', background: '#1a1a1a', color: 'white', borderRadius: '1.25rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : <>Create Invitation <ChevronRight size={20} /></>}
          </button>
        </form>
      </div>

      {/* CROPPER MODAL */}
      {imageToCrop && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />
          </div>
          <div style={{ padding: '2rem', background: 'black', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => setImageToCrop(null)} style={{ padding: '1rem 2rem', background: '#333', color: 'white', borderRadius: '1rem', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSaveCrop} style={{ padding: '1rem 2rem', background: '#6366f1', color: 'white', borderRadius: '1rem', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Crop & Save Image</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreateEvent;
