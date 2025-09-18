import { IsString } from "class-validator";

export class UserDataCallback {
  id: string;
  @IsString()
  email: string;
  @IsString()
  fullName: string;
}