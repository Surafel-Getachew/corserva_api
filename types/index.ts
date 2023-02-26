export interface IPaginatedResult {
  next?: {
    page: number
    limit: number
  }
  previous?: {
    page: number
    limit: number
  }
  results: never[]
}
