import { Router } from 'express';
import { githubSignIn, singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter
    .post('/sign-in', validateBody(signInSchema), singInPost)
    .post('/sign-in-github', githubSignIn);


export { authenticationRouter };
