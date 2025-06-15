// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import GlassChartCard from '../../components/GlassChartCard'; // Import GlassChartCard

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

interface TargetDistributionData {
  label: string;
  value: number;
}

interface JobSuccessData {
  job: string;
  success_rate: number;
}

interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

export default function DashboardPage() {
  const [targetDistribution, setTargetDistribution] = useState<TargetDistributionData[]>([]);
  const [jobSuccessRate, setJobSuccessRate] = useState<JobSuccessData[]>([]);
  const [kpiData, setKpiData] = useState({
    totalCustomers: 0,
    overallSuccessRate: 0,
    avgCallDuration: 0,
    avgCustomerAge: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Mengubah default ke null

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          targetRes,
          jobRes,
        ] = await Promise.all([
          fetch(`${BACKEND_API_BASE_URL}/api/dashboard/target-distribution`),
          fetch(`${BACKEND_API_BASE_URL}/api/dashboard/job-success-rate`),
        ]);

        const targetData = await targetRes.json();
        const jobData = await jobRes.json();

        if (!targetRes.ok) throw new Error(targetData.detail || 'Gagal mengambil distribusi target');
        if (!jobRes.ok) throw new Error(jobData.detail || 'Gagal mengambil tingkat keberhasilan pekerjaan');

        setTargetDistribution(targetData);
        setJobSuccessRate(jobData);

        // Simulate KPI data (replace with actual API calls if backend provides them)
        const totalCustomers = 45211; 
        const overallSuccessRate = 11.7; 
        const avgCallDuration = 263; 
        const avgCustomerAge = 41; 

        setKpiData({ totalCustomers, overallSuccessRate, avgCallDuration, avgCustomerAge });

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Terjadi kesalahan saat memuat data dashboard.');
        } else {
          setError('Terjadi kesalahan tidak dikenal saat memuat data dashboard.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieChartLabelProps) => {
    // Menempatkan label tepat di tengah antara innerRadius dan outerRadius
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const PIE_COLORS = ['#FF6B6B', '#51CF66']; // Colors for 'Tidak Berlangganan' (Red) and 'Berlangganan' (Green)

  // glassCardStyle di sini agar bisa digunakan di loading/error state
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
        <p style={{ color: 'var(--color-text-main)', fontSize: '1.2rem' }}>Memuat data dashboard...</p>
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
        📊 Dashboard Analitik Real-Time
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
          Dapatkan gambaran menyeluruh tentang kinerja pemasaran dan karakteristik nasabah bank Anda.
      </p>

      {/* KPI Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ ...glassCardStyle, textAlign: 'center', padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '10px' }}>Total Nasabah</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent-main)' }}>{kpiData.totalCustomers.toLocaleString()}</p>
        </div>
        <div style={{ ...glassCardStyle, textAlign: 'center', padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '10px' }}>Tingkat Keberhasilan</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{kpiData.overallSuccessRate.toFixed(1)}%</p>
        </div>
        <div style={{ ...glassCardStyle, textAlign: 'center', padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '10px' }}>Rata-rata Durasi Panggilan</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{kpiData.avgCallDuration}s</p>
        </div>
        <div style={{ ...glassCardStyle, textAlign: 'center', padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '10px' }}>Rata-rata Usia Nasabah</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{kpiData.avgCustomerAge}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        <GlassChartCard title="🎯 Distribusi Target Nasabah (Deposito)" height="550px"> {/* Increased height for more space */}
          <ResponsiveContainer width="100%" height="100%">
            {/* margin disesuaikan untuk memberikan ruang lebih di atas dan bawah */}
            <PieChart margin={{ top: 40, right: 0, left: 0, bottom: 40 }}> 
              <Pie
                data={targetDistribution}
                cx="50%"
                cy="50%" 
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150} 
                innerRadius={80} 
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5} 
              >
                {targetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()}`} 
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
              <Legend 
                wrapperStyle={{ 
                  position: 'absolute', 
                  bottom: '0px', // Posisikan tepat di bagian bawah container chart
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px', 
                  color: 'var(--color-text-main)', 
                  fontSize: '0.9rem',
                }} 
                iconType="circle"
                verticalAlign="bottom" 
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassChartCard>

        <GlassChartCard title="💼 Tingkat Keberhasilan Berdasarkan Kategori Pekerjaan" height="550px"> {/* Increased height for consistency */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={jobSuccessRate}
              layout="vertical"
              margin={{ top: 20, right: 40, left: 150, bottom: 20 }} 
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                type="number" 
                dataKey="success_rate" 
                domain={[0, 'auto']} 
                label={{ value: 'Tingkat Keberhasilan (%)', position: 'insideBottom', dy: 10, fill: 'var(--color-text-light)' }} 
                tick={{ fill: 'var(--color-text-main)', fontSize: '0.9rem' }} 
                stroke="var(--color-border-subtle)" 
              />
              <YAxis 
                type="category" 
                dataKey="job" 
                width={150} 
                tickLine={false} 
                label={{ value: 'Pekerjaan', angle: -90, position: 'insideLeft', dx: -10, fill: 'var(--color-text-light)' }} 
                tick={{ fill: 'var(--color-text-main)', fontSize: '0.9rem' }} 
                stroke="var(--color-border-subtle)" 
              />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}%`} 
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
              <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--color-text-main)', fontSize: '0.9rem' }} iconType="square" />
              <Bar dataKey="success_rate" name="Tingkat Keberhasilan" barSize={30}>
                {jobSuccessRate.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.success_rate > 15 ? 'var(--color-success)' : entry.success_rate > 10 ? 'var(--color-warning)' : 'var(--color-error)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassChartCard>
      </div>
    </div>
  );
}
