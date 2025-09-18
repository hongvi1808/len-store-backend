import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;
  constructor(
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleLogin(idToken: string) {
    // verify id token with Google
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException('Invalid Google token');

    const email = payload.email!;
    const googleId = payload.sub!;
    const name = payload.name || '';
    const picture = payload.picture || '';




    return payload;
  }
}
