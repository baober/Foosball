export interface PlayerRanking {
  playerId: string
  season: string
  rank: number
  winRate: number
  wins: number
  totalGames: number
  lastMatchAt: Date
}

export interface TeamRanking {
  team: [string, string]
  season: string
  rank: number
  winRate: number
  wins: number
  totalGames: number
}

export type RankingType = 'player' | 'team'