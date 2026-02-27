import * as bcrypt from 'bcrypt';


export class HashUtil {
  private static readonly SALT_ROUNDS = 10;
  // private static readonly ENCRYPTION_KEY = 

  static async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    return hashedPassword;
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}