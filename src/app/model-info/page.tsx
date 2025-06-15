// frontend/src/app/model-info/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import GlassChartCard from '../../components/InfoCard';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

// Interface untuk data model info
interface ModelInfoData {
  model_name: string;
  model_type: string;
  accuracy?: number; // Jadikan optional karena mungkin tidak ada
  precision?: number;
  recall?: number;
  'F1-Score'?: number;
  'AUC-ROC'?: number;
  'CV Folds'?: number;
  'CV Score'?: string; // Jadikan optional
}

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/model-info`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Gagal mengambil informasi model.');
        }

        // Pastikan format data numerik yang benar dan ada.
        // Konversi ke Number jika perlu dan atasi N/A atau missing data.
        const cleanedData: ModelInfoData = {
          ...data,
          // Menggunakan `!isNaN(parseFloat(...))` untuk memastikan angka valid, kalau tidak set undefined
          accuracy: (data.accuracy !== undefined && !isNaN(parseFloat(data.accuracy))) ? parseFloat(data.accuracy) : undefined, 
          precision: (data.precision !== undefined && !isNaN(parseFloat(data.precision))) ? parseFloat(data.precision) : undefined,
          recall: (data.recall !== undefined && !isNaN(parseFloat(data.recall))) ? parseFloat(data.recall) : undefined,
          'F1-Score': (data['F1-Score'] !== undefined && !isNaN(parseFloat(data['F1-Score']))) ? parseFloat(data['F1-Score']) : undefined,
          'AUC-ROC': (data['AUC-ROC'] !== undefined && !isNaN(parseFloat(data['AUC-ROC']))) ? parseFloat(data['AUC-ROC']) : undefined,
          'CV Folds': (data['CV Folds'] !== undefined && !isNaN(parseInt(data['CV Folds'], 10))) ? parseInt(data['CV Folds'], 10) : undefined,
          'CV Score': data['CV Score'] || undefined, // Set undefined jika null/kosong
        };
        setModelInfo(cleanedData);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Terjadi kesalahan saat memuat informasi model.');
        } else {
          setError('Terjadi kesalahan tidak dikenal saat memuat informasi model.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const glassCardStyle: React.CSSProperties = {
    background: 'var(--color-glass-bg)',
    borderRadius: '25px',
    boxShadow: '0 8px 32px 0 var(--color-glass-shadow)',
    backdropFilter: 'blur(8px) saturate(180%)',
    WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    border: '1px solid var(--color-glass-border)',
    padding: '30px',
    transition: 'all 0.3s ease-in-out',
  };

  if (loading) {
    return (
      <div style={{ ...glassCardStyle, textAlign: 'center', padding: '50px', margin: 'auto', minHeight: '300px' }}>
        <div className="loading-spinner" style={{ borderTopColor: 'var(--color-accent-main)' }}></div>
        <p style={{ color: 'var(--color-text-main)', fontSize: '1.2rem' }}>Memuat informasi model...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...glassCardStyle, textAlign: 'center', padding: '50px', margin: 'auto', backgroundColor: 'rgba(244, 67, 54, 0.15)', border: '1px solid rgba(244, 67, 54, 0.4)', color: 'var(--color-error)' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Terjadi Kesalahan: {error}</p>
      </div>
    );
  }

  const infoTextStyle: React.CSSProperties = {
    color: 'var(--color-text-light)',
    fontSize: '1.1rem',
    lineHeight: '1.6', // Slightly reduced line height for compactness, adjust if needed
  };

  const listItemStyle: React.CSSProperties = {
    marginBottom: '8px', // Increased margin bottom slightly for more spacing
    display: 'flex',
    alignItems: 'flex-start', // Align items to the start of the line
    gap: '10px', // Space between icon and text
  };

  const listIconStyle: React.CSSProperties = {
    fontSize: '1.3rem',
    lineHeight: 1, // Ensures icon is vertically centered with text
    flexShrink: 0, // Prevent icon from shrinking
  };

  const textContentStyle: React.CSSProperties = {
    flex: 1, // Allow text content to take remaining space and wrap
    wordBreak: 'break-word', // Ensure long words break
    overflowWrap: 'break-word', // Ensure wrapping for long strings
  };

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
      fontFamily: 'Inter, sans-serif',
      color: 'var(--color-text-main)'
    }}>
      <h1 style={{
        fontFamily: 'Poppins, sans-serif',
        color: 'var(--color-text-main)',
        fontSize: '3.2rem',
        marginBottom: '0.8rem',
        fontWeight: '800',
        textAlign: 'center',
        textShadow: 'none',
      }}>
        ℹ️ Informasi & Performa Model
      </h1>
      <p style={{
          fontFamily: 'Inter, sans-serif',
          color: 'var(--color-text-light)',
          fontSize: '1.4rem',
          fontWeight: '500',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.4',
          textAlign: 'center',
          textShadow: 'none',
        }}>
          Dapatkan detail teknis, metrik performa, analisis dampak bisnis, dan metodologi pengembangan model.
      </p>

      {/* Model Performance Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        <GlassChartCard title="🤖 Performa Model" flexGrow={1} minWidth="450px"> {/* Increased minWidth again */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, ...infoTextStyle }}>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🏆</span>
              <span style={textContentStyle}><strong>Model Terbaik</strong>: {modelInfo?.model_name || 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>⚙️</span>
              <span style={textContentStyle}><strong>Tipe Model</strong>: {modelInfo?.model_type || 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>✅</span>
              <span style={textContentStyle}><strong>Akurasi Uji</strong>: {modelInfo?.accuracy !== undefined && !isNaN(modelInfo.accuracy) ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🎯</span>
              <span style={textContentStyle}><strong>Presisi</strong>: {modelInfo?.precision !== undefined && !isNaN(modelInfo.precision) ? `${(modelInfo.precision * 100).toFixed(1)}%` : 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📈</span>
              <span style={textContentStyle}><strong>Recall</strong>: {modelInfo?.recall !== undefined && !isNaN(modelInfo.recall) ? `${(modelInfo.recall * 100).toFixed(1)}%` : 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>⚖️</span>
              <span style={textContentStyle}><strong>F1-Score</strong>: {modelInfo?.['F1-Score'] !== undefined && !isNaN(modelInfo['F1-Score']) ? modelInfo['F1-Score'].toFixed(3) : 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📊</span>
              <span style={textContentStyle}><strong>AUC-ROC</strong>: {modelInfo?.['AUC-ROC'] !== undefined && !isNaN(modelInfo['AUC-ROC']) ? modelInfo['AUC-ROC'].toFixed(3) : 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🔬</span>
              <span style={textContentStyle}><strong>Lipatan Validasi Silang</strong>: {modelInfo?.['CV Folds'] !== undefined && !isNaN(modelInfo['CV Folds']) ? modelInfo['CV Folds'] : 'N/A'}</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📊</span>
              <span style={textContentStyle}><strong>Skor Validasi Silang</strong>: {modelInfo?.['CV Score'] || 'N/A'}</span>
            </li>
          </ul>
        </GlassChartCard>

        <GlassChartCard title="💼 Analisis Dampak Bisnis" flexGrow={1} minWidth="450px"> {/* Increased minWidth again */}
          <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-accent-main)', marginBottom: '15px', fontSize: '1.4rem' }}>📈 Interpretasi Performa:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', ...infoTextStyle }}>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🎯</span>
              <span style={textContentStyle}><strong>Presisi ~50.1%</strong>: Dari nasabah yang diprediksi akan berlangganan, sekitar 50.1% benar-benar akan berlangganan. Ini penting untuk mengurangi *false positive* dan biaya pemasaran yang tidak perlu.</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📊</span>
              <span style={textContentStyle}><strong>Recall ~71.6%</strong>: Dari nasabah yang sebenarnya akan berlangganan, sekitar 71.6% berhasil diidentifikasi oleh model. Ini memastikan kita tidak melewatkan banyak peluang bisnis.</span>
            </li>
          </ul>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-accent-main)', marginBottom: '15px', fontSize: '1.4rem' }}>💰 Proyeksi ROI:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, ...infoTextStyle }}>
            <li style={listItemStyle}>
              <span style={listIconStyle}>💸</span>
              <span style={textContentStyle}><strong>Pengurangan Biaya</strong>: ~70% (dari $500K ke $150K)</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📈</span>
              <span style={textContentStyle}><strong>Peningkatan Efisiensi</strong>: 3x akurasi penargetan</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🎯</span>
              <span style={textContentStyle}><strong>Peningkatan Konversi</strong>: +67% (target 20%+)</span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>💰</span>
              <span style={textContentStyle}><strong>Potensi Penghematan Tahunan</strong>: &gt; $350,000</span>
            </li>
          </ul>
        </GlassChartCard>
      </div>

      {/* Technical Stack & CRISP-DM Methodology Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        <GlassChartCard title="🛠️ Tumpukan Teknis" flexGrow={1} minWidth="400px"> {/* Adjust minWidth */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, ...infoTextStyle }}>
            <li style={listItemStyle}>
              <span style={listIconStyle}>⚙️</span>
              <span style={textContentStyle}><strong>Pra-pemrosesan Data:</strong></span>
            </li>
            <ul style={{ listStyle: 'circle', paddingLeft: '30px', margin: '0 0 15px 0', color: 'var(--color-text-light)', lineHeight: '1.6' }}>
              <li>Rekayasa Fitur (grup usia, kategori)</li>
              <li>One-Hot Encoding (kategorikal)</li>
              <li>Standard Scaling (numerik)</li>
              <li>SMOTE (penyeimbangan kelas)</li>
            </ul>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🤖</span>
              <span style={textContentStyle}><strong>Algoritma Model:</strong></span>
            </li>
            <ul style={{ listStyle: 'circle', paddingLeft: '30px', margin: 0, color: 'var(--color-text-light)', lineHeight: '1.6' }}>
              <li>Gradient Boosting Classifier</li>
              <li>100 estimator</li>
              <li>Random state: 42</li>
            </ul>
          </ul>
        </GlassChartCard>

        <GlassChartCard title="📋 Metodologi CRISP-DM" flexGrow={1} minWidth="400px"> {/* Adjust minWidth */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, ...infoTextStyle }}>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🎯</span>
              <span style={textContentStyle}><strong>1. Pemahaman Bisnis</strong>: Analisis kebutuhan & tujuan bisnis. <strong style={{color: 'var(--color-success)'}}>✅ Selesai</strong></span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📊</span>
              <span style={textContentStyle}><strong>2. Pemahaman Data</strong>: EDA & analisis 45,211 catatan. <strong style={{color: 'var(--color-success)'}}>✅ Selesai</strong></span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🛠️</span>
              <span style={textContentStyle}><strong>3. Persiapan Data</strong>: Rekayasa fitur & pra-pemrosesan. <strong style={{color: 'var(--color-success)'}}>✅ Selesai</strong></span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🤖</span>
              <span style={textContentStyle}><strong>4. Pemodelan</strong>: Pelatihan & evaluasi berbagai algoritma. <strong style={{color: 'var(--color-success)'}}>✅ Selesai</strong></span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>📈</span>
              <span style={textContentStyle}><strong>5. Evaluasi</strong>: Penilaian performa & validasi. <strong style={{color: 'var(--color-success)'}}>✅ Selesai</strong></span>
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>🚀</span>
              <span style={textContentStyle}><strong>6. Implementasi</strong>: Aplikasi web Next.js & API prediksi. <strong style={{color: 'var(--color-accent-main)'}}>✅ Sedang Berlangsung</strong></span>
            </li>
          </ul>
        </GlassChartCard>
      </div>
    </div>
  );
}
