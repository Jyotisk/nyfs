import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Lazily create the client inside the handler. Instantiating at module scope
// throws "key_id is mandatory" when the env vars are absent (e.g. during
// `next build`), which fails the whole build.
function getRazorpay(): Razorpay | null {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

// Allowed fixed amounts (in INR) to prevent arbitrary amount manipulation
const ALLOWED_AMOUNTS = [499, 999, 1499];

export async function POST(req: Request) {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payments are not configured.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { amount } = body;

    // --- Input Validation ---
    if (typeof amount !== 'number' || !Number.isInteger(amount)) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    if (!ALLOWED_AMOUNTS.includes(amount)) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: unknown) {
    // Log full error server-side, never leak internals to client
    console.error('Razorpay Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
