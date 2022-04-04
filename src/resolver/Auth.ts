import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";
import { Session } from "../entity/Session";
import { AppContext } from "../utils/AppContext";
import { getAccessToken, getRefreshToken } from "../utils/getToken";
import { convertMany } from 'convert';
import moment from "moment";

@Resolver()
export class AuthResolver {
  @Mutation(() => Session)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req, res }: AppContext
  ): Promise<Session | undefined> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    const valid = await compare(password, user.hashPassword);
    if (!valid) {
      throw new Error("Wrong password.");
    }

    const accessToken = getAccessToken(user.id);
    const refreshToken = getRefreshToken(user.id);

    const session = await Session.insert({
      user: user,
      userAgent: req.get('User-Agent'),
      accessToken,
      refreshToken,
      expiredDate: moment().add(convertMany(process.env.EXPIRES_IN!).to('minutes'), 'minutes'),
    });

    //TODO: generate accessToken
    res.cookie("__reToken", refreshToken, { httpOnly: true });
    return await Session.findOne({ id: session.identifiers[0].id });
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email already in use.");
    }
    try {
      const hashPassword = await hash(password, 12);
      await User.insert({ email, hashPassword });
    } catch (error) {
      throw error;
    }
    return true;
  }
}
