import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from '@/errors';
import { authenticationRepository, userRepository } from '@/repositories';
import { getRedis, setRedis } from '@/redisConfig';
import axios from 'axios';
import qs from "query-string"
import dotenv from "dotenv";
dotenv.config();

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);
  delete user.password
  await setRedis(`user-${token}`, JSON.stringify(user));

  return {
    user,
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();
  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function loginUserWithGitHub(code:string) {
  const token = exchangeCodeForAcessToken(code);
  return token;
}

async function exchangeCodeForAcessToken(code:string) {
  const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params: GitHubParamsForAccessToken = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }

  const { data } =  await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const { access_token } = qs.parse(data);
  return Array.isArray(access_token) ? access_token.join("") : access_token;
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

type GitHubParamsForAccessToken = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}

export const authenticationService = {
  signIn, loginUserWithGitHub
};
