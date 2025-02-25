import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin'; // Note: no DB needed if using custom claims

export async function POST(request: Request) {
  try {
    console.log('Received request to verify token');
    const { token } = await request.json();

    if (!token) {
      console.error('No token provided');
      return NextResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 400 }
      );
    }

    // Verify the token using Firebase Admin Auth
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userRole = decodedToken.role;

    // Check if the user's role is either admin or funcionario
    if (!userRole || !['admin', 'funcionario'].includes(userRole)) {
      console.error('Unauthorized role for:', decodedToken, 'Role:', userRole);
      return NextResponse.json(
        { valid: false, error: 'Unauthorized role' },
        { status: 403 }
      );
    }

    // Return the valid response with UID and role
    return NextResponse.json({ 
      valid: true,
      uid: decodedToken.uid,
      role: userRole 
    });
  } catch (error: any) {
    console.error('Error verifying token:', error);
    const errorMessage = error.message || 'Invalid token';
    return NextResponse.json(
      { valid: false, error: errorMessage },
      { status: 401 }
    );
  }
}
