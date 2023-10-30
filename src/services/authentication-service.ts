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
  delete user.password;
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

async function getUser(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  return user;
}

async function createSession(userId: number) {
  console.log(userId)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });
console.log(token)
  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function loginUserWithGitHub(code:string) {
  const tokenGithub = await exchangeCodeForAcessToken(code);
  const emailsGithub = await fetchEmailGitHub(tokenGithub);
  const userGithub = await fetchUserGitHub(tokenGithub);


  let user;
  for (let i = 0; i < emailsGithub.length; i++) {
    user = await getUser(emailsGithub[i].email) || await userRepository.create({email: emailsGithub[i].email, password: 'registeredByGithub'});
    console.log(user)
    if(user)
    {
      const token = await createSession(user.id);
      delete user.password
      await setRedis(`user-${token}`, JSON.stringify(user));
      
      return {user, token};
    }
  }
  if (!user) throw invalidCredentialsError();

}

async function fetchUserGitHub(token:string) {
  const GITHUB_ACCESS_USER_URL = "https://api.github.com/user";
  const response = await axios.get(GITHUB_ACCESS_USER_URL,{
    headers : {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function fetchEmailGitHub(token:string) {
  const GITHUB_ACCESS_USER_URL = "https://api.github.com/user/emails";
  const response = await axios.get(GITHUB_ACCESS_USER_URL,{
    headers : {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
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
