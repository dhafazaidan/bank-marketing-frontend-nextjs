// frontend/src/app/page.tsx
'use client';

import { useState } from 'react';
// Import Recharts components
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Definisi interface untuk respons dari backend
interface PredictionResponse {
  prediction: string;
  probability_yes: number;
  error?: string; // Untuk menangani pesan error dari backend
}

// Definisikan URL backend Anda di sini.
// Untuk pengembangan lokal, ini adalah http://localhost:8000.
// Saat deployment, ini akan diganti dengan Environment Variable (NEXT_PUBLIC_BACKEND_API_URL)
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

export default function Home() {
  // State untuk menyimpan nilai input dari form
  const [formData, setFormData] = useState({
    age: 30, job: 'admin.', marital: 'married', education: 'secondary',
    balance: 1787, default: 'no', housing: 'no', loan: 'no',
    contact: 'cellular', duration: 100, campaign: 1, pdays: -1,
    previous: 0, poutcome: 'unknown', month: 'jan'
  });
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Daftar field kategorikal yang seharusnya menjadi dropdown
  const categoricalFields = ['job', 'marital', 'education', 'default', 'housing', 'loan', 'contact', 'poutcome', 'month'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newValue: string | number = value;

      // Cek apakah field adalah numerik (yaitu, bukan bagian dari categoricalFields)
      if (!categoricalFields.includes(name)) {
        // Jika nilai kosong, set ke string kosong (ini akan mencegah NaN)
        if (value === '') {
          newValue = ''; 
        } else {
          // Parse sebagai integer
          const parsedValue = parseInt(value, 10);
          // Jika hasil parse adalah NaN (misal, input 'abc'), kembalikan string kosong
          newValue = isNaN(parsedValue) ? '' : parsedValue;
        }
      }

      return { 
        ...prev, 
        [name]: newValue 
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    // Filter formData untuk memastikan semua nilai numerik adalah number atau diubah ke 0 jika string kosong
    // Bagian ini sengaja menggunakan 'any' untuk stabilitas saat ini, sesuai permintaan Anda.
    const submissionData = { ...formData };
    // Daftar field numerik
    const numericFields = ['age', 'balance', 'duration', 'campaign', 'pdays', 'previous'];
    for (const key of numericFields) {
      if ((submissionData as any)[key] === '') { 
        (submissionData as any)[key] = 0; 
      }
    }


    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/predict`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData), // Gunakan submissionData yang sudah difilter
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || `Terjadi kesalahan HTTP! Status: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      if (data.error) {
          setError(data.error);
      } else {
          setPredictionResult(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Terjadi kesalahan tidak dikenal.');
      } else if (typeof err === 'string') {
        setError(err || 'Terjadi kesalahan tidak dikenal.');
      } else {
        setError('Terjadi kesalahan tidak dikenal.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper style for glassmorphism cards (using refined variables)
  const glassCardStyle = {
    background: 'var(--color-glass-bg)', 
    borderRadius: '25px', 
    boxShadow: '0 8px 32px 0 var(--color-glass-shadow)', 
    backdropFilter: 'blur(8px) saturate(180%)', 
    WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    border: '1px solid var(--color-glass-border)', 
    padding: '30px',
    transition: 'all 0.3s ease-in-out',
  };

  const sectionHeaderStyle = {
    fontFamily: 'Poppins, sans-serif', 
    color: 'var(--color-text-main)', 
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '30px',
    textShadow: 'none', 
    letterSpacing: '-0.03em',
  };

  // Data for the prediction probability chart
  const predictionChartData = predictionResult ? [
    { name: 'Probabilitas YA', value: predictionResult.probability_yes * 100 },
    { name: 'Probabilitas TIDAK', value: (1 - predictionResult.probability_yes) * 100 },
  ] : [];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      width: '100%',
      margin: '0 auto', 
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      animation: 'fadeIn 1s ease-out', 
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Bagian Header Utama Halaman (Header Glassmorphism) */}
      <div style={{ 
        ...glassCardStyle, 
        textAlign: 'center', 
        padding: '50px 30px', 
        boxShadow: '0 12px 40px 0 rgba(0,0,0,0.15)', 
      }}>
        <h1 style={{ 
          fontFamily: 'Poppins, sans-serif', 
          color: 'var(--color-text-main)', 
          fontSize: '3.8rem', 
          marginBottom: '0.8rem', 
          fontWeight: '800',
          textShadow: 'none', 
        }}>
          <span style={{ fontSize: '4.5rem', marginRight: '20px' }}>🏦</span>SecureBank AI
        </h1>
        <p style={{ 
          fontFamily: 'Inter, sans-serif',
          color: 'var(--color-text-light)', 
          fontSize: '1.6rem', 
          fontWeight: '500',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.4',
          textShadow: 'none',
        }}>
          🤖 Sistem Prediksi Cerdas untuk Pemasaran Deposito Berjangka
        </p>
      </div>

      {/* Bagian Formulir Input (Kartu Glassmorphism) */}
      <div style={{ 
        ...glassCardStyle, 
        animation: 'slideInUp 1s ease-out 0.2s forwards', 
        opacity: 0, 
        backgroundColor: 'rgba(255, 255, 255, 0.35)', 
      }}>
        <h2 style={{ 
          ...sectionHeaderStyle,
          color: 'var(--color-accent-main)', 
          marginBottom: '35px'
        }}>
          📝 Input Data Nasabah
        </h2>
        <form onSubmit={handleSubmit} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          padding: '20px' 
        }}>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
              <label 
                htmlFor={key} 
                style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: '600', 
                  color: 'var(--color-text-main)', 
                  fontSize: '1rem' 
                }}
              >
                {/* Logika untuk melabeli input sesuai dengan nama fitur */}
                {key === 'age' ? 'Usia' :
                 key === 'job' ? 'Pekerjaan' :
                 key === 'marital' ? 'Status Pernikahan' :
                 key === 'education' ? 'Pendidikan' :
                 key === 'balance' ? 'Saldo Rekening (€)' :
                 key === 'default' ? 'Kredit Macet' :
                 key === 'housing' ? 'Pinjaman Rumah' :
                 key === 'loan' ? 'Pinjaman Pribadi' :
                 key === 'contact' ? 'Metode Kontak' :
                 key === 'month' ? 'Bulan' :
                 key === 'duration' ? 'Durasi Panggilan (detik)' :
                 key === 'campaign' ? 'Jumlah Kontak Kampanye Ini' :
                 key === 'pdays' ? 'Hari Sejak Kontak Terakhir (-1 = tidak pernah)' :
                 key === 'previous' ? 'Jumlah Kontak Kampanye Sebelumnya' :
                 key === 'poutcome' ? 'Hasil Kampanye Sebelumnya' :
                 key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {/* Fallback jika ada key baru */}
              </label>
              {/* Perbaikan di sini: gunakan categoricalFields untuk rendering kondisional */}
              {categoricalFields.includes(key) ? (
                <select
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', padding: '16px 15px', borderRadius: '15px', 
                    border: '1px solid var(--color-border-subtle)', 
                    fontSize: '1rem', 
                    backgroundColor: 'var(--color-subtle-neutral)', 
                    color: 'var(--color-text-main)', 
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23051937'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, 
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '18px 14px'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-main)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(84, 142, 248, 0.3)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.06)'; }}
                >
                  {/* Opsi dropdown juga disesuaikan bahasanya */}
                  {key === 'job' && ['admin.', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 'self-employed', 'services', 'student', 'technician', 'unemployed', 'unknown'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'admin.' ? 'Administrasi' : opt === 'blue-collar' ? 'Pekerja Kerah Biru' : opt === 'entrepreneur' ? 'Wiraswasta' : opt === 'housemaid' ? 'Pembantu Rumah Tangga' : opt === 'management' ? 'Manajemen' : opt === 'retired' ? 'Pensiunan' : opt === 'self-employed' ? 'Wirausaha' : opt === 'services' ? 'Pelayanan' : opt === 'student' ? 'Pelajar' : opt === 'technician' ? 'Teknisi' : opt === 'unemployed' ? 'Pengangguran' : 'Tidak Diketahui'}</option>)}
                  {key === 'marital' && ['married', 'single', 'divorced'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'married' ? 'Menikah' : opt === 'single' ? 'Lajang' : 'Bercerai'}</option>)}
                  {key === 'education' && ['primary', 'secondary', 'tertiary', 'unknown'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'primary' ? 'Sekolah Dasar' : opt === 'secondary' ? 'Sekolah Menengah' : opt === 'tertiary' ? 'Perguruan Tinggi' : 'Tidak Diketahui'}</option>)}
                  {key === 'default' && ['no', 'yes'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'no' ? 'Tidak' : 'Ya'}</option>)}
                  {key === 'housing' && ['no', 'yes'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'no' ? 'Tidak' : 'Ya'}</option>)}
                  {key === 'loan' && ['no', 'yes'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'no' ? 'Tidak' : 'Ya'}</option>)}
                  {key === 'contact' && ['cellular', 'telephone', 'unknown'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'cellular' ? 'Seluler' : opt === 'telephone' ? 'Telepon' : 'Tidak Diketahui'}</option>)}
                  {key === 'poutcome' && ['failure', 'other', 'success', 'unknown'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'failure' ? 'Gagal' : opt === 'other' ? 'Lainnya' : opt === 'success' ? 'Berhasil' : 'Tidak Diketahui'}</option>)}
                  {key === 'month' && ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(opt => <option key={opt} value={opt} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{opt === 'jan' ? 'Januari' : opt === 'feb' ? 'Februari' : opt === 'mar' ? 'Maret' : opt === 'apr' ? 'April' : opt === 'may' ? 'Mei' : opt === 'jun' ? 'Juni' : opt === 'jul' ? 'Juli' : opt === 'aug' ? 'Agustus' : opt === 'sep' ? 'September' : opt === 'oct' ? 'Oktober' : opt === 'nov' ? 'November' : 'Desember'}</option>)}
                  {!['job', 'marital', 'education', 'default', 'housing', 'loan', 'contact', 'poutcome', 'month'].includes(key) && (
                      <option value={value} style={{ color: 'var(--color-text-main)', backgroundColor: 'var(--color-light-background)' }}>{value}</option>
                  )}
                </select>
              ) : (
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={value} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', padding: '16px 15px', borderRadius: '15px', 
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '1rem', 
                    backgroundColor: 'var(--color-subtle-neutral)', 
                    color: 'var(--color-text-main)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-main)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(84, 142, 248, 0.3)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.06)'; }}
                />
              )}
            </div>
          ))}
          <button 
            type="submit" 
            disabled={loading} 
            style={{
              gridColumn: '1 / -1', 
              padding: '18px 35px', 
              background: loading ? 'rgba(84, 142, 248, 0.5)' : 'linear-gradient(45deg, var(--color-accent-main) 0%, #764ba2 100%)', 
              color: 'var(--color-text-on-accent)', 
              border: 'none', 
              borderRadius: '20px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              marginTop: '30px', 
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 10px 30px rgba(84, 142, 248, 0.5)', 
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(45deg, #764ba2 0%, var(--color-accent-main) 100%)'; 
                e.currentTarget.style.transform = 'translateY(-5px)'; 
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(84, 142, 248, 0.7)'; 
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(45deg, var(--color-accent-main) 0%, #764ba2 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(84, 142, 248, 0.5)';
              }
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div className="loading-spinner"></div> 
                <span>AI Sedang Menganalisis...</span>
              </div>
            ) : '🚀 Analisis Potensi Nasabah'}
          </button>
        </form>
      </div>

      {/* Tampilan Pesan Error */}
      {error && (
        <div style={{ 
          ...glassCardStyle, 
          backgroundColor: 'rgba(244, 67, 54, 0.15)', 
          border: '1px solid rgba(244, 67, 54, 0.4)', 
          color: 'var(--color-error)', 
          textAlign: 'center',
          fontWeight: 'bold',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <span style={{marginRight: '10px', fontSize: '1.5rem'}}>❌</span>Terjadi Kesalahan: {error}
        </div>
      )}

      {/* Tampilan Hasil Prediksi (Kartu Glassmorphism) */}
      {predictionResult && (
        <div style={{ 
          ...glassCardStyle, 
          backgroundColor: predictionResult.prediction === 'yes' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 193, 7, 0.15)', 
          border: predictionResult.prediction === 'yes' ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(255, 193, 7, 0.4)', 
          padding: '40px', 
          textAlign: 'center',
          animation: 'slideInUp 0.8s ease-out forwards' 
        }}>
          <h2 style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: predictionResult.prediction === 'yes' ? 'var(--color-success)' : 'var(--color-warning)', 
            marginBottom: '25px', 
            fontSize: '2.5rem', 
            fontWeight: '800' 
          }}>
            Hasil Prediksi:
          </h2>
          <p style={{ 
            fontSize: '3.5rem', 
            fontWeight: '900', 
            color: 'var(--color-text-main)', 
            marginBottom: '20px',
            textShadow: 'none', 
          }}>
            Akan Berlangganan Deposito Berjangka: 
            <span style={{ 
              color: predictionResult.prediction === 'yes' ? 'var(--color-success)' : 'var(--color-error)', 
              marginLeft: '25px',
              textShadow: predictionResult.prediction === 'yes' ? '0 0 10px rgba(40, 167, 69, 0.3)' : '0 0 10px rgba(220, 53, 69, 0.3)' 
            }}>
              {predictionResult.prediction === 'yes' ? 'YA' : 'TIDAK'} 
            </span>
          </p>
          <p style={{ 
            fontSize: '2rem', 
            color: 'var(--color-text-light)', 
            marginTop: '15px' 
          }}>
            Probabilitas &apos;Ya&apos;: <strong style={{ color: 'var(--color-accent-main)' }}>{(predictionResult.probability_yes * 100).toFixed(2)}%</strong>
          </p>
          
          {/* Chart Section for Prediction Probability */}
          <div style={{ marginTop: '30px', height: '200px', width: '100%', maxWidth: '400px', margin: '30px auto 0 auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={predictionChartData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 30, bottom: 0 }} 
              >
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  hide 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'var(--color-text-main)', fontSize: '1rem' }} 
                />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(2)}%`} 
                  contentStyle={{ 
                    background: 'var(--brand-dark-blue)', 
                    borderColor: 'var(--color-accent-main)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    padding: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  itemStyle={{ color: 'white' }}
                  labelStyle={{ color: 'white', fontWeight: 'bold' }} 
                />
                <Bar dataKey="value" barSize={40} radius={[10, 10, 10, 10]}> 
                  {
                    predictionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Probabilitas YA' ? 'var(--color-success)' : 'var(--color-error)'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--color-text-light)', 
            marginTop: '30px', 
            lineHeight: '1.6' 
          }}>
            Prediksi cerdas ini membantu dalam menargetkan nasabah secara lebih efektif dan mengoptimalkan sumber daya pemasaran untuk ROI maksimum.
          </p>

          {/* Kartu Rekomendasi (Glassmorphism dalam) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px', flexWrap: 'wrap' }}>
            {predictionResult.prediction === 'yes' ? (
              <>
                <div style={{ 
                  ...glassCardStyle, 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  padding: '30px',
                  minWidth: '320px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-success)', marginBottom: '15px', fontSize: '1.6rem' }}>🎯 Nasabah Prioritas Tinggi</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.8' }}> 
                    <li style={{ marginBottom: '10px' }}>🔥 Prioritas Tinggi: Masukkan ke daftar prioritas utama</li>
                    <li style={{ marginBottom: '10px' }}>📞 Tindak Lanjut Cepat: Hubungi dalam 24-48 jam</li>
                    <li style={{ marginBottom: '10px' }}>💎 Penawaran Premium: Tawarkan suku bunga khusus atau manfaat eksklusif</li>
                    <li>📅 Jadwalkan Pertemuan: Atur pertemuan personal dengan manajer hubungan</li>
                  </ul>
                </div>
                <div style={{ 
                  ...glassCardStyle, 
                  backgroundColor: 'rgba(84, 142, 248, 0.1)',
                  border: '1px solid rgba(84, 142, 248, 0.2)',
                  padding: '30px', 
                  minWidth: '320px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-accent-main)', marginBottom: '15px', fontSize: '1.6rem' }}>📈 Proyeksi Hasil</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.8' }}> 
                    <li style={{ marginBottom: '10px' }}>💰 Potensi Pendapatan: Tinggi</li>
                    <li style={{ marginBottom: '10px' }}>⚡ Kecepatan Konversi: Cepat</li>
                    <li style={{ marginBottom: '10px' }}>🤝 Nilai Hubungan: Jangka Panjang</li>
                    <li>📊 Tingkat Keberhasilan: {(predictionResult.probability_yes * 100).toFixed(1)}%</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ 
                  ...glassCardStyle, 
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.2)',
                  padding: '30px', 
                  minWidth: '320px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-warning)', marginBottom: '15px', fontSize: '1.6rem' }}>⚠️ Nasabah Membutuhkan Nurturing</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.8' }}> 
                    <li style={{ marginBottom: '10px' }}>🎯 Membangun Hubungan: Fokus pada pengembangan hubungan jangka panjang</li>
                    <li style={{ marginBottom: '10px' }}>📧 Pemasaran Email: Kirim informasi produk secara berkala</li>
                    <li style={{ marginBottom: '10px' }}>🎁 Produk Alternatif: Tawarkan produk lain yang lebih sesuai</li>
                    <li>📅 Tinjauan Masa Depan: Evaluasi kembali dalam 3-6 bulan</li>
                  </ul>
                </div>
                <div style={{ 
                  ...glassCardStyle, 
                  backgroundColor: 'rgba(84, 142, 248, 0.1)',
                  border: '1px solid rgba(84, 142, 248, 0.2)',
                  padding: '30px', 
                  minWidth: '320px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-accent-main)', marginBottom: '15px', fontSize: '1.6rem' }}>🔄 Pendekatan Alternatif</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.8' }}> 
                    <li style={{ marginBottom: '10px' }}>💳 Rekening Tabungan: Fokus pada produk tabungan</li>
                    <li style={{ marginBottom: '10px' }}>🏠 Kredit Pemilikan Rumah: Prioritaskan penawaran kredit properti</li>
                    <li style={{ marginBottom: '10px' }}>💎 Investasi: Pertimbangkan produk investasi</li>
                    <li>📱 Perbankan Digital: Tawarkan layanan digital</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
