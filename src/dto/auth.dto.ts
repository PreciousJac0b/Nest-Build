import { UserDTO } from "./user.dto.js";

export class AuthReturnDTO {
  success: boolean;
  message: string;
  data?: UserDTO;
}
