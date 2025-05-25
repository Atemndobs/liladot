import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, CheckCircle2, Github, Mail } from 'lucide-react';
import { config } from '@/config';

// Password strength meter styles
const passwordMeterStyles = {
  container: 'relative h-2 w-full bg-gray-200 rounded-full overflow-hidden',
  meter: 'h-full rounded-full transition-all duration-300',
  empty: 'bg-gray-200 w-0',
  weak: 'bg-red-500',
  medium: 'bg-yellow-500',
  strong: 'bg-green-500',
  width: (percent: number) => ({ width: `${percent}%` })
};

// Password strength checker
const getPasswordStrength = (password: string) => {
  const requirements = [
    { regex: /.{8,}/, label: 'At least 8 characters' }, // min 8 chars
    { regex: /[0-9]/, label: 'At least one number' }, // numbers
    { regex: /[a-z]/, label: 'At least one lowercase letter' }, // lowercase
    { regex: /[A-Z]/, label: 'At least one uppercase letter' }, // uppercase
    { regex: /[^A-Za-z0-9]/, label: 'At least one special character' }, // special chars
  ];

  return {
    score: requirements.filter((req) => req.regex.test(password)).length,
    requirements,
    maxScore: requirements.length,
  };
};

// Define the form schema using Zod
const signupFormSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  const [password, setPassword] = useState('');
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

    // Social login handler
  const handleSocialLogin = (provider: 'github' | 'google') => {
    toast({
      title: 'Coming soon',
      description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be available soon.`,
      variant: 'default',
    });
  };

  // Password strength calculations
  const passwordStrengthPercent = Math.round((passwordStrength.score / passwordStrength.maxScore) * 100);
  const passwordStrengthLabel = 
    passwordStrength.score === 0 ? 'Very Weak' :
    passwordStrength.score <= 2 ? 'Weak' :
    passwordStrength.score <= 3 ? 'Medium' : 'Strong';
    
  // Get password meter class and style based on strength
  const getPasswordMeterProps = () => {
    const baseClass = passwordMeterStyles.meter;
    let strengthClass = '';
    
    if (passwordStrength.score === 0) {
      strengthClass = passwordMeterStyles.empty;
    } else if (passwordStrength.score <= 2) {
      strengthClass = passwordMeterStyles.weak;
    } else if (passwordStrength.score <= 3) {
      strengthClass = passwordMeterStyles.medium;
    } else {
      strengthClass = passwordMeterStyles.strong;
    }
    
    return {
      className: `${baseClass} ${strengthClass}`,
      style: passwordMeterStyles.width(passwordStrengthPercent),
      'aria-valuenow': passwordStrengthPercent,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuetext': `Password strength: ${passwordStrengthLabel}`,
      'aria-label': 'Password strength meter',
      role: 'progressbar'
    };
  };
  
  const passwordMeterProps = getPasswordMeterProps();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Sign up the user
      const { error: signUpError } = await signUp(data.email, data.password);
      
      if (signUpError) {
        throw signUpError;
      }
      
      // Automatically sign in the user after successful signup
      const { error: signInError } = await signIn(data.email, data.password);
      
      if (signInError) {
        throw signInError;
      }
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
        variant: 'success',
      });
      
      // Redirect to dashboard after successful signup and login
      navigate(config.dashboardUrl);
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      
      // Check if the error is an email already in use
      if (errorMessage.includes('already registered')) {
        toast({
          title: 'Email already in use',
          description: 'The email address is already registered. Please use a different email or sign in.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us today and start recording your meetings
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="mt-1">
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  disabled={isLoading}
                  {...register('fullName')}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password ? (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={passwordMeterStyles.container}>
                        <div {...passwordMeterProps} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      {passwordStrength.requirements.map((req, i) => {
                        const isMet = req.regex.test(password);
                        return (
                          <div key={i} className="flex items-center">
                            {isMet ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-gray-400 mr-1.5" />
                            )}
                            <span className={isMet ? 'text-green-600' : 'text-gray-500'}>{req.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin('github')}
                    type="button"
                    aria-label="Sign up with GitHub"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
              </div>

              <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin('google')}
                    type="button"
                    aria-label="Sign up with Google"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Google
                  </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
