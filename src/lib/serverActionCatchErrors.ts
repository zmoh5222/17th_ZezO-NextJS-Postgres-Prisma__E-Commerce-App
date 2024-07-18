export default function serverActionCatchError(error: unknown) {
  if (error instanceof Error) {
    // general errors
    return {
      ok: false,
      error: {
        message: process.env.NODE_ENV === 'development' ? error.message : 'something went wrong, try again later'
      }
    }
  }
}