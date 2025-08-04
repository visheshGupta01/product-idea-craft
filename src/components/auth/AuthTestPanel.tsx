import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Shield, 
  Mail, 
  Key, 
  RefreshCw, 
  LogOut,
  TestTube,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const AuthTestPanel: React.FC = () => {
  const { 
    isAuthenticated, 
    userRole, 
    login, 
    logout, 
    signup, 
    verifyEmail, 
    forgotPassword, 
    resetPassword, 
    refreshToken 
  } = useUser();

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Test credentials
  const testUser = {
    email: 'test@example.com',
    password: 'testpass123',
    name: 'Test User'
  };

  const testAdmin = {
    email: 'admin@example.com',
    password: 'adminpass123',
    name: 'Admin User'
  };

  const runTest = async (testName: string, testFn: () => Promise<boolean>) => {
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      return result;
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
      return false;
    }
  };

  const testSignup = async () => {
    return runTest('signup', async () => {
      const result = await signup(testUser.name, testUser.email, testUser.password);
      return result.success;
    });
  };

  const testLogin = async () => {
    return runTest('login', async () => {
      const result = await login(testUser.email, testUser.password);
      return result.success;
    });
  };

  const testAdminLogin = async () => {
    return runTest('adminLogin', async () => {
      const result = await login(testAdmin.email, testAdmin.password);
      return result.success && result.role === 'admin';
    });
  };

  const testForgotPassword = async () => {
    return runTest('forgotPassword', async () => {
      const result = await forgotPassword(testUser.email);
      return result.success;
    });
  };

  const testRefreshToken = async () => {
    return runTest('refreshToken', async () => {
      const result = await refreshToken();
      return result.success;
    });
  };

  const testLogout = async () => {
    return runTest('logout', async () => {
      logout();
      return !authService.isAuthenticated();
    });
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});
    
    toast({
      title: "Running Authentication Tests",
      description: "Testing all authentication flows...",
    });

    // Test sequence
    await testSignup();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between tests
    
    await testLogin();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testForgotPassword();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isAuthenticated) {
      await testRefreshToken();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testLogout();
    }
    
    // Test admin login separately
    await testAdminLogin();
    
    setIsRunningTests(false);
    
    const passedTests = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    
    toast({
      title: "Tests Complete",
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? "default" : "destructive"
    });
  };

  const getTestIcon = (testName: string) => {
    if (!(testName in testResults)) return <TestTube className="h-4 w-4 text-gray-400" />;
    return testResults[testName] 
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Authentication Test Panel
        </CardTitle>
        <CardDescription>
          Test all authentication flows with your custom backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Status:</span>
            </div>
            <Badge variant={isAuthenticated ? "default" : "secondary"}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Badge>
            {userRole && (
              <Badge variant={userRole === 'admin' ? "default" : "outline"}>
                {userRole}
              </Badge>
            )}
          </div>
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          <h3 className="font-medium">Test Results:</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 border rounded">
              {getTestIcon('signup')}
              <span className="text-sm">User Signup</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              {getTestIcon('login')}
              <span className="text-sm">User Login</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              {getTestIcon('adminLogin')}
              <span className="text-sm">Admin Login</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              {getTestIcon('forgotPassword')}
              <span className="text-sm">Forgot Password</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              {getTestIcon('refreshToken')}
              <span className="text-sm">Refresh Token</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              {getTestIcon('logout')}
              <span className="text-sm">Logout</span>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="space-y-3">
          <Button 
            onClick={runAllTests} 
            disabled={isRunningTests}
            className="w-full"
          >
            {isRunningTests ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={testSignup} disabled={isRunningTests}>
              Test Signup
            </Button>
            <Button variant="outline" onClick={testLogin} disabled={isRunningTests}>
              Test Login
            </Button>
            <Button variant="outline" onClick={testAdminLogin} disabled={isRunningTests}>
              Test Admin
            </Button>
            <Button variant="outline" onClick={testForgotPassword} disabled={isRunningTests}>
              Test Reset
            </Button>
          </div>
        </div>

        {/* Backend Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Backend Endpoints:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• POST /signup - User registration</div>
            <div>• POST /login - User authentication</div>
            <div>• GET /verify - Email verification</div>
            <div>• POST /forget/password - Password reset request</div>
            <div>• POST /reset - Password reset</div>
            <div>• POST /refresh-token - Token refresh</div>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Test Credentials:</h4>
          <div className="text-sm text-yellow-800 space-y-1">
            <div><strong>User:</strong> {testUser.email} / {testUser.password}</div>
            <div><strong>Admin:</strong> {testAdmin.email} / {testAdmin.password}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
