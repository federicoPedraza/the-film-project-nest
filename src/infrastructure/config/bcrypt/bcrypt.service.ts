import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BcryptService {
  private HASH_ROUNDS: number;

  constructor(private configService: ConfigService) {
    this.HASH_ROUNDS = parseInt(configService.get("HASH_ROUNDS"));
  }

  async encriptPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.HASH_ROUNDS, (err, salt) => {
        if (err) reject(err);
        bcrypt.hash(password, salt, (error, hash) => {
          if (error) reject(error);

          return resolve(hash);
        });
      });
    });
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, function (err, isMatch) {
        if (err) reject(err);

        return resolve(isMatch);
      });
    });
  }
}
