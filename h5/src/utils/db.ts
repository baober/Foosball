import Dexie, { type Table } from 'dexie'
import type { Player } from '@/types/player'
import type { Match } from '@/types/match'
import type { PlayerRanking, TeamRanking } from '@/types/ranking'

export class BallDatabase extends Dexie {
  players!: Table<Player>
  matches!: Table<Match>
  playerRankings!: Table<PlayerRanking>
  teamRankings!: Table<TeamRanking>

  constructor() {
    super('BallGameDB')
    this.version(1).stores({
      players: 'id, name, type, isPresent, createdAt',
      matches: 'id, season, teamA, teamB, playedAt, createdAt',
      playerRankings: '[playerId+season], season, rank, winRate',
      teamRankings: '[team+season], season, rank, winRate'
    })
  }
}

export const db = new BallDatabase()