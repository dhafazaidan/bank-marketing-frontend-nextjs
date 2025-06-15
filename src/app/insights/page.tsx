/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/app/insights/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  ScatterChart, Scatter, ZAxis, Cell 
} from 'recharts';
import GlassChartCard from '../../components/GlassChartCard'; 

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

interface AgeDistributionData {
  age_group: string;
  'Tidak Berlangganan': number;
  'Berlangganan': number;
}

interface BalanceDurationSampleData {
  balance: number;
  duration: number;
  y: string; 
  y_label: string; 
}


export default function DataInsightsPage() {
  const [ageDistribution, setAgeDistribution] = useState<AgeDistributionData[]>([]);
  const [balanceDurationSample, setBalanceDurationSample] = useState<BalanceDurationSampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          ageDistRes,
          balanceDurRes,
        ] = await Promise.all([
          fetch(`${BACKEND_API_BASE_URL}/api/insights/age-distribution`),
          fetch(`${BACKEND_API_BASE_URL}/api/insights/balance-duration-sample`),
        ]);

        const ageDistData = await ageDistRes.json();
        const balanceDurData = await balanceDurRes.json();

        if (!ageDistRes.ok) throw new Error(ageDistData.detail || 'Gagal mengambil distribusi usia.');
        if (!balanceDurRes.ok) throw new Error(balanceDurData.detail || 'Gagal mengambil data sampel saldo/durasi.');

        // Pastikan data numerik valid sebelum disimpan ke state
        const cleanedBalanceDurData = balanceDurData.map((item: BalanceDurationSampleData) => ({
          ...item,
          balance: typeof item.balance === 'number' && !isNaN(item.balance) ? item.balance : 0, // Fallback ke 0 jika NaN
          duration: typeof item.duration === 'number' && !isNaN(item.duration) ? item.duration : 0, // Fallback ke 0 jika NaN
        }));


        setAgeDistribution(ageDistData);
        setBalanceDurationSample(cleanedBalanceDurData); // Gunakan data yang sudah dibersihkan

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Terjadi kesalahan saat memuat data insights.');
        } else {
          setError('Terjadi kesalahan tidak dikenal saat memuat data insights.');
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
        <p style={{ color: 'var(--color-text-main)', fontSize: '1.2rem' }}>Memuat data insights...</p>
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
        📈 Data Insights & Analisis
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
          Dapatkan pemahaman mendalam tentang karakteristik nasabah dan faktor-faktor kunci yang memengaruhi keputusan langganan deposito.
      </p>

      {/* Overview Section - Static Content from Streamlit */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        <div style={{ ...glassCardStyle, flex: 1, minWidth: '300px', maxWidth: 'calc(50% - 15px)' }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-text-main)', marginBottom: '15px', fontSize: '1.6rem' }}>📊 Gambaran Umum Dataset</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-light)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>📈 Total Records: 45,211 nasabah</li>
            <li style={{ marginBottom: '10px' }}>🎯 Fitur: 16 input + 1 target</li>
            <li style={{ marginBottom: '10px' }}>✅ Kualitas Data: Tidak ada nilai hilang</li>
            <li>⚖️ Distribusi Kelas: 88.3% Tidak, 11.7% Ya</li>
          </ul>
        </div>
        <div style={{ ...glassCardStyle, flex: 1, minWidth: '300px', maxWidth: 'calc(50% - 15px)' }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-accent-main)', marginBottom: '15px', fontSize: '1.6rem' }}>🎯 Wawasan Bisnis Utama</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-light)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>⏱️ Durasi Panggilan: Prediktor terkuat</li>
            <li style={{ marginBottom: '10px' }}>📱 Metode Kontak: Seluler &gt; Telepon</li>
            <li style={{ marginBottom: '10px' }}>🏆 Keberhasilan Sebelumnya: Meningkatkan probabilitas</li>
            <li>👥 Grup Usia: 30-60 tahun rentang optimal</li>
          </ul>
        </div>
      </div>

      {/* Charts Section for Data Insights */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        {/* Distribusi Usia per Target (Bar Chart) */}
        <GlassChartCard title="👥 Distribusi Usia Berdasarkan Status Langganan" height="500px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="age_group" tick={{ fill: 'var(--color-text-main)', fontSize: '0.9rem' }} label={{ value: 'Grup Usia', position: 'insideBottom', dy: 10, fill: 'var(--color-text-light)' }} />
              <YAxis tick={{ fill: 'var(--color-text-main)', fontSize: '0.9rem' }} label={{ value: 'Jumlah Nasabah', angle: -90, position: 'insideLeft', fill: 'var(--color-text-light)' }} />
              <Tooltip 
                contentStyle={{ background: 'var(--brand-dark-blue)', borderColor: 'var(--color-accent-main)', color: 'white', borderRadius: '8px', padding: '10px' }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--color-text-main)', fontSize: '0.9rem' }} iconType="square" />
              <Bar dataKey="Berlangganan" fill="var(--color-success)" name="Berlangganan" />
              <Bar dataKey="Tidak Berlangganan" fill="var(--color-error)" name="Tidak Berlangganan" />
            </BarChart>
          </ResponsiveContainer>
        </GlassChartCard>

        {/* Saldo Rekening vs. Durasi Panggilan (Scatter Plot) */}
        <GlassChartCard title="💰 Saldo Rekening vs. Durasi Panggilan" height="500px">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                type="number" 
                dataKey="balance" 
                name="Saldo Rekening (€)" 
                unit="€" 
                tick={{ fill: 'var(--color-text-main)', fontSize: '0.9rem' }} 
                label={{ value: 'Saldo Rekening (€)', position: 'insideBottom', dy: 10, fill: 'var(--color-text-light)' }} 
              />
              <YAxis 
                type="number" 
                dataKey="duration" 
                name="Durasi Panggilan" 
                unit="s" 
                tick={{ fill: 'var(--color-text-main)', fontSize: '0.9rem' }} 
                label={{ value: 'Durasi Panggilan (detik)', angle: -90, position: 'insideLeft', fill: 'var(--color-text-light)' }} 
              />
              <ZAxis dataKey="y" range={[60, 400]} name="Status" /> {/* Ukuran titik berdasarkan status, range disesuaikan */}
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                formatter={(value: number, name: string, props: any) => {
                    if (name === 'balance') return [`${value.toLocaleString()} €`, 'Saldo'];
                    if (name === 'duration') return [`${value.toLocaleString()} s`, 'Durasi'];
                    if (name === 'y_label') return [props.payload.y_label, 'Status Langganan']; // Tampilkan label yang sudah diterjemahkan
                    return [value.toLocaleString(), name];
                }}
                contentStyle={{ background: 'var(--brand-dark-blue)', borderColor: 'var(--color-accent-main)', color: 'white', borderRadius: '8px', padding: '10px' }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--color-text-main)', fontSize: '0.9rem' }} />
              <Scatter data={balanceDurationSample} dataKey="y_label" name="Status Langganan">
                {
                    balanceDurationSample.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.y === 'yes' ? 'var(--color-success)' : 'var(--color-error)'} />
                    ))
                }
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </GlassChartCard>
      </div>
    </div>
  );
}
