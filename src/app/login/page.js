import LoginForm from './LoginForm';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your Athlofit account to shop with earned coins and track your fitness rewards.',
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginForm />;
}
