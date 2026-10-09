import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: "120px 0" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500 }}>Page not found.</h1>
      <Link href="/">Back to the homepage →</Link>
    </div>
  );
}
