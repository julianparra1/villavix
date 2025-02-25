import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin'; // Admin SDK

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid } = body;
    
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userRole = userDoc.data()?.role || 'ciudadano';
    
    await adminAuth.setCustomUserClaims(uid, { role: userRole });
    
    return NextResponse.json(
      { message: 'Claims set successfully', role: userRole },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting claims:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
