import Navbar from "./Navbar";
import RequireAuth from "./RequireAuth";

export default function ProtectedLayout({ children }) {
  return (
    <RequireAuth>
      <Navbar />
      <div>{children}</div>
    </RequireAuth>
  );
}
