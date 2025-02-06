import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
