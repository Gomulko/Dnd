const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY ?? "";
const MIN_SCORE = 0.5;

export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET) {
    // dev bez kluczy — przepuszcza
    return true;
  }
  try {
    const res = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
      { method: "POST" }
    );
    const data = (await res.json()) as { success: boolean; score: number };
    return data.success && data.score >= MIN_SCORE;
  } catch {
    return false;
  }
}
