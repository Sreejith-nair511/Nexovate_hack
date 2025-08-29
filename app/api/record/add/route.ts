import { NextRequest, NextResponse } from 'next/server';
import { getRecordManager } from '@/src/server/models/record';
import { getOrCreateKeypair, signPayload, verifySignedPayload } from '@/src/server/crypto/signing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recordId, 
      patientId, 
      doctorId, 
      hospitalId, 
      description,
      abhaId,
      consentArtifactId 
    } = body;

    // Validate required fields
    if (!recordId || !patientId || !doctorId || !hospitalId || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create keypair for the hospital
    const keyPair = await getOrCreateKeypair(hospitalId);

    // Create the record payload
    const recordPayload = {
      recordId,
      patientId,
      doctorId,
      hospitalId,
      description,
      abhaId,
      consentArtifactId,
      timestamp: Date.now()
    };

    // Sign the payload
    const signedPayload = signPayload(keyPair.privateKey, recordPayload);

    // Add record to the system
    const recordManager = getRecordManager();
    const result = await recordManager.addRecord(signedPayload, {
      recordId,
      patientId,
      doctorId,
      hospitalId,
      description,
      abhaId,
      consentArtifactId
    });

    return NextResponse.json({
      success: true,
      txId: result.txId,
      blockNo: result.blockNo,
      signatureVerified: result.signatureVerified,
      recordId
    });

  } catch (error) {
    console.error('Error adding record:', error);
    return NextResponse.json(
      { error: 'Failed to add record' },
      { status: 500 }
    );
  }
}
