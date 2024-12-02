import { Button } from "@/components/ui/button";
import { signOut } from "@/auth"
import Link from "next/link";


export default function Home() {
  return (
   <>
   <div>Home
   <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
    <Button>
      <Link href="/dashboard">Dashboard</Link>
      </Button>
    
   </div>
   </>
  );
}
