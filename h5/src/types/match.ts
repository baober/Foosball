export type Winner = 'A' | 'B'

export interface Match {
  id: string
  season: string
  teamA: [string, string]
  teamB: [string, string]
  scoreA: number
  scoreB: number
  winner: Winner
  playedAt: Date
  createdAt: Date
}

export interface MatchForm {
  teamA: [string, string]
  teamB: [string, string]
  scoreA: number
  scoreB: number
}