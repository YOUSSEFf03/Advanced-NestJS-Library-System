export class CreateUserDto {
    email!: string;
    password!: string;
    role!: string;
    returnRate!: number;
    borrowHistory!: string[]; // Array of borrow history IDs
  }

