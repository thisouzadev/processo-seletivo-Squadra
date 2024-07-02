import { PokemonStats } from '@/types'
import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

interface StatsRadarChartProps {
  stats: PokemonStats
}

const StatsRadarChart: React.FC<StatsRadarChartProps> = ({ stats }) => {
  const data = [
    { subject: 'HP', value: stats.HP, fullMark: 255 },
    { subject: 'Attack', value: stats.Attack, fullMark: 255 },
    { subject: 'Defense', value: stats.Defense, fullMark: 255 },
    { subject: 'Special Attack', value: stats.SpecialAttack, fullMark: 255 },
    { subject: 'Special Defense', value: stats.SpecialDefense, fullMark: 255 },
    { subject: 'Speed', value: stats.Speed, fullMark: 255 },
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default StatsRadarChart
