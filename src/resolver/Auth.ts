import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";
import { AppContext } from "../utils/AppContext";
import { getAccessToken, getRefreshToken } from "../utils/getToken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class AuthResolver {
  @Query(() => String)
  helloAuth() {
    return "Hello Auth!";
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: AppContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found.");
    }
    const valid = await compare(password, user.hashPassword);
    if (!valid) {
      throw new Error("Wrong password.");
    }
    //TODO: generate accessToken
    res.cookie("__reToken", getRefreshToken(user.id), { httpOnly: true });

    return {
      accessToken: getAccessToken(user.id),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = await User.findOne({ where: { email } });
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
