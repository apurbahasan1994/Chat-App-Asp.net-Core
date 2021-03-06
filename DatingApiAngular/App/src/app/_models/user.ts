import { Photo } from "./photo";

export interface User {
  id: number;
  userName: string;
  knownAs: string;
  age: number;
  gender: string;
  createdAt: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string
  Interest?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];

}
