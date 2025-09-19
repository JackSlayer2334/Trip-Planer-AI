import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/clerk-react";
import Header from "./components/Header";
import Chatbox from "./components/Chatbox";

function App() {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <Header />
      <SignedIn>
        <div className="flex flex-col items-center mt-8">
          <UserButton afterSignOutUrl="/" />
          <Chatbox />
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
export default App;
