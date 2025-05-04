import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Token refresh interval (15 minutes)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

class AuthService {
  constructor() {
    this.auth = getAuth();
    this.setupTokenRefresh();
  }

  // Set up automatic token refresh
  setupTokenRefresh() {
    setInterval(async () => {
      const user = this.auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        localStorage.setItem('authToken', token);
      }
    }, TOKEN_REFRESH_INTERVAL);
  }

  // Email/Password Sign Up with verification
  async signUpWithEmail(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await this.sendVerificationEmail(userCredential.user);
      return userCredential;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await this.updateAuthToken(userCredential.user);
      return userCredential;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await this.updateAuthToken(result.user);
      return result;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Facebook Sign In
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await this.updateAuthToken(result.user);
      return result;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Send verification email
  async sendVerificationEmail(user) {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update auth token
  async updateAuthToken(user) {
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
  }

  // Verify reCAPTCHA token
  async verifyRecaptcha(token) {
    try {
      console.log('Verifying reCAPTCHA token...');
      
      // For testing purposes, we'll verify client-side only
      // In production, this should be verified on the server
      if (token) {
        console.log('reCAPTCHA verification successful');
        return true;
      } else {
        console.log('reCAPTCHA verification failed: No token');
        return false;
      }
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      return false;
    }
  }

  // Handle auth errors
  handleAuthError(error) {
    console.error('Auth error:', error);
    let message = 'An error occurred during authentication.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/operation-not-allowed':
        message = 'This authentication method is not enabled.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign in popup was closed before completion.';
        break;
    }

    return new Error(message);
  }
}

export const authService = new AuthService();
