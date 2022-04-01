import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entity/User";
import { AppContext } from "../utils/AppContext";
import { isAuth } from "../utils/isAuth";

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  helloUser(@Ctx() { user }: AppContext) {
    return "Email = " + user.email;
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getAll() {
    return await User.find();
  }
}
