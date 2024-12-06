import SideNav from "@/app/ui/side-nav"




export default function HomeLayout({children}: {children: React.ReactNode}) {   
    return (
         <div className="flex">
          <SideNav />
          <div className="flex-1">
          {children} 
          </div>        
         </div>
      )
    
}