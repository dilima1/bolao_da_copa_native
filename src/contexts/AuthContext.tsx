import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();


interface UserProps {
  name: string;
  avatarUrl: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthProviderProps) {

  const [ user, setUser ] = useState<UserProps>({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: '380087563389-jn7ae7crpek2h73bp3rtrk3f2t7vqvoq.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })
  
  const signIn = async () => {
    try {
      setIsUserLoading(true);
      await promptAsync()

    } catch (error) {
      console.log(error);
      throw error;
      
    } finally {
      setIsUserLoading(false);
    }
  }

  const signInWithGoogle = async (access_token: string) => {
    console.log("TOKEN DE AUTENTICACÃO ===>", access_token); 
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])



  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      { children }
    </AuthContext.Provider>  
  );
}