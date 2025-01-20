export class CreateReviewDto {
  bookId: string; // ID of the book being reviewed
  userId: string; // ID of the user creating the review
  comment: string; // Review comment
  rating: number; // Star rating (1–5)
}