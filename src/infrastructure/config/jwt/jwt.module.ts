import { JwtModule } from "@nestjs/jwt";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { JWT_EXPIRATION_FORMAT, JWT_EXPIRATION_TIME } from "src/application/enums";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const expirationTime: string = JWT_EXPIRATION_TIME;
        const expirationFormat: string = JWT_EXPIRATION_FORMAT;
        const expiresIn: string = `${expirationTime}${expirationFormat}`;

        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JWTModule {}
