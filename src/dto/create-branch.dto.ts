export class CreateBranchDto {
  name!: string; // Name of the branch
  address!: string; // Address of the branch
  books!: string[]; // Array of book IDs
}
